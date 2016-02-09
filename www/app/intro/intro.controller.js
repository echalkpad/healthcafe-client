(function() {
	angular.module('healthcafe.intro')
		.controller('IntroController', IntroController );

	IntroController.$inject = [ '$scope', '$ionicHistory' ];

	function IntroController($scope, $ionicHistory) {
	  var vm = this;

    // Method to reset navigation and disable back on the next page
    vm.resetNav = function() {
      $ionicHistory.nextViewOptions({
        disableBack: true,
      });
    }

		return this;
	}
})();
