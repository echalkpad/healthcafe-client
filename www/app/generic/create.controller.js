(function() {
	angular.module('healthcafe.generic')
		.controller('GenericCreateController', GenericCreateController );

		GenericCreateController.$inject = ['$scope', '$ionicHistory']

  /**
   * Generic list controller to add a new datapoint
   **/
  function GenericCreateController($scope, $ionicHistory) {
    var vm = this;

    vm.data = typeof $scope.model.defaults != 'undefined' ? $scope.model.defaults() : {};

    vm.save = function() {
      $scope.model.create(vm.data).then(function(data) {
        $scope.model.load().then(function() {
          $ionicHistory.goBack();
         });
      });
    };

    return vm;
  }

})();
