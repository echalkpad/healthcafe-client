(function() {
	angular.module('healthcafe.login')
		.factory('OAuth2', OAuth2 );

	OAuth2.$inject = [ 'config' ];

	function OAuth2(config) {
    function getToken() {
      var token = window.localStorage.getItem("token");

      if( token ) {
        return JSON.parse(token);
      }

      return null;
    }

    function isAuthenticated() {
      return !!getToken();
    }

    function getAccessToken() {
      var token = getToken();

      if( token ) {
        return token.oauth.access_token
      } else {
        return null;
      }
    }

    function getRefreshToken() {

    }

    function login() {
      // Generate login URL
      var apiConfig = config.current().api;

      url = apiConfig.urls.authorization +
              "?client_id=" + apiConfig.key +
              "&redirect_uri=" + encodeURIComponent(apiConfig.urls.redirect) +
              "&response_type=token" +
              "&scope=read_data_points write_data_points delete_data_points"

      window.location.href = url;
    }

    function logoff() {
      // Remove item from local storage
      window.localStorage.removeItem("token");
    }

    return {
      isAuthenticated: isAuthenticated,
      getAccessToken: getAccessToken,
      login: login,
      logoff: logoff
    }
  }
})();

