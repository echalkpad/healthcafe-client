(function() {
	angular.module('healthcafe.generic')
		.controller('GenericAnswerController', GenericAnswerController );

		GenericAnswerController.$inject = ['$scope', '$ionicHistory', 'Answers']

  /**
   * Generic list controller to add a new datapoint
   **/
  function GenericAnswerController($scope, $ionicHistory, Answers) {
    var vm = this;

    vm.data = {
      body: {
        questionnaire: $scope.questionnaire,
        answers: $scope.defaultValues
      }
    };

    vm.save = function() {
      Answers.create(vm.data.body)
        .then(function(data) {
          $ionicHistory.goBack();
        })
        .catch(function(e) {
          console.log( "Error saving data: ", e );
        });
    };

    return vm;
  }

})();
