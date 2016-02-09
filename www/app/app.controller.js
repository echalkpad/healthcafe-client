(function() {
	angular.module('healthcafe')
		.controller('AppController', AppController);

	AppController.$inject = [ '$state', '$ionicSideMenuDelegate', '$ionicHistory', 'OAuth2' ];

	function AppController($state, $ionicSideMenuDelegate, $ionicHistory, OAuth2) {
	  var vm = this;

    return vm;
	}
})();
