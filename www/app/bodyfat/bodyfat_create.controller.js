(function() {
	angular.module('healthcafe.bodyfat')
		.controller('BodyFatCreateController', BodyFatCreateController );

		BodyFatCreateController.$inject = [ '$scope', '$controller', 'BodyFat' ];

		function BodyFatCreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();
