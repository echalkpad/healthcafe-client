(function() {
	angular.module('healthcafe.cholesterol')
		.controller('CholesterolCreateController', CholesterolCreateController );

		CholesterolCreateController.$inject = [ '$scope', '$controller', 'Cholesterol' ];

		function CholesterolCreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();
