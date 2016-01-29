// Healthcafe routes
(function() {
	angular.module('healthcafe').config(function($stateProvider, $urlRouterProvider) {
    var datatypes = [
      { name: 'bloodpressure', controllerPrefix: 'BloodPressure' },
      { name: 'bodyweight', controllerPrefix: 'BodyWeight' },
      { name: 'bmi', controllerPrefix: 'BMI' },
      { name: 'bloodglucose', controllerPrefix: 'BloodGlucose' },
      { name: 'cholesterol', controllerPrefix: 'Cholesterol' },
    ];

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


		  // Add remarks measurement
		  .state('app.remarks_add', {
		    url: '/remarks/add',
        views: {
          'mainContent': {
            templateUrl: 'app/remarks/create.html',
    		    controller: 'RemarksCreateController as remarks'
          }
        }
		  });

      for( i in datatypes ) {
        var datatype = datatypes[i];
        $stateProvider
          // Overview
          .state('app.' + datatype.name, {
            url: '/' + datatype.name,
            cache: false,
            views: {
              'mainContent': {
                templateUrl: 'app/' + datatype.name + '/chart.html',
                controller: datatype.controllerPrefix + 'Controller as ' + datatype.name
              }
            }
          })

          // Add new measurement
          .state('app.' + datatype.name + '_add', {
            url: '/' + datatype.name + '/add',
            views: {
              'mainContent': {
                templateUrl: 'app/' + datatype.name + '/create.html',
                controller: datatype.controllerPrefix + 'CreateController as ' + datatype.name
              }
            }
          })

          // Add information page about this datatype
          .state('app.' + datatype.name + '_info', {
            url: '/' + datatype.name + '/info',
            views: {
              'mainContent': {
                templateUrl: 'app/' + datatype.name + '/info.html',
                controller: 'GenericInfoController as info'
              }
            }
          })

      }

	  // if none of the above states are matched, use this as the fallback
	  $urlRouterProvider.otherwise('/app/intro');

	});
})();
