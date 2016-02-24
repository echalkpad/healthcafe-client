(function() {
	angular.module('healthcafe')
		.controller('AppController', AppController);

	AppController.$inject = [ 'config' ];

	function AppController(config) {
	  var vm = this;

    vm.datatypes = config.datatypes;
    vm.sharing = config.sharing;

    return vm;
	}
})();
