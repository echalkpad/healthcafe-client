(function() {
	angular.module('healthcafe.bmi')
		.controller('BMIController', BMIController );

		BMIController.$inject = [ '$scope', '$controller', 'BMI' ];

		function BMIController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = ".bmi-container"

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();
