(function() {
	angular.module('healthcafe.remarks')
		.controller('RemarksCreateController', RemarksCreateController );

		RemarksCreateController.$inject = [ '$scope', '$controller', 'Remarks' ];

		function RemarksCreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();
