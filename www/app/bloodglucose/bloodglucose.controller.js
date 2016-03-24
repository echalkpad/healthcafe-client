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
                  'units': 'mmol/L',
                  'chart': {
                    'pointFillColor' : '#4a90e2',
                    'pointStrokeColor' : '#0066d6',
                }, 
                'thresholds': [
                      { name: 'Desirable', max: 5.8 },
                      { name: 'Borderline high', min: 5.8, max: 7.8 },
                      { name: 'High', min: 7.8 },
                    ]
              },
              }
            };

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();


 