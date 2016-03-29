(function() {
	angular.module('healthcafe.waistcircumference')
		.controller('WaistCircumferenceCreateController', WaistCircumferenceCreateController );

		WaistCircumferenceCreateController.$inject = [ '$scope', '$controller', 'WaistCircumference' ];

		function WaistCircumferenceCreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();
