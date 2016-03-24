(function() {
	angular.module('healthcafe.vita16')
    .controller('Vita16Controller', Vita16Controller );

		Vita16Controller.$inject = [ '$scope', '$controller', 'Vita16' ];

		function Vita16Controller( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = ".vita16-container";

      // Initialize the super class and extend it.
      //angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();
