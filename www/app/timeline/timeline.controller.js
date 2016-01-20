(function() {
	angular.module('healthcafe.timeline')
		.controller('TimelineController', TimelineController );

		TimelineController.$inject = [ 'BloodPressure', 'BodyWeight', 'Remarks', '$q', '$ionicPopover'];

		function TimelineController(BloodPressure, BodyWeight, Remarks, $q, $ionicPopover) {
      var vm = this;

      var definitions = {
        'blood-pressure': { icon: 'ion-compass', color: 'info' },
        'body-weight': { icon: 'ion-speedometer', color: 'warning' },
      };

      /**
       * Converts a blood pressure datapoint into an event on the timeline
       */
      function convertDatapoint(dataPoint) {
        return {
          datapoint: dataPoint,
          date: dataPoint.header.creation_date_time,
          badgeIconClass: definitions[dataPoint.header.schema_id.name].icon,
          badgeClass: definitions[dataPoint.header.schema_id.name].color,
          type: 'measurement',
          measurementType: dataPoint.header.schema_id.name
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

      // Load the data
      load([BloodPressure, BodyWeight, Remarks]);

      // Enable the popover when clicking the add button
      $ionicPopover.fromTemplateUrl('app/timeline/add_menu.html').then(function(popover) {
        vm.popover = popover;
      });


      return vm;
		}
})();
