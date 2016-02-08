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
      var schema = this.schema

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
        datapointStore.get(id).then(function(e) {
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

    Datapoints.prototype.create = function( body ) {
      var deferred = $q.defer();

      // Convert data if appropriate
      if( this.converter ) {
        body = this.converter(body);
      }

      // Create the datapoint itself
      var datapoint = this.createDatapoint(body);

      // Store the datapoint
      var schema = this.schema
      $indexedDB.openStore( 'datapoints', function(datapointStore) {
        datapointStore.insert(datapoint).then(function(e) {
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
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

    Datapoints.prototype.createDatapoint = function( body ) {
      // Store effective date_time
      body.effective_time_frame = { date_time: new Date() };

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
      }
    };
  }
})();

