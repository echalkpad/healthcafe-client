(function() {
	angular.module('healthcafe.vita16')
		.controller('Vita16AnswerController', Vita16AnswerController );

  Vita16AnswerController.$inject = [ '$scope', '$controller', 'BMI' ];

		function Vita16AnswerController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();
