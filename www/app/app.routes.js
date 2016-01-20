// Healthcafe routes
(function() {
	angular.module('healthcafe').config(function($stateProvider, $urlRouterProvider) {
	  // Ionic uses AngularUI Router which uses the concept of states
	  // Learn more here: https://github.com/angular-ui/ui-router
	  // Set up the various states which the app can be in.
	  // Each state's controller can be found in controllers.js
	  $stateProvider
      // Main App layout with left menu
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/layout.html',
        controller: 'AppController as app'
      })

		  // Initial introduction page
		  .state('app.intro', {
		    url: '/intro',
        views: {
          'mainContent': {
            templateUrl: 'app/intro/intro.html',
            controller: 'IntroController as intro'
          }
        }
		  })

		  // Timeline
		  .state('app.timeline', {
		    url: '/timeline',
        cache: false,
        views: {
          'mainContent': {
            templateUrl: 'app/timeline/timeline.html',
            controller: 'TimelineController as timeline'
          }
        }
		  })

		  // Blood Pressure
		  .state('app.bloodpressure', {
		    url: '/bloodpressure',
        cache: false,
        views: {
          'mainContent': {
            templateUrl: 'app/bloodpressure/list.html',
            controller: 'BloodPressureController as bloodpressure'
          }
        }
		  })

		  // Add blood pressure measurement
		  .state('app.bloodpressure_add', {
		    url: '/bloodpressure/add',
        views: {
          'mainContent': {
            templateUrl: 'app/bloodpressure/create.html',
    		    controller: 'BloodPressureCreateController as bloodpressure'
          }
        }
		  })

		  // Add body weight measurement
		  .state('app.bodyweight_add', {
		    url: '/bodyweight/add',
        views: {
          'mainContent': {
            templateUrl: 'app/bodyweight/create.html',
    		    controller: 'BodyWeightCreateController as bodyweight'
          }
        }
		  })

		  // Add remarks measurement
		  .state('app.remarks_add', {
		    url: '/remarks/add',
        views: {
          'mainContent': {
            templateUrl: 'app/remarks/create.html',
    		    controller: 'RemarksCreateController as remarks'
          }
        }
		  })


	  // if none of the above states are matched, use this as the fallback
	  $urlRouterProvider.otherwise('/app/intro');

	});
})();
