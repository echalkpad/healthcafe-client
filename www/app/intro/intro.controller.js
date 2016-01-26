(function() {
	angular.module('healthcafe.intro')
		.controller('IntroController', IntroController );

	IntroController.$inject = [ '$scope', '$ionicHistory', 'OAuth2' ];

	function IntroController($scope, $ionicHistory, OAuth2) {
	  var vm = this;
    $scope.$on('event:auth-unauthorized', function(event, data){
      OAuth2.login();
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
