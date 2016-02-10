(function() {
	angular.module('healthcafe.sharing')
		.controller('ShareController', ShareController );

		ShareController.$inject = [ '$state', 'OAuth2', 'config', 'Share'];

		function ShareController($state, OAuth2, config, Share) {
      var vm = this;

      var serviceKey = $state.params.service;

      // Check whether this user is already connected
      if( !OAuth2.isAuthenticated(serviceKey) ) {
        $state.go("app.connect", { service: serviceKey });
        return;
      }

      // Add information about the current service
      vm.serviceKey = serviceKey;
      vm.service = config.sharing[serviceKey];

      // Show the datatypes for the user to choose.
      var datatypes = config.datatypes.slice();

      // By default, all items are checked
      for( i in datatypes ) {
        datatypes[i].checked = true;
      }
      vm.datatypes = datatypes;

      // Method to import data
      vm.import = function() {
        Share.pull(serviceKey, vm.datatypes);
      }

      vm.export = function() {
        Share.push(serviceKey, vm.datatypes);
      }


      return vm;
		}
})();
