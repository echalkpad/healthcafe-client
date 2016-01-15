// Healthcafe routes
(function() {
	angular.module('healthcafe').config(function($stateProvider, $urlRouterProvider) {
	  // Ionic uses AngularUI Router which uses the concept of states
	  // Learn more here: https://github.com/angular-ui/ui-router
	  // Set up the various states which the app can be in.
	  // Each state's controller can be found in controllers.js
	  $stateProvider
		  //  Index page to distinguish between new users or users already logged in
		  .state('index', {
		    url: '/index',
		    controller: 'IndexController as index'
		  })

		  // Initial introduction page
		  .state('intro', {
		    url: '/intro',
		    templateUrl: 'app/intro/intro.html',
		    controller: 'IntroController as intro'
		  })

		  // Login screen for the user (in practice redirects to the NRC login screen)
		  .state('login', {
		    url: '/login',
		    templateUrl: 'app/login/login.html',
		    controller: 'LoginController as login'
		  })

		  // Cholesterol
		  .state('bloodpressure', {
		    url: '/bloodpressure',
        cache: false,
		    templateUrl: 'app/bloodpressure/list.html',
		    controller: 'BloodPressureController as bloodpressure'
		  })

		  // Add cholesterol measurement
		  .state('bloodpressure_add', {
		    url: '/bloodpressure/add',
		    templateUrl: 'app/bloodpressure/create.html',
		    controller: 'BloodPressureCreateController as bloodpressure'
		  })

	  // if none of the above states are matched, use this as the fallback
	  $urlRouterProvider.otherwise('/index');

	});
})();
