// Healthcafe routes
(function() {
	angular.module('healthcafe').config([ '$stateProvider', '$urlRouterProvider', 'config', function($stateProvider, $urlRouterProvider, config) {

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

		  // Personal data
		  .state('app.personal_data', {
		    url: '/personal_data',
        cache: false,
        views: {
          'mainContent': {
            templateUrl: 'app/personal/data.html',
            controller: 'PersonalController as personal'
          }
        }
		  })

		  // Body measurements
		  .state('app.body_measurements', {
		    url: '/body_measurements',
        cache: false,
        views: {
          'mainContent': {
            templateUrl: 'app/bodymeasurements/data.html',
            controller: 'BodyMeasurementsController as measurements'
          }
        }
		  });

      for( i in config.datatypes ) {
        var datatype = config.datatypes[i];
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

          // Details about a single measurement
          .state('app.' + datatype.name + '_measurement', {
            url: '/' + datatype.name + '/detail/:measurementId',
            views: {
              'mainContent': {
                templateUrl: 'app/' + datatype.name + '/detail.html',
                controller: 'GenericDetailController as detail'
              }
            }
          });
      }

      for( i in config.questionnaires ) {
        var questionnaire = config.questionnaires[i];
        $stateProvider
          // Retrieve feedback
          .state('app.' + questionnaire.name, {
            url: '/' + questionnaire.name,
            cache: false,
            views: {
              'mainContent': {
                templateUrl: 'app/' + questionnaire.name + '/feedback.html',
                controller: questionnaire.controllerPrefix + 'Controller as ' + questionnaire.name
              }
            }
          })

          // Answer a questionnaire
          .state('app.' + questionnaire.name + '_answer', {
            url: '/' + questionnaire.name + '/answer',
            views: {
              'mainContent': {
                templateUrl: 'app/' + questionnaire.name + '/answer.html',
                controller: questionnaire.controllerPrefix + 'AnswerController as ' + questionnaire.name
              }
            }
          })
      }

		  // Add remarks measurement. Remarks are only shown in the timeline for now.
		  $stateProvider.state('app.remarks_add', {
		    url: '/remarks/add',
        views: {
          'mainContent': {
            templateUrl: 'app/remarks/create.html',
    		    controller: 'RemarksCreateController as remarks'
          }
        }
		  });

      // Sharing
		  $stateProvider.state('app.share', {
		    url: '/share/:service',
        cache: false,
        views: {
          'mainContent': {
            templateUrl: 'app/share/share.html',
    		    controller: 'ShareController as sharing'
          }
        }
		  });

		  $stateProvider.state('app.connect', {
		    url: '/share/connect/:service',
        cache: false,
        views: {
          'mainContent': {
            templateUrl: 'app/share/connect.html',
    		    controller: 'ConnectController as connect'
          }
        }
		  });

	  // if none of the above states are matched, use this as the fallback
	  $urlRouterProvider.otherwise('/app/intro');

	}]);
})();
