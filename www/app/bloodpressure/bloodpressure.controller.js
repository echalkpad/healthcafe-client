(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('BloodPressureController', BloodPressureController );

		BloodPressureController.$inject = [ 'BloodPressure' ];

		function BloodPressureController(Model) {
      var vm = this;

      function load() {
        vm.events = []
        Model.list().then(function(data) {
          vm.events = data;
        });
      }

      function refresh() {
        vm.events = []
        Model.load().then(function(data) {
          vm.events = data;
        });
      }

      vm.remove = function(id) {
        Model.remove(id).then(function() {
          refresh();
        });
      };

      load();

      return vm;
		}
})();
