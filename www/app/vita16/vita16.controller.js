(function() {
	angular.module('healthcafe.vita16')
    .controller('Vita16Controller', Vita16Controller );

		Vita16Controller.$inject = [ '$scope', '$controller', 'Answers' ];

		function Vita16Controller( $scope, $controller, Answers ) {
		  var vm = this;

      vm.data = []
      Answers.list().then(function(data) {
        vm.all = data;
      });

      vm.test = []
      Answers.listByQuestionnaire('vita16').then(function(data) {
        vm.vita16 = data;
      });

      $scope.selector = ".vita16-container";

		  return vm;
		}
})();
