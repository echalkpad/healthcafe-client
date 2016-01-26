(function() {
	angular.module('healthcafe.timeline')
		.controller('TimelineController', TimelineController );

		TimelineController.$inject = [ 'BloodPressure', 'BodyWeight', 'BMI', 'BloodGlucose', 'Cholesterol', 'Remarks', '$q', '$ionicPopover', '$timeout'];

		function TimelineController(BloodPressure, BodyWeight, BMI, BloodGlucose, Cholesterol, Remarks, $q, $ionicPopover, $timeout) {
      var vm = this;

      var definitions = {
        'blood-pressure': { icon: 'ion-compass', model: BloodPressure },
        'body-weight': { icon: 'ion-speedometer', model: BodyWeight},
        'body-mass-index': { icon: 'ion-ios-flame', model: BMI},
        'blood-glucose': { icon: 'ion-fork', model: BloodGlucose},
        'cholesterol': { icon: 'ion-medkit', model: Cholesterol},
      };

      /**
       * Converts a blood pressure datapoint into an event on the timeline
       */
      function convertDatapoint(dataPoint) {
        return {
          id: dataPoint.header.id,
          datapoint: dataPoint,
          date: dataPoint.body.effective_time_frame.date_time,
          badgeIconClass: definitions[dataPoint.header.schema_id.name].icon,
          badgeClass: dataPoint.header.schema_id.name,
          type: 'measurement',
          measurementType: dataPoint.header.schema_id.name,
          model: definitions[dataPoint.header.schema_id.name].model
        };
      }

      /**
       * Converts an intervention into an event on the timeline
       */
      function convertIntervention(intervention) {
        return angular.extend({}, intervention, {
          badgeIconClass: 'ion-flash',
          badgeClass: 'remark',
          type: 'intervention',
          model: Remarks
        });
      }

      /**
       * Combines datapoints and inverventions into a single list
       * @param data  List with lists of datapoints or remarks
       */
      function combine( data ) {
        var events = flatten(
          data.map(function(entries) {
            return entries.map(function(element) {
              // Convert each element into the proper format
              // See convertDatapoint and convertIntervention for details
              if( element.header && element.body ) {
                return convertDatapoint(element);
              } else {
                return convertIntervention(element)
              }
            });
          })
        );

        // Sort by date descending
        return events.sort(function(a,b) {
          return new Date(b.date) - new Date(a.date);
        });
      }

      function flatten(arrays) {
        return [].concat.apply([], arrays);
      }

      function load(models) {
        vm.events = []
        $q.all( models.map(function(model) { return model.list() } ) ).then(function(data) {
          vm.events = combine(data);
        });
      }

      // Allow the client to reload
      vm.load = function() {
        var models = [BloodPressure, BodyWeight, BloodGlucose, BMI, Cholesterol, Remarks];
        load(models);
      }

      // Load the data on startup
      vm.load();

      // Enable deleting events
      vm.remove = function(event) {
        if(confirm('Are you sure?')) {
          // Perform the actual removal
          event.model.remove(event.id)
            // First tell the frontend the removing succeeded and wait 200ms for the animation to be finished
            .then(function() { event.removed = true; return $timeout(function() {}, 200); })

            // After that, do the real reloading of the data in the backend. THis will actually
            // delete the element from the cache and from the DOM
            .then(function() { return event.model.load(); })
            .then(function() { return vm.load(); })
        }
      }

      // Enable the popover when clicking the add button
      $ionicPopover.fromTemplateUrl('app/timeline/add_menu.html').then(function(popover) {
        vm.popover = popover;
      });

      return vm;
		}
})();
