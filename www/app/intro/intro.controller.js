(function() {
	angular.module('healthcafe.intro')
		.controller('IntroController', IntroController );

	IntroController.$inject = [ '$scope', '$ionicHistory', 'BodyHeight', 'Gender', 'DateOfBirth' ];

	function IntroController($scope, $ionicHistory, BodyHeight, Gender, DateOfBirth) {
	  var vm = this;

    // Method to reset navigation and disable back on the next page
    vm.resetNav = function() {
      $ionicHistory.nextViewOptions({
        disableBack: true,
      });
    }

    // Check whether personal data has been entered before. If not, ask the
    // user to do so
    vm.personal_data_required = true;

    // If any of the personal data items have been entered, the screen can be skipped
    BodyHeight.get().then(function() { vm.personal_data_required = false; })
    Gender.get().then(function() { vm.personal_data_required = false; })
    DateOfBirth.get().then(function() { vm.personal_data_required = false; })

		return this;
	}
})();
