(function() {
	angular.module('healthcafe.bmi')
		.controller('BMICreateController', BMICreateController );

		BMICreateController.$inject = [ '$scope', '$controller', 'BMI' ];

		function BMICreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();
