(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('BloodPressureController', BloodPressureController );

		BloodPressureController.$inject = [ '$scope', '$controller', 'BloodPressure' ];

		function BloodPressureController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = ".bloodpressure-container"

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();
