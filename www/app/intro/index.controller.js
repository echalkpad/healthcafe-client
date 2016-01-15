(function() {
	angular.module('healthcafe.intro')
		.controller('IndexController', IndexController );

	IndexController.$inject = [ 'OAuth2', '$state' ];

	function IndexController(OAuth2, $state) {
    var accessToken = OAuth2.getAccessToken();

    if( accessToken ) {
      console.log( "Current authorization parameters: ", accessToken )
      $state.go('bloodpressure');
    } else {
      console.log( "Not logged in: ", window.localStorage )
      $state.go('intro');
    }
	}
})();
