(function() {
	angular.module('healthcafe.bodyfat')
		.controller('BodyFatController', BodyFatController );

		BodyFatController.$inject = [ '$scope', '$controller', 'BodyFat' ];

		function BodyFatController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = '.bodyfat-container';
      $scope.chartableProperties = 'body_fat_percentage';
      $scope.chartOptions =   {
        'measures': {
          'body_fat_percentage': {
            'valueKeyPath': 'body.body_fat_percentage.value',
            'range': undefined,
            'units': '%',
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
