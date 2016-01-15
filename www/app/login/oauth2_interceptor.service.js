(function() {
	angular.module('healthcafe.login')
		.factory('OAuth2Interceptor', OAuth2Interceptor );

	OAuth2Interceptor.$inject = [ 'OAuth2', '$rootScope', '$q' ];
	function OAuth2Interceptor(OAuth2, $rootScope, $q) {
    // Interceptor method to add access token to every request
    // See https://docs.angularjs.org/api/ng/service/$http
    function request(config) {
      config.headers[ 'Accept' ] = 'application/json';
      config.headers[ 'Authorization' ] = 'Bearer ' + OAuth2.getAccessToken()

      return config;
    }

    // Interceptor method to redirect the user to the login form, if a 401 is returned
    function responseError(rejection) {
      var config = rejection.config || {};
      if (!config.ignoreAuthModule) {
        switch (rejection.status) {
          case 401:
            // Redirect the user to the login form
            $rootScope.$broadcast('event:auth-unauthorized', rejection);
            break;
          case 403:
            $rootScope.$broadcast('event:auth-forbidden', rejection);
            break;
        }
      }

      // otherwise, default behaviour
      return $q.reject(rejection);
    }

    return {
      request: request,
      responseError: responseError
    }
  }
})();

