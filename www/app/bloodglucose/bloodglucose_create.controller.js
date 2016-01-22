(function() {
	angular.module('healthcafe.bloodglucose')
		.controller('BloodGlucoseCreateController', BloodGlucoseCreateController );

		BloodGlucoseCreateController.$inject = [ '$scope', '$controller', 'BloodGlucose' ];

		function BloodGlucoseCreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

      vm.relationships_to_meal = [
        { name: 'fasting' },
        { name: 'not fasting' }
      ];

		  return vm;
		}
})();
