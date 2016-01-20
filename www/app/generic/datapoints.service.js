(function() {
	angular.module('healthcafe.generic')
		.factory('Datapoints', DatapointsFactory );

  DatapointsFactory.$inject = [ '$http', '$q', 'uuid2', 'OAuth2' ];

	function DatapointsFactory($http, $q, uuid2, OAuth2) {
    // Converter is needed to convert input data into a proper body for
    // the openmhealth API
    var Datapoints = function(schema, converter) {
      this.schema = schema;
      this.converter = converter;
      this.cache = null;
    }

    Datapoints.prototype.load = function() {
      var url = 'http://localhost:8080/nrc/api/openmhealth/v1/dataPoints' +
                  '?schema_namespace=' + encodeURIComponent(this.schema.namespace) +
                  '&schema_name=' + encodeURIComponent(this.schema.name) +
                  '&schema_version=' + encodeURIComponent(this.schema.version);

      var datapoint = this;

      return $http.get( url ).then(function(response) {
        datapoint.cache = response.data;
        return datapoint .cache;
      });
    }

    Datapoints.prototype.list = function() {
      if( this.cache ) {
        return $q.when(this.cache);
      }

      return this.load()
    }

    Datapoints.prototype.get = function( id ) {
      var url = 'http://localhost:8080/nrc/api/openmhealth/v1/dataPoints/' + id;
      return $http.get( url )
    }

    Datapoints.prototype.remove = function( id ) {
      var url = 'http://localhost:8080/nrc/api/openmhealth/v1/dataPoints/' + id;
      return $http.delete( url )
    }

    Datapoints.prototype.create = function( body ) {
      var url = 'http://localhost:8080/nrc/api/openmhealth/v1/dataPoints';

      // Convert data if appropriate
      if( this.converter ) {
        body = this.converter(body);
      }

      var datapoint = this.createDatapoint(body);

      return $http.post( url, datapoint);
    }

    // Default values for the datapoint when creating one
    Datapoints.prototype.defaults = function() {
      return {};
    }

    Datapoints.prototype.createDatapoint = function( body ) {
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

