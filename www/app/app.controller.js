(function() {
	angular.module('healthcafe')
		.controller('AppController', AppController);

	AppController.$inject = [ 'config' ];

	function AppController(config) {
	  var vm = this;

    vm.datatypes = config.datatypes;
    vm.questionnaires = config.questionnaires;
    vm.sharing = config.sharing;

    // Handle dropdown menus
    // See example on https://forum.ionicframework.com/t/expandable-list-in-ionic/3297
    vm.groupShown = 'measurements';
    vm.toggleGroup = function(group) {
      if(vm.isGroupShown(group))
        vm.groupShown = null;
      else
        vm.groupShown = group;
    }
    vm.isGroupShown = function(group) {
      return vm.groupShown == group;
    }

    return vm;
	}
})();
