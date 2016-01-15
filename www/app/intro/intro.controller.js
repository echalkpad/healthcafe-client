(function() {
	angular.module('healthcafe.intro')
		.controller('IntroController', IntroController );

	IntroController.$inject = [ '$scope', '$ionicHistory' ];

	function IntroController($scope, $ionicHistory) {
	  var vm = this;
    $scope.$on('event:auth-unauthorized', function(event, data){
      $state.go( "login" );
    });

    // Method to reset navigation and disable back on the next page
    vm.resetNav = function() {
      $ionicHistory.nextViewOptions({
        disableBack: true,
      });
    }

		return this;
	}
})();
