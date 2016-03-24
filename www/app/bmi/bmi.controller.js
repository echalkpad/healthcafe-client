(function() {
	angular.module('healthcafe.bmi')
		.controller('BMIController', BMIController );

		BMIController.$inject = [ '$scope', '$controller', 'BMI' ];

		function BMIController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = ".bmi-container";
      $scope.chartableProperties = 'body-mass-index';
      $scope.chartOptions = {
              'measures': {
                'body-mass-index' : {
                  'valueKeyPath': 'body.body_mass_index.value',
                  'range': undefined,
                  'units': 'kg/m2',
                  'thresholds': { 'min': 18, 'max': 25  },
                },
              }
            };

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();
