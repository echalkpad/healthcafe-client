(function() {
	angular.module('healthcafe.cholesterol')
		.controller('CholesterolController', CholesterolController );

		CholesterolController.$inject = [ '$scope', '$controller', 'Cholesterol' ];

		function CholesterolController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = ".cholesterol-container"
      $scope.chartableProperties = 'total-cholesterol';
      $scope.chartOptions = {
              'measures': {
                'total-cholesterol' : {
                  'valueKeyPath': 'body.blood_total_cholesterol.value',
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
