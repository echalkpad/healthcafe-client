(function() {
	// Configuration for the trombose app.
	// The configuration is a regular map, which can be acccessed throughout the application
	var configuration = {
    // The ENV points to the set of settings being used.
    // See for example the api subconfiguration
    "env": "dev",

    // URLs to be used to talk to the API.
    "dev": {
      "api": {
        urls: {
          autorization: "http://localhost:8080/nrc/oauth/authorize",
          redirect: "http://localhost:8100/app/login/oauth_callback.html"
        },

        // NRC OAuth application key
        key: "mbm85kztfalztd2fft5fl5w7hmmdar5nnlktkgkk",
      }
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
