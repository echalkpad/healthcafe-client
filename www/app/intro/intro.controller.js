(function() {
	angular.module('healthcafe.intro')
		.controller('IntroController', IntroController );

	IntroController.$inject = [ '$scope' ];

	function IntroController($scope) {
    $scope.$on('event:auth-unauthorized', function(event, data){
      $state.go( "login" );
    });

		return this;
	}
})();
