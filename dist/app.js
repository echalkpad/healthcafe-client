(function() {
	// Configuration for the trombose app.
	// The configuration is a regular map, which can be acccessed throughout the application
	var configuration = {
    // The ENV points to the set of settings being used.
    // See for example the api subconfiguration
    "env": "dev",

    // URLs to be used to talk to the API.
    "dev": {
      "api": {
        urls: {
          autorization: "http://localhost:8080/nrc/oauth/authorize",
          redirect: "http://localhost:8100/app/login/oauth_callback.html"
        },

        // NRC OAuth application key
        key: "mbm85kztfalztd2fft5fl5w7hmmdar5nnlktkgkk",
      }
    },
  };

	// Convenience method to use environments in configuration
	configuration.current = function() {
		return configuration[configuration.env];
	}

  // Store configuration in main module
	angular.module('healthcafe')

	  .constant('config', configuration )

    .config(function($httpProvider) {
      $httpProvider.interceptors.push('OAuth2Interceptor');
    })
})();

(function() {
	angular.module('healthcafe')
		.controller('AppController', AppController);

	AppController.$inject = [ '$state', '$ionicSideMenuDelegate', '$ionicHistory', 'OAuth2' ];

	function AppController($state, $ionicSideMenuDelegate, $ionicHistory, OAuth2) {
	  var vm = this;

    // Form data for the login modal
    vm.loginData = {};
    vm.isAuthenticated = OAuth2.isAuthenticated();

    // Login method
    vm.login = OAuth2.login;

    // Logoff method
    vm.logoff = function() {
      OAuth2.logoff();
      vm.isAuthenticated = false;

      // Reset menu and navigation history
      $ionicSideMenuDelegate.toggleLeft(false);
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
    }

    return vm;
	}
})();

// Ionic Healthcafe App
(function() {
  // Additional application modules to be initialized and loaded in the main application
	var appModules = [
	    'healthcafe.generic',
	    'healthcafe.intro',
	    'healthcafe.login',
	    'healthcafe.bloodpressure',
	    'healthcafe.bodyweight',
	    'healthcafe.timeline',
	    'healthcafe.remarks'
    ];

	angular.module('healthcafe', ['ionic', 'ngMessages', 'angularUUID2', 'angular-timeline' ].concat(appModules) )
		.run(function($ionicPlatform) {
		  $ionicPlatform.ready(function() {
		    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		    // for form inputs)
		    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
		      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		      cordova.plugins.Keyboard.disableScroll(true);

		    }
		    if (window.StatusBar) {
		      // org.apache.cordova.statusbar required
		      StatusBar.styleDefault();
		    }
		  });
		});

	for( idx in appModules ) {
		angular.module( appModules[idx], []);
	}
})();

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

(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('BloodPressureController', BloodPressureController );

		BloodPressureController.$inject = [ 'BloodPressure' ];

		function BloodPressureController(Model) {
      var vm = this;

      function load() {
        vm.events = []
        Model.list().then(function(data) {
          vm.events = data;
        });
      }

      function refresh() {
        vm.events = []
        Model.load().then(function(data) {
          vm.events = data;
        });
      }

      vm.remove = function(id) {
        Model.remove(id).then(function() {
          refresh();
        });
      };

      load();

      return vm;
		}
})();

(function() {
	angular.module('healthcafe.bloodpressure')
		.factory('BloodPressure', BloodPressure );

  BloodPressure.$inject = [ 'Datapoints' ];

  function BloodPressure(Datapoints) {
    return Datapoints.getInstance({ namespace: 'omh', name: 'blood-pressure', version: '1.0' }, function(data) {
      return {
        'systolic_blood_pressure': { value: data.systolic, unit: 'mmHg' },
        'diastolic_blood_pressure': { value: data.diastolic, unit: 'mmHg' },
      };
    });
  }

})();


(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('BloodPressureCreateController', [ '$ionicHistory', 'BloodPressure', GenericCreateController ] );
})();

(function() {
	angular.module('healthcafe.bodyweight')
		.factory('BodyWeight', BodyWeight );

  BodyWeight.$inject = [ 'Datapoints' ];

  function BodyWeight(Datapoints) {
    return Datapoints.getInstance({ namespace: 'omh', name: 'body-weight', version: '1.0' }, function(data) {
      return { 'body_weight': { value: data.weight, unit: 'kg' } };
    });
  }

})();


(function() {
	angular.module('healthcafe.bodyweight')
		.controller('BodyWeightCreateController', [ '$ionicHistory', 'BodyWeight', GenericCreateController ] );
})();

/**
 * Generic list controller to add a new datapoint
 **/
function GenericCreateController($ionicHistory, Model) {
  var vm = this;

  vm.data = typeof Model.defaults != 'undefined' ? Model.defaults() : {};

  vm.save = function() {
    Model.create(vm.data).then(function(data) {
      Model.load().then(function() {
        $ionicHistory.goBack();
       });
    });
  };

  return vm;
}

(function() {
	angular.module('healthcafe.generic')
		.factory('Datapoints', DatapointsFactory );

  DatapointsFactory.$inject = [ '$http', '$q', 'uuid2', 'OAuth2' ];

	function DatapointsFactory($http, $q, uuid2, OAuth2) {
    // Converter is needed to convert input data into a proper body for
    // the openmhealth API
    var Datapoints = function(schema, converter) {
      this.schema = schema;
      this.converter = converter;
      this.cache = null;
    }

    Datapoints.prototype.load = function() {
      var url = 'http://localhost:8080/nrc/api/openmhealth/v1/dataPoints' +
                  '?schema_namespace=' + encodeURIComponent(this.schema.namespace) +
                  '&schema_name=' + encodeURIComponent(this.schema.name) +
                  '&schema_version=' + encodeURIComponent(this.schema.version);

      var datapoint = this;

      return $http.get( url ).then(function(response) {
        datapoint.cache = response.data;
        return datapoint .cache;
      });
    }

    Datapoints.prototype.list = function() {
      if( this.cache ) {
        return $q.when(this.cache);
      }

      return this.load()
    }

    Datapoints.prototype.get = function( id ) {
      var url = 'http://localhost:8080/nrc/api/openmhealth/v1/dataPoints/' + id;
      return $http.get( url )
    }

    Datapoints.prototype.remove = function( id ) {
      var url = 'http://localhost:8080/nrc/api/openmhealth/v1/dataPoints/' + id;
      return $http.delete( url )
    }

    Datapoints.prototype.create = function( body ) {
      var url = 'http://localhost:8080/nrc/api/openmhealth/v1/dataPoints';

      // Convert data if appropriate
      if( this.converter ) {
        body = this.converter(body);
      }

      var datapoint = this.createDatapoint(body);

      return $http.post( url, datapoint);
    }

    // Default values for the datapoint when creating one
    Datapoints.prototype.defaults = function() {
      return {};
    }

    Datapoints.prototype.createDatapoint = function( body ) {
      return {
        header: {
          id: uuid2.newuuid(),
          creation_date_time: new Date(),
          acquisition_provenance: {
            source_name: 'Manual',
            source_creation_date_time: new Date(),
            modality: 'self-reported'
          },
          schema_id: this.schema
        },
        body: body
      }
    }

    return {
      getInstance: function( schema, converter ) {
        return new Datapoints(schema, converter)
      }
    };
  }
})();


/**
 * Generic list controller to handle a list of datapoints
 **/
function GenericListController(Model) {
  var vm = this;

  function load() {
    vm.dataPoints = []
    Model.list().then(function(data) {
      vm.datapoints = data;
    });
  }

  function refresh() {
    vm.dataPoints = []
    Model.load().then(function(data) {
      vm.datapoints = data;
    });
  }

  vm.remove = function(id) {
    Model.remove(id).then(function() {
      refresh();
    });
  };

  load();

  return vm;
}

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

(function() {
	angular.module('healthcafe.login')
		.factory('OAuth2', OAuth2 );

	OAuth2.$inject = [ 'config' ];

	function OAuth2(config) {
    function getToken() {
      var token = window.localStorage.getItem("token");

      if( token ) {
        return JSON.parse(token);
      }

      return null;
    }

    function isAuthenticated() {
      return !!getToken();
    }

    function getAccessToken() {
      var token = getToken();

      if( token ) {
        return token.oauth.access_token
      } else {
        return null;
      }
    }

    function getRefreshToken() {

    }

    function login() {
      // Generate login URL
      var apiConfig = config.current().api;

      url = apiConfig.urls.autorization +
              "?client_id=" + apiConfig.key +
              "&redirect_uri=" + encodeURIComponent(apiConfig.urls.redirect) +
              "&response_type=token" +
              "&scope=read_data_points write_data_points delete_data_points"

      window.location.href = url;
    }

    function logoff() {
      // Remove item from local storage
      window.localStorage.removeItem("token");
    }

    return {
      isAuthenticated: isAuthenticated,
      getAccessToken: getAccessToken,
      login: login,
      logoff: logoff
    }
  }
})();


(function() {
	angular.module('healthcafe.login')
		.factory('OAuth2Interceptor', OAuth2Interceptor );

	OAuth2Interceptor.$inject = [ 'OAuth2', '$rootScope', '$q' ];
	function OAuth2Interceptor(OAuth2, $rootScope, $q) {
    // Interceptor method to add access token to every request
    // See https://docs.angularjs.org/api/ng/service/$http
    function request(config) {
      config.headers[ 'Accept' ] = 'application/json';
      config.headers[ 'Authorization' ] = 'Bearer ' + OAuth2.getAccessToken()

      return config;
    }

    // Interceptor method to redirect the user to the login form, if a 401 is returned
    function responseError(rejection) {
      var config = rejection.config || {};
      if (!config.ignoreAuthModule) {
        switch (rejection.status) {
          case 401:
            // Redirect the user to the login form
            $rootScope.$broadcast('event:auth-unauthorized', rejection);
            break;
          case 403:
            $rootScope.$broadcast('event:auth-forbidden', rejection);
            break;
        }
      }

      // otherwise, default behaviour
      return $q.reject(rejection);
    }

    return {
      request: request,
      responseError: responseError
    }
  }
})();


(function() {
	angular.module('healthcafe.remarks')
		.controller('RemarksController', RemarksController );

		RemarksController.$inject = [ 'Remarks' ];

		function RemarksController(Model) {
      var vm = this;

      function load() {
        vm.remarks = []
        Model.list().then(function(data) {
          vm.remarks = data;
        });
      }

      function refresh() {
        vm.remarks = []
        Model.load().then(function(data) {
          vm.remarks = data;
        });
      }

      vm.remove = function(id) {
        Model.remove(id).then(function() {
          refresh();
        });
      };

      load();

      return vm;
		}
})();

(function() {
	angular.module('healthcafe.remarks')
		.factory('Remarks', Remarks );

  Remarks.$inject = [ '$q' ];

  function Remarks($q) {
    var cache = [
        {
          id: 1,
          date: new Date( 2016, 0, 1, 10, 20, 30 ),
          message: "Started using blood pressure medicine"
        },
        {
          id: 2,
          date: new Date( 2016, 0, 9, 10, 20, 30 ),
          message: "Severe flu"
        }
    ];

    function list() {
      return $q.when(cache);
    }

    function get(id) {
      for( i = 0; i < cache.length; i++ ) {
        if( cache[i].id == id )
          return $q.when(cache[i]);
      }

      return $q.fail("Not found");
    }

    function remove(id) {
      for( i = 0; i < cache.length; i++ ) {
        if( cache[i].id == id ) {
          return $q.when(cache.splice(i,1));
        }
      }
      return $q.fail("Not found");
    }

    function create(body) {
      if( !body.id ) {
        body.id = Math.max.apply(null, cache.map(function(el) { return el.id; } ) ) + 1;
      }

      cache.push(body);

      return $q.when(body);
    }

    return {
      create: create,
      load: list,
      list: list,
      remove: remove,
      get: get,

      defaults: function() { return {
        date: new Date(),
      }; }
    }
  }

})();


(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('RemarksCreateController', [ '$ionicHistory', 'Remarks', GenericCreateController ] );
})();

(function() {
	angular.module('healthcafe.timeline')
		.controller('TimelineController', TimelineController );

		TimelineController.$inject = [ 'BloodPressure', 'BodyWeight', 'Remarks', '$q', '$ionicPopover'];

		function TimelineController(BloodPressure, BodyWeight, Remarks, $q, $ionicPopover) {
      var vm = this;

      var definitions = {
        'blood-pressure': { icon: 'ion-compass', color: 'info' },
        'body-weight': { icon: 'ion-speedometer', color: 'warning' },
      };

      /**
       * Converts a blood pressure datapoint into an event on the timeline
       */
      function convertDatapoint(dataPoint) {
        return {
          datapoint: dataPoint,
          date: dataPoint.header.creation_date_time,
          badgeIconClass: definitions[dataPoint.header.schema_id.name].icon,
          badgeClass: definitions[dataPoint.header.schema_id.name].color,
          type: 'measurement',
          measurementType: dataPoint.header.schema_id.name
        };
      }

      /**
       * Converts an intervention into an event on the timeline
       */
      function convertIntervention(intervention) {
        return angular.extend({}, intervention, {
          badgeIconClass: 'ion-flash',
          badgeClass: 'danger',
          type: 'intervention'
        });
      }

      /**
       * Combines datapoints and inverventions into a single list
       * @param data  List with lists of datapoints or remarks
       */
      function combine( data ) {
        var events = flatten(
          data.map(function(entries) {
            return entries.map(function(element) {
              // Convert each element into the proper format
              // See convertDatapoint and convertIntervention for details
              if( element.header && element.body ) {
                return convertDatapoint(element);
              } else {
                return convertIntervention(element)
              }
            });
          })
        );

        // Sort by date descending
        return events.sort(function(a,b) {
          return new Date(b.date) - new Date(a.date);
        });
      }

      function flatten(arrays) {
        return [].concat.apply([], arrays);
      }

      function load(models) {
        vm.events = []
        $q.all( models.map(function(model) { return model.list() } ) ).then(function(data) {
          vm.events = combine(data);
        });
      }

      // Load the data
      load([BloodPressure, BodyWeight, Remarks]);

      // Enable the popover when clicking the add button
      $ionicPopover.fromTemplateUrl('app/timeline/add_menu.html').then(function(popover) {
        vm.popover = popover;
      });


      return vm;
		}
})();
