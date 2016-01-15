(function() {
	angular.module('healthcafe.login')
		.factory('OAuth2', OAuth2 );

	function OAuth2() {
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

    return {
      isAuthenticated: isAuthenticated,
      getAccessToken: getAccessToken
    }
  }
})();

