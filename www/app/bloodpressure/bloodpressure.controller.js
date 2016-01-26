(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('BloodPressureController', BloodPressureController );

		BloodPressureController.$inject = [ '$scope', '$controller', 'BloodPressure' ];

		function BloodPressureController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = ".bloodpressure-container"
      $scope.chartableProperties = 'systolic_blood_pressure, diastolic_blood_pressure';
      $scope.chartOptions = {
        'userInterface': {
          'contentFormatter': function(d) {
            var systolic = d.omhDatum.body.systolic_blood_pressure.value.toFixed( 0 );
            var diastolic = d.omhDatum.body.diastolic_blood_pressure.value.toFixed( 0 );
            return systolic + '/' + diastolic;
          }
        }
      }

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();
