(function() {
	// Configuration for the trombose app.
	// The configuration is a regular map, which can be acccessed throughout the application
	var configuration = {
    // The ENV points to the set of settings being used.
    // See for example the api subconfiguration
    "env": "dev",

    // Generic configuration

    //
    // Sharing configuration determines the services the user can share data with
    //
    sharing: {
      healthcafe: {
        label: "NRC healthcafe",
        description: "Healthcafe is een concept, een werk-in-uitvoering, waar u binnnen de werkomgeving zelf bepaalde aspecten van uw gezondheid kan meten en daarop zelf kan acteren.",
        type: "openmhealth",
      }
    },

    //
    // Datatypes determine the menu items and the options for the user to share
    // Please note that the timeline and shareService have their own list of
    // datatypes, which should correspond to this list.
    // As the dependencies are injected there, we have to specify the dependencies
    // specifically there.
    datatypes: [
      { name: 'bloodpressure', controllerPrefix: 'BloodPressure', label: 'Bloeddruk' },
      { name: 'bodyweight', controllerPrefix: 'BodyWeight', label: 'Gewicht' },
      { name: 'bmi', controllerPrefix: 'BMI', label: 'BMI' },
      { name: 'bloodglucose', controllerPrefix: 'BloodGlucose', label: 'Bloedglucose' },
      { name: 'cholesterol', controllerPrefix: 'Cholesterol', label: 'Cholesterol' },
    ],

    // Development configuration
    "dev": {
      "api": {
        oauth: {
          healthcafe: {
            urls: {
              authorization: "http://localhost:8080/nrc/oauth/authorize",
              redirect: "http://localhost:8100/app/login/oauth_callback.html?healthcafe",
              dataPoints: "http://localhost:8080/nrc/api/openmhealth/v1/dataPoints"
            },

            // NRC OAuth application key
            key: "mbm85kztfalztd2fft5fl5w7hmmdar5nnlktkgkk",
          }
        }
      },
    },

    // Test configuration, used for testing the app with the healthcafe instance
    "test": {
      "api": {
        oauth: {
          healthcafe: {
            urls: {
              authorization: "https://humanstudies.tno.nl/healthcafe/oauth/authorize",
              redirect: "http://isdatsoftwareontwikkeling.nl/projecten/healthcafe/app/login/oauth_callback.html?healthcafe",
              dataPoints: "https://humanstudies.tno.nl/healthcafe/api/openmhealth/v1/dataPoints"
            },

            // NRC OAuth application key
            key: "hm2lkbxyssh9vvsn4tjpknavhqifmkzmucrl500o",
          }
        }
      },
    },

  };

	// Convenience method to use environments in configuration
	configuration.current = function() {
		return configuration[configuration.env];
	}

  // Store configuration in main module
	angular.module('healthcafe')

	  .constant('config', configuration )

    .config( ['$httpProvider', '$indexedDBProvider', function($httpProvider, $indexedDBProvider) {
      $httpProvider.interceptors.push('OAuth2Interceptor');

      // Initialize indexed DB
      $indexedDBProvider
        .connection( 'healthcafe' )
        .upgradeDatabase(1, function(event, db, tx) {
          datapointsStore = db.createObjectStore( "datapoints", { keyPath: "header.id" } );
          datapointsStore.createIndex('schema', [ 'header.schema_id.namespace', 'header.schema_id.name', 'header.schema_id.version'], { 'unique': false } );
          remarksStore = db.createObjectStore( "remarks", { keyPath: "id", autoIncrement: true } );
        })
    }])
})();
