(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('BloodPressureController', BloodPressureController );

		BloodPressureController.$inject = [ 'BloodPressure' ];

		function BloodPressureController(Model) {
      var vm = this;

      /**
       * Converts a blood pressure datapoint into an event on the timeline
       */
      function convertDatapoint(dataPoint) {
        return {
          datapoint: dataPoint,
          date: dataPoint.header.creation_date_time,
          badgeIconClass: 'ion-pinpoint',
          badgeClass: 'info',
          type: 'measurement'
        };
      }

      /**
       * Converts an intervention into an event on the timeline
       */
      function convertIntervention(intervention) {
        return angular.extend({}, intervention, {
          badgeIconClass: 'ion-flash',
          badgeClass: 'danger',
          type: 'intervention'
        });
      }


      /**
       * Combines datapoints and inverventions into a single list
       */
      function combine( datapoints, interventions ) {
        var datapointEvents = datapoints.map(convertDatapoint);
        var interventionEvents = interventions.map(convertIntervention);

        // Combine both lists and sort descending
        return datapointEvents.concat(interventionEvents).sort(function(a,b) {
          return new Date(b.date) - new Date(a.date);
        });
      }

      function interventions() {
        return [
          {
            date: new Date( 2016, 0, 1, 10, 20, 30 ),
            message: "Started using blood pressure medicine"
          },
          {
            date: new Date( 2016, 0, 9, 10, 20, 30 ),
            message: "Severe flu"
          }
        ]
      }

      function load() {
        vm.events = []
        Model.list().then(function(data) {
          vm.events = combine(data, interventions());
        });
      }

      function refresh() {
        vm.events = []
        Model.load().then(function(data) {
          vm.events = combine(data, interventions());
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
