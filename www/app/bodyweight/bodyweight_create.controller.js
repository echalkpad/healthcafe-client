(function() {
	angular.module('healthcafe.bodyweight')
		.controller('BodyWeightCreateController', BodyWeightCreateController );

		BodyWeightCreateController.$inject = [ '$scope', '$controller', 'BodyWeight' ];

		function BodyWeightCreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();
