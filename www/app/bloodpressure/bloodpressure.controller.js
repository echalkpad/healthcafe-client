(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('BloodPressureController', BloodPressureController );

		BloodPressureController.$inject = [ 'BloodPressure' ];

		function BloodPressureController(Model) {
      var vm = this;

      /**
       * Converts a blood pressure datapoint into an event on the timeline
       */
      function convert(dataPoint) {
        return {
          datapoint: dataPoint,
          badgeIconClass: 'ion-clock',
          badgeClass: 'info'
        };
      }

      function load() {
        vm.events = []
        Model.list().then(function(data) {
          vm.events = data.map(convert);
        });
      }

      function refresh() {
        vm.events = []
        Model.load().then(function(data) {
          vm.events = data.map(convert);
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
