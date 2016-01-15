(function() {
	angular.module('healthcafe')
		.controller('AppController', AppController);

	AppController.$inject = [ '$state', '$ionicSideMenuDelegate', '$ionicHistory', 'OAuth2' ];

	function AppController($state, $ionicSideMenuDelegate, $ionicHistory, OAuth2) {
	  var vm = this;

    // Form data for the login modal
    vm.loginData = {};
    vm.isAuthenticated = OAuth2.isAuthenticated();

    // Login method
    vm.login = OAuth2.login;

    // Logoff method
    vm.logoff = function() {
      OAuth2.logoff();
      vm.isAuthenticated = false;

      // Reset menu and navigation history
      $ionicSideMenuDelegate.toggleLeft(false);
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
    }

    return vm;
	}
})();
