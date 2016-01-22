(function() {
	angular.module('healthcafe.bodyweight')
		.controller('BodyWeightController', BodyWeightController );

		BodyWeightController.$inject = [ '$scope', '$controller', 'BodyWeight' ];

		function BodyWeightController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = '.bodyweight-container';
      $scope.chartableProperties = 'body_weight';
      $scope.chartOptions =   {
        'measures': {
          'body_weight': {
            'range': undefined,
            'thresholds': { 'max': null },  // Disable default threshold
          },
        }
      };

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();
