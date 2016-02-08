(function() {
	// Configuration for the trombose app.
	// The configuration is a regular map, which can be acccessed throughout the application
	var configuration = {
    // The ENV points to the set of settings being used.
    // See for example the api subconfiguration
    "env": "test",

    // Development configuration
    "dev": {
      "api": {
        urls: {
          authorization: "http://localhost:8080/nrc/oauth/authorize",
          redirect: "http://localhost:8100/app/login/oauth_callback.html",
          dataPoints: "http://localhost:8080/nrc/api/openmhealth/v1/dataPoints"
        },

        // NRC OAuth application key
        key: "mbm85kztfalztd2fft5fl5w7hmmdar5nnlktkgkk",
      },
    },

    // Test configuration, used for testing the app with the healthcafe instance
    "test": {
      "api": {
        urls: {
          authorization: "https://humanstudies.tno.nl/healthcafe/oauth/authorize",
          redirect: "http://isdatsoftwareontwikkeling.nl/projecten/healthcafe/app/login/oauth_callback.html",
          dataPoints: "https://humanstudies.tno.nl/healthcafe/api/openmhealth/v1/dataPoints"
        },

        // NRC OAuth application key
        key: "hm2lkbxyssh9vvsn4tjpknavhqifmkzmucrl500o",
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

    .config(function($httpProvider) {
      $httpProvider.interceptors.push('OAuth2Interceptor');
    })
})();
