(function() {
	angular.module('healthcafe.waistcircumference')
		.controller('WaistCircumferenceController', WaistCircumferenceController );

		WaistCircumferenceController.$inject = [ '$scope', '$controller', 'WaistCircumference' ];

		function WaistCircumferenceController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = '.waist-container';
      $scope.chartableProperties = 'waist_circumference';
      $scope.chartOptions =   {
        'measures': {
          'waist_circumference': {
            'valueKeyPath': 'body.waist_circumference.value',
            'range': undefined,
            'units': 'm',
            'chart': {
              'pointFillColor' : '#4a90e2',
              'pointStrokeColor' : '#0066d6',
            },
          },
        }
      };

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();
