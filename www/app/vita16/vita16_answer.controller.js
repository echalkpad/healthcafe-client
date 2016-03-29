(function() {
	angular.module('healthcafe.vita16')
		.controller('Vita16AnswerController', Vita16AnswerController );

  Vita16AnswerController.$inject = [ '$scope', '$controller' ];

		function Vita16AnswerController( $scope, $controller ) {
		  var vm = this;

      var defaultValues = {
        q01: 4,
        q02: 4,
        q03: 4,
        q04: 4,
        q05: 4,
        q06: 4,
        q07: 4,
        q08: 4,
        q09: 4,
        q10: 4,
        q11: 4,
        q12: 4,
        q13: 4,
        q14: 4,
        q15: 4,
        q16: 4,
        q17: 4
      };

      $scope.questionnaire = 'vita16';
      $scope.defaultValues = defaultValues;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericAnswerController', {$scope: $scope}));

		  return vm;
		}
})();
