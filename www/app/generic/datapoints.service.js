(function() {
	angular.module('healthcafe.generic')
		.factory('Datapoints', DatapointsFactory );

  DatapointsFactory.$inject = [ '$http', '$q', 'uuid2', 'OAuth2', 'config', '$indexedDB' ];

	function DatapointsFactory($http, $q, uuid2, OAuth2, config, $indexedDB) {

    /**
     * Constructor for a generic datapoint service. Available methods (returning a promise to perform the work async):
     *    load      Loads datapoints with the given schema from the NRC instance
     *    list      Returns datapoints with the given schema (from cache, if possible, otherwise using load())
     *    get       Returns a datapoint with the given ID
     *    remove    Removes a datapoint with the given ID
     *    create    Creates a new datapoint. Data specified is being converted using the converter (specified in the constructor)
     *
     *  The following methods return some metadata immediately
     *
     *    defaults  Returns a map with default values to show when a user creates a new datapoint
     *    chartableProperties Returns a comma-separated string with properties that can be charted for this datatype
     *
     * @param schema map with namespace, name and version, identifying the schema for this datatype
     * @param chartablePropertyNames Comma-separated string with properties that can be charted for this datatype
     * @param converter method to convert the data from a newly created dataobject (see GenericCreateController) into a OMH datapoint body
     */
    var Datapoints = function(schema, converter) {
      this.schema = schema;

      // Converter is needed to convert input data into a proper body for
      // the openmhealth API
      this.converter = converter;

      // Initialize empty cache
      this.cache = null;
    }

    Datapoints.prototype.load = function() {
      var deferred = $q.defer();
      var schema = this.schema;

      $indexedDB.openStore( 'datapoints', function(datapointStore) {
        var query = datapointStore.query()
          .$index("schema")
          .$eq([schema.namespace, schema.name, schema.version]);

//        query = query.$eq([schema.namespace, schema.name, schema.version]);
//        query = query.$index("schema");

        datapointStore.findWhere(query).then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    Datapoints.prototype.list = function() {
      if( this.cache ) {
        return $q.when(this.cache);
      }

      return this.load()
    }

    Datapoints.prototype.get = function( id ) {
      var deferred = $q.defer();

      $indexedDB.openStore( 'datapoints', function(datapointStore) {
        datapointStore.find(id).then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    Datapoints.prototype.remove = function( id ) {
      var deferred = $q.defer();

      $indexedDB.openStore( 'datapoints', function(datapointStore) {
        datapointStore.delete(id).then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    Datapoints.prototype.create = function(body, date) {
      // Convert data if appropriate
      if( this.converter ) {
        body = this.converter(body);
      }

      // If invalid data is specified, according to the converter,
      // tell the user
      if( !body ) {
        return $q.reject("Invalid data specified");
      }

      var deferred = $q.defer();

      // Create the datapoint itself
      var datapoint = this.createDatapoint(body, date);

      // Store the datapoint
      var schema = this.schema;
      $indexedDB.openStore( 'datapoints', function(datapointStore) {
        datapointStore.insert(datapoint).then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    // Imports a datapoint or list of datapoints into the store
    // Existing data with the same ID will be overwritten
    Datapoints.prototype.import = function(data) {
      var deferred = $q.defer();

      // Handle dates, which are sent as string
      function parseDate(date) {
        if( date && typeof(date) == "string" ) {
          return new Date(date);
        } else {
          return date;
        }
      }

      if(Array.isArray(data)) {
        var that = this;
        data = data.map(function(datapoint) { return that.convertDates(datapoint, parseDate); } );
      } else if(typeof(data) == "object") {
        data = this.convertDates(data, parseDate);
      }

      // Store the datapoint
      $indexedDB.openStore( 'datapoints', function(datapointStore) {
        datapointStore.upsert(data).then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    // Convert all known dates for a single datapoint
    Datapoints.prototype.convertDates = function(datapoint, conversionMethod) {
      if(datapoint.header && datapoint.header.creation_date_time)
        datapoint.header.creation_date_time = conversionMethod(datapoint.header.creation_date_time);

      if(datapoint.header && datapoint.header.acquisition_provenance && datapoint.header.acquisition_provenance.source_creation_date_time)
        datapoint.header.acquisition_provenance.source_creation_date_time = conversionMethod(datapoint.header.acquisition_provenance.source_creation_date_time);

      if( datapoint.body && datapoint.body.effective_time_frame && datapoint.body.effective_time_frame.date_time)
        datapoint.body.effective_time_frame.date_time = conversionMethod(datapoint.body.effective_time_frame.date_time);

      return datapoint;
    }

    // Default values for the datapoint when creating one
    Datapoints.prototype.defaults = function() {
      return {};
    }

    /**
     * Returns a comma-separated-string with properties that can be charted for this datatype. See OMH Web Visualizations
     */
    Datapoints.prototype.chartableProperties = function() {
      return this.propertyNames;
    }

    Datapoints.prototype.createDatapoint = function( body, date ) {
      if( typeof(date) == 'undefined' )
        date = new Date();

      // Store effective date_time
      body.effective_time_frame = { date_time: date };

      return {
        header: {
          id: uuid2.newuuid(),
          creation_date_time: new Date(),
          acquisition_provenance: {
            source_name: 'Manual',
            source_creation_date_time: new Date(),
            modality: 'self-reported'
          },
          schema_id: this.schema
        },
        body: body
      }
    }

    return {
      getInstance: function( schema, converter ) {
        return new Datapoints(schema, converter)
      },
    };
  }
})();

