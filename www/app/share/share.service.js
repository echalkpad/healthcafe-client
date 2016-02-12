(function() {
	angular.module('healthcafe.sharing')
		.factory('Share', Share );

  Share.$inject = [ '$indexedDB', '$q', '$http', 'config', 'BloodPressure', 'BodyWeight', 'BMI', 'BloodGlucose', 'Cholesterol' ];

  function Share($indexedDB, $q, $http, config, BloodPressure, BodyWeight, BMI, BloodGlucose, Cholesterol) {
    var cache = null;

    function pull(serviceKey, selectedDatatypes) {
      var serviceConfig = config.sharing[serviceKey];
      var models = getModelsForSelectedDatatypes(selectedDatatypes);

      if( !serviceConfig ) {
        console.error( "Importing data from invalid service", serviceKey );
        return $q.reject( "Importing data from invalid service");
      }

      switch( serviceConfig.type ) {
        case "openmhealth":
          return openmHealthImport(serviceKey, models);
        default:
          console.error( "Service type for given service is not supported", serviceKey, serviceConfig.type );
          return $q.reject("Service type for given service is not supported");
      }
    }

    function push(serviceKey, selectedDatatypes) {
      var serviceConfig = config.sharing[serviceKey];
      var models = getModelsForSelectedDatatypes(selectedDatatypes);

      if( !serviceConfig ) {
        console.error( "Exporting data to invalid service", serviceKey );
        return $q.reject( "Exporting data to invalid service");
      }

      switch( serviceConfig.type ) {
        case "openmhealth":
          return openmHealthExport(serviceKey, models);
        default:
          console.error( "Service type for given service is not supported", serviceKey, serviceConfig.type );
          return $q.reject("Service type for given service is not supported");
      }
    }

    /**
     * Returns a list of models for the selected datatypes
     */
    function getModelsForSelectedDatatypes(selectedDatatypes) {
      return selectedDatatypes
        .filter(function(datatype) { return datatype.checked; })
        .map(function(datatype) {
          switch( datatype.name ) {
            case 'bloodpressure': return BloodPressure;
            case 'bloodglucose':  return BloodGlucose;
            case 'bodyweight':    return BodyWeight;
            case 'cholesterol':   return Cholesterol;
            case 'bmi':           return BMI;
            default: console.log( "Invalid datatype selected", datatype.name ); return null;
          }
        });
    }

    // Specific import and export methods
    // Currently there is only a single one for openmhealth
    // TODO: Refactor in such a way that multiple types of services are easily supported
    /**
     * Imports data from openmhealth endpoint
     */
    function openmHealthImport(serviceKey, models) {
      var serviceConfig = config.current().api.oauth[serviceKey];

      if( !serviceConfig ) {
        console.error( "OAuth parameters for given service are not provided in configuration", serviceKey );
        return $q.reject("OAuth parameters for given service are not provided in configuration");
      }

      return $q.all(
        models.map(function(model) {
          // Blood glucose
          var url = serviceConfig.urls.dataPoints +
                      '?schema_namespace=' + encodeURIComponent(model.schema.namespace) +
                      '&schema_name=' + encodeURIComponent(model.schema.name) +
                      '&schema_version=' + encodeURIComponent(model.schema.version);

          return $http.get( url, { oauth: serviceKey } ).then(function(response) {
            // Handle data points. Assuming the UUIDs are actually unique, we may still
            // find the datapoint already existing in our local storage (e.g. when data
            // was entered here and shared with the remote endpoint, or data was imported
            // before). In that case, we will overwrite the existing data.
            return model.import(response.data);
          });
        })
      );
    }

    /**
     * Exports data to openmhealth endpoint
     */
    function openmHealthExport(serviceKey, models) {
      var serviceConfig = config.current().api.oauth[serviceKey];

      if( !serviceConfig ) {
        console.error( "OAuth parameters for given service are not provided in configuration", serviceKey );
        return $q.reject("OAuth parameters for given service are not provided in configuration");
      }

      return $q.all(
        models.map(function(model) {
          return model.list().then(function(datapoints) {

            var url = serviceConfig.urls.dataPoints;

            return $q.all(
              datapoints.map(function(datapoint) {
                // Convert any date into an ISO8601 formatted string
                function serializeDate(date) {
                  if( typeof( date ) == "object" ) {
                    return date.toJSON();
                  } else {
                    return date;
                  }
                }

                datapoint = model.convertDates(datapoint, serializeDate);

                console.log(datapoint.body.effective_time_frame.date_time)
                // return $q.when("ab");
                return $http.post(url, datapoint, { oauth: serviceKey } );
              })
            );
          });
        })
      );
    }

    return {
      pull: pull,
      push: push,
    }
  }

})();

