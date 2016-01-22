(function() {
	angular.module('healthcafe.bodyweight')
		.controller('BodyWeightController', BodyWeightController );

		BodyWeightController.$inject = [ '$scope', '$controller', 'BodyWeight' ];

		function BodyWeightController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = '.bodyweight-container';

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();
