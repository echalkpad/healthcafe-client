(function() {
	angular.module('healthcafe.bloodglucose')
		.controller('BloodGlucoseController', BloodGlucoseController );

		BloodGlucoseController.$inject = [ '$scope', '$controller', 'BloodGlucose' ];

		function BloodGlucoseController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = ".bloodglucose-container"
      $scope.chartableProperties = 'blood-glucose';
      $scope.chartOptions = {
              'measures': {
                'blood-glucose' : {
                  'valueKeyPath': 'body.blood_glucose.value',
                  'range': undefined,
                  'units': 'mg/dL',
                },
              }
            };

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();
