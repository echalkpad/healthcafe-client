(function() {
	angular.module('healthcafe')
		.controller('AppController', AppController);

	AppController.$inject = [ 'config' ];

	function AppController(config) {
	  var vm = this;

    vm.datatypes = config.datatypes;
    vm.questionnaires = config.questionnaires;
    vm.sharing = config.sharing;

    return vm;
	}
})();
