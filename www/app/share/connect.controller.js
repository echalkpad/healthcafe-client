(function() {
	angular.module('healthcafe.sharing')
		.controller('ConnectController', ConnectController );

		ConnectController.$inject = [ '$state', 'OAuth2', 'config'];

		function ConnectController($state, OAuth2, config) {
      var vm = this;

      var serviceKey = $state.params.service;

      // Check whether this user is already connected
      if( OAuth2.isAuthenticated(serviceKey) ) {
        $state.go("app.share", { service: serviceKey });
        return;
      }

      // Add information about the current service
      vm.serviceKey = serviceKey;
      vm.service = config.sharing[serviceKey];

      // Method to start connecting with the current service
      vm.login = function() {
        // Login using OAuth and redirect to the sharing page afterwards
        OAuth2.login(serviceKey, '/app/share/' + serviceKey )
      }

      return vm;
		}
})();
