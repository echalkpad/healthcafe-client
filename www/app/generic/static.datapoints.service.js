(function() {
	angular.module('healthcafe.generic')
		.factory('StaticDatapoint', StaticDatapointsFactory );

  StaticDatapointsFactory.$inject = [ '$http', '$q', 'uuid2', 'OAuth2', 'config', '$indexedDB' ];

	function StaticDatapointsFactory($http, $q, uuid2, OAuth2, config, $indexedDB) {

    /**
     * Constructor for a generic static datapoint service. This service is expected to contain only
     * a single datapoint. Please note that some methods are available to keep the same interface
     * as the Datapoint object.
     *
     * Available methods (returning a promise to perform the work async):
     *    load      Loads datapoints with the given schema from the NRC instance
     *    list      Returns datapoints with the given schema (from cache, if possible, otherwise using load())
     *    import    Imports a list of datapoints into storage
     *
     *    get       Returns the current (static) datapoint
     *    set       Sets the current (static) datapoint. Please note that internally a new datapoint with a new UUID will be created.
     *    remove    Removes the current (static) datapoint
     *
     * @param schema map with namespace, name and version, identifying the schema for this datatype
     * @param chartablePropertyNames Comma-separated string with properties that can be charted for this datatype
     * @param converter method to convert the data from a newly created dataobject (see GenericCreateController) into a OMH datapoint body
     * @todo  Make this object inherit from the default datapoints object, to increase DRY
     */
    var StaticDatapoint = function(schema, converter) {
      this.schema = schema;

      // Converter is needed to convert input data into a proper body for
      // the openmhealth API
      this.converter = converter;

      // Initialize empty cache
      this.cache = null;
    }

    StaticDatapoint.prototype.load = function() {
      var deferred = $q.defer();
      var schema = this.schema

      $indexedDB.openStore( 'datapoints', function(datapointStore) {
        var query = datapointStore.query()
          .$index("schema")
          .$eq([schema.namespace, schema.name, schema.version]);

        datapointStore.findWhere(query).then(function(e) {
          this.cache = e;
          deferred.resolve(e);
        }).catch(function(e) {
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }

    StaticDatapoint.prototype.list = function() {
      if( this.cache ) {
        return $q.when(this.cache);
      }

      return this.load()
    }

    StaticDatapoint.prototype.get = function() {
      var deferred = $q.defer();

      this.list().then(function(datapoints) {
        if(datapoints.length > 0)
          deferred.resolve(datapoints[0]);
        else
          deferred.reject('No datapoints available');
      }).catch(function(e) {
        deferred.reject(e);
      });

      return deferred.promise;
    }

    StaticDatapoint.prototype.remove = function() {
      var deferred = $q.defer();

      this.get().then(function(element) {
        $indexedDB.openStore( 'datapoints', function(datapointStore) {
          datapointStore.delete(element.header.id).then(function(e) {
            deferred.resolve();
          }).catch(function(e) {
            deferred.reject(e);
          });
        });
      }).catch(function(e) {
        // If no element could be find, it's fine as well
        deferred.resolve();
      });

      return deferred.promise;
    }

    StaticDatapoint.prototype.set = function(body, date) {
      // Convert data if appropriate
      if( this.converter ) {
        body = this.converter(body);
      }

      if(typeof(date) == 'undefined') {
        date = new Date();
      }

      // If invalid data is specified, according to the converter,
      // tell the user
      if( !body ) {
        return $q.reject("Invalid data specified");
      }

      var deferred = $q.defer();

      // Check if the value has changed, If not, don't create a new datapoint
      this.get().then(function(element) {
        var existingRelevantBody = angular.copy(element.body);
        delete existingRelevantBody.effective_time_frame;

        if(JSON.stringify(existingRelevantBody) != JSON.stringify(body)) {
          store();
        } else {
          // No change, just return the existing datapoint
          deferred.resolve(element);
        }
      }).catch(function() {
        // If no previous object exists, store anyway
        store();
      })

      var that = this;
      function store() {
        // Create the datapoint itself
        var datapoint = that.createDatapoint(body, date);

        // First delete the current datapoint
        that.remove().then(function() {
          // Store the datapoint
          var schema = this.schema
          $indexedDB.openStore( 'datapoints', function(datapointStore) {
            datapointStore.insert(datapoint).then(function(e) {
              deferred.resolve(e);
            }).catch(function(e) {
              deferred.reject(e);
            });
          });
        }).catch(function(e) {
          deferred.reject(e);
        });
      }

      return deferred.promise;
    }

    // Imports a datapoint or list of datapoints into the store
    // Existing data with the same ID will be overwritten
    StaticDatapoint.prototype.import = function(data) {
      var deferred = $q.defer();

      // Handle dates, which are sent as string
      function parseDate(date) {
        if( date && typeof(date) == "string" ) {
          return new Date(date);
        } else {
          return date;
        }
      }

      // As this is static data, we should only keep a single datapoint
      if(Array.isArray(data)) {
        data = this.convertDates(data[0], parseDate);
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
    StaticDatapoint.prototype.convertDates = function(datapoint, conversionMethod) {
      if(datapoint.header && datapoint.header.creation_date_time)
        datapoint.header.creation_date_time = conversionMethod(datapoint.header.creation_date_time);

      if(datapoint.header && datapoint.header.acquisition_provenance && datapoint.header.acquisition_provenance.source_creation_date_time)
        datapoint.header.acquisition_provenance.source_creation_date_time = conversionMethod(datapoint.header.acquisition_provenance.source_creation_date_time);

      if( datapoint.body && datapoint.body.effective_time_frame && datapoint.body.effective_time_frame.date_time)
        datapoint.body.effective_time_frame.date_time = conversionMethod(datapoint.body.effective_time_frame.date_time);

      return datapoint;
    }

    StaticDatapoint.prototype.createDatapoint = function( body, date ) {
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
        return new StaticDatapoint(schema, converter)
      },
    };
  }
})();

