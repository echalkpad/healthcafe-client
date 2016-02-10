(function() {
	angular.module('healthcafe.login')
		.factory('OAuth2', OAuth2 );

	OAuth2.$inject = [ 'config' ];

	function OAuth2(config) {
    function getToken(service) {
      var token = window.localStorage.getItem("token-" + service);

      if( token ) {
        return JSON.parse(token);
      }

      return null;
    }

    function isAuthenticated(service) {
      return !!getToken(service);
    }

    function getAccessToken(service) {
      var token = getToken(service);

      if( token ) {
        return token.oauth.access_token
      } else {
        return null;
      }
    }

    function getRefreshToken() {

    }

    function login(service, redirect) {
      // Make sure the oauth callback page knows where to redirect the user
      window.localStorage.setItem( "redirect-" + service, redirect );

      // Generate login URL
      var apiConfig = config.current().api;
      var serviceConfig = apiConfig.oauth[service];
      var serviceUrls = serviceConfig.urls;

      url = serviceUrls.authorization +
              "?client_id=" + serviceConfig.key +
              "&redirect_uri=" + encodeURIComponent(serviceUrls.redirect) +
              "&response_type=token" +
              "&scope=read_data_points write_data_points delete_data_points"

      window.location.href = url;
    }

    function logoff(service) {
      // Remove item from local storage
      window.localStorage.removeItem("token-" + service);
    }

    return {
      isAuthenticated: isAuthenticated,
      getAccessToken: getAccessToken,
      login: login,
      logoff: logoff
    }
  }
})();

