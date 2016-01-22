(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('BloodPressureCreateController', BloodPressureCreateController );

		BloodPressureCreateController.$inject = [ '$scope', '$controller', 'BloodPressure' ];

		function BloodPressureCreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();
