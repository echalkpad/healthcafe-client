// Ionic Healthcafe App
(function() {
  // Additional application modules to be initialized and loaded in the main application
	var appModules = [
	    'healthcafe.generic',
	    'healthcafe.intro',
	    'healthcafe.login',
	    'healthcafe.bloodpressure',
	    'healthcafe.bodyweight',
	    'healthcafe.bmi',
	    'healthcafe.bloodglucose',
	    'healthcafe.cholesterol',
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

(function() {
	// Configuration for the trombose app.
	// The configuration is a regular map, which can be acccessed throughout the application
	var configuration = {
    // The ENV points to the set of settings being used.
    // See for example the api subconfiguration
    "env": "test",

    // Development configuration
    "dev": {
      "api": {
        urls: {
          authorization: "http://localhost:8080/nrc/oauth/authorize",
          redirect: "http://localhost:8100/app/login/oauth_callback.html",
          dataPoints: "http://localhost:8080/nrc/api/openmhealth/v1/dataPoints"
        },

        // NRC OAuth application key
        key: "mbm85kztfalztd2fft5fl5w7hmmdar5nnlktkgkk",
      },
    },

    // Test configuration, used for testing the app with the healthcafe instance
    "test": {
      "api": {
        urls: {
          authorization: "https://humanstudies.tno.nl/healthcafe/oauth/authorize",
          redirect: "http://isdatsoftwareontwikkeling.nl/projecten/healthcafe/app/login/oauth_callback.html",
          dataPoints: "https://humanstudies.tno.nl/healthcafe/api/openmhealth/v1/dataPoints"
        },

        // NRC OAuth application key
        key: "hm2lkbxyssh9vvsn4tjpknavhqifmkzmucrl500o",
      },
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

(function() {
	angular.module('healthcafe.bloodglucose')
		.controller('BloodGlucoseController', BloodGlucoseController );

		BloodGlucoseController.$inject = [ '$scope', '$controller', 'BloodGlucose' ];

		function BloodGlucoseController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = ".bloodglucose-container"
      $scope.chartableProperties = 'blood-glucose';
      $scope.chartOptions = {
              'measures': {
                'blood-glucose' : {
                  'valueKeyPath': 'body.blood_glucose.value',
                  'range': undefined,
                  'units': 'mg/dL',
                },
              }
            };

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();

(function() {
	angular.module('healthcafe.bloodglucose')
		.factory('BloodGlucose', BloodGlucose );

  BloodGlucose.$inject = [ 'Datapoints' ];

  function BloodGlucose(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'omh', name: 'blood-glucose', version: '1.0' },
      function(data) {
        return {
          'blood_glucose': { value: data.level, unit: 'mmHg' },
          'temporal_relationship_to_meal': data.relationship_to_meal
        };
      }
    );
  }

})();

(function() {
	angular.module('healthcafe.bloodglucose')
		.controller('BloodGlucoseCreateController', BloodGlucoseCreateController );

		BloodGlucoseCreateController.$inject = [ '$scope', '$controller', 'BloodGlucose' ];

		function BloodGlucoseCreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

      vm.relationships_to_meal = [
        { name: 'fasting' },
        { name: 'not fasting' }
      ];

		  return vm;
		}
})();

(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('BloodPressureController', BloodPressureController );

		BloodPressureController.$inject = [ '$scope', '$controller', 'BloodPressure' ];

		function BloodPressureController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = ".bloodpressure-container"
      $scope.chartableProperties = 'systolic_blood_pressure, diastolic_blood_pressure';
      $scope.chartOptions = {
        'userInterface': {
          'tooltips': {
            'contentFormatter': function(d) {
              var systolic = d.omhDatum.body.systolic_blood_pressure.value.toFixed( 0 );
              var diastolic = d.omhDatum.body.diastolic_blood_pressure.value.toFixed( 0 );
              return systolic + '/' + diastolic;
            }
          }
        }
      }

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();

(function() {
	angular.module('healthcafe.bloodpressure')
		.factory('BloodPressure', BloodPressure );

  BloodPressure.$inject = [ 'Datapoints' ];

  function BloodPressure(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'omh', name: 'blood-pressure', version: '1.0' },
      function(data) {
        return {
          'systolic_blood_pressure': { value: data.systolic, unit: 'mmHg' },
          'diastolic_blood_pressure': { value: data.diastolic, unit: 'mmHg' },
        };
      }
    );
  }

})();

(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('BloodPressureCreateController', BloodPressureCreateController );

		BloodPressureCreateController.$inject = [ '$scope', '$controller', 'BloodPressure' ];

		function BloodPressureCreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();

(function() {
	angular.module('healthcafe.bodyweight')
		.controller('BodyWeightController', BodyWeightController );

		BodyWeightController.$inject = [ '$scope', '$controller', 'BodyWeight' ];

		function BodyWeightController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = '.bodyweight-container';
      $scope.chartableProperties = 'body_weight';
      $scope.chartOptions =   {
        'measures': {
          'body_weight': {
            'range': undefined,
            'thresholds': undefined,  // Disable default threshold
          },
        }
      };

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();

(function() {
	angular.module('healthcafe.bodyweight')
		.factory('BodyWeight', BodyWeight );

  BodyWeight.$inject = [ 'Datapoints' ];

  function BodyWeight(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'omh', name: 'body-weight', version: '1.0' },
      function(data) {
        return { 'body_weight': { value: data.weight, unit: 'kg' } };
      }
    );
  }

})();


(function() {
	angular.module('healthcafe.bodyweight')
		.controller('BodyWeightCreateController', BodyWeightCreateController );

		BodyWeightCreateController.$inject = [ '$scope', '$controller', 'BodyWeight' ];

		function BodyWeightCreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();

(function() {
	angular.module('healthcafe.bmi')
		.controller('BMIController', BMIController );

		BMIController.$inject = [ '$scope', '$controller', 'BMI' ];

		function BMIController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = ".bmi-container"
      $scope.chartableProperties = 'body-mass-index';
      $scope.chartOptions = {
              'measures': {
                'body-mass-index' : {
                  'valueKeyPath': 'body.body_mass_index.value',
                  'range': undefined,
                  'units': 'kg/m2',
                  'thresholds': { 'min': 18, 'max': 25  },
                },
              }
            };

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();

(function() {
	angular.module('healthcafe.bmi')
		.factory('BMI', BMI );

  BMI.$inject = [ 'Datapoints' ];

  function BMI(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'omh', name: 'body-mass-index', version: '1.0' },
      function(data) {
        console.log( "Convert data point BMI" );
        return {
          'body_mass_index': { value: data.weight / ( data.length * data.length ), unit: 'kg/m2' },
        };
      }
    );
  }

})();

(function() {
	angular.module('healthcafe.bmi')
		.controller('BMICreateController', BMICreateController );

		BMICreateController.$inject = [ '$scope', '$controller', 'BMI' ];

		function BMICreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();

(function() {
	angular.module('healthcafe.cholesterol')
		.controller('CholesterolController', CholesterolController );

		CholesterolController.$inject = [ '$scope', '$controller', 'Cholesterol' ];

		function CholesterolController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = ".cholesterol-container"
      $scope.chartableProperties = 'total-cholesterol,ldl-cholesterol,hdl-cholesterol,triglycerides';
      $scope.chartOptions = {
              'userInterface': {
                'legend': true,
                'thresholds': { 'show': false },
                'tooltips': {
                  'grouped': false,
                  'contentFormatter': function(d) {
                    return d.y.toFixed(1);
                  }
                }
              },
              'measures': {
                'total-cholesterol' : {
                  'valueKeyPath': 'body.blood_total_cholesterol.value',
                  'range':undefined,
                  'seriesName': 'Total Cholesterol',
                  'units': 'mg/dL',
                  'chart': {
                    'pointFillColor' : '#4a90e2',
                    'pointStrokeColor' : '#0066d6',
                   },
                   'thresholds': [
                      { name: 'Desirable', max: 200 },
                      { name: 'Borderline high', min: 200, max: 240 },
                      { name: 'High', min: 240 },
                    ]
                },
                'ldl-cholesterol' : {
                  'valueKeyPath': 'body.blood_ldl_cholesterol.value',
                  'range': { min: 0, max: 20 },
                  'seriesName': 'LDL Cholesterol',
                  'units': 'mg/dL',
                  'chart': {
                    'pointFillColor' : '#E24A4A',
                    'pointStrokeColor' : '#D60000',
                   }
                },
                'hdl-cholesterol' : {
                  'valueKeyPath': 'body.blood_hdl_cholesterol.value',
                  'range': { min: 0, max: 20 },
                  'units': 'mg/dL',
                  'seriesName': 'HDL Cholesterol',
                  'chart': {
                    'pointFillColor' : '#4AE250',
                    'pointStrokeColor' : '#00D605',
                   }
                },
                'triglycerides' : {
                  'valueKeyPath': 'body.blood_triglycerides.value',
                  'range': undefined,
                  'units': 'mg/dL',
                  'seriesName': 'Triglycerides',
                  'chart': {
                    'pointFillColor' : '#DA4AE2',
                    'pointStrokeColor' : '#CB00D6',
                   }
                },
              }
            };

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();

(function() {
	angular.module('healthcafe.cholesterol')
		.factory('Cholesterol', Cholesterol );

  Cholesterol.$inject = [ 'Datapoints' ];

  function Cholesterol(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'nrc', name: 'cholesterol', version: '0.1' },
      function(data) {
        var output = {
          'blood_total_cholesterol': { value: data.total, unit: 'mg/dL' },
        };

        if( data.ldl ) {
          output['blood_ldl_cholesterol'] = { value: data.ldl, unit: 'mg/dL' };
        }

        if( data.hdl ) {
          output['blood_hdl_cholesterol'] = { value: data.hdl, unit: 'mg/dL' };
        }

        if( data.triglycerides ) {
          output['blood_triglycerides'] = { value: data.triglycerides, unit: 'mg/dL' };
        }

        return output;
      }
    );
  }

})();

(function() {
	angular.module('healthcafe.cholesterol')
		.controller('CholesterolCreateController', CholesterolCreateController );

		CholesterolCreateController.$inject = [ '$scope', '$controller', 'Cholesterol' ];

		function CholesterolCreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();

(function() {
	angular.module('healthcafe.generic')
		.controller('GenericChartController', GenericChartController );

		GenericChartController.$inject = ['$scope', '$ionicSideMenuDelegate', '$window']

    /**
     * Generic chart controller to handle a list of datapoints
     **/
    function GenericChartController($scope, $ionicSideMenuDelegate, $window) {
        var vm = this;

        vm.chart = null;

        function getChart() {
          if( !vm.chart ) {
            // If no events are loaded, don't show a chart
            if( !vm.events || vm.events.length == 0 ) {
              return
            }
            createChart(vm.events);
          }

          return vm.chart;
        }

        function createChart(omhDataPoints) {
          if( vm.chart )
            vm.chart.destroy();

          var targetElement = d3.select($scope.selector);
          vm.chart = new OMHWebVisualizations.Chart( omhDataPoints, targetElement, $scope.chartableProperties, $scope.chartOptions );
        }

        function showChart() {
          var targetElement = d3.select($scope.selector);
          var chart = getChart();

          if( chart ) {
            chart.renderTo(targetElement.select('svg').node());
          }
        }

        function load() {
          vm.events = [];
          $scope.model.list().then(function(data) {
            vm.events = data;
            showChart(data);
          });
        }

        function refresh() {
          vm.events = [];
          $scope.model.load().then(function(data) {
            vm.events = data;
            showChart(data);
          });
        }

        vm.remove = function(id) {
          $scope.model.remove(id).then(function() {
            refresh();
          });
        };

        // Start loading data
        load();

        // Disable dragging of side menu when a chart is shown
        $scope.$on('$ionicView.enter', function(){
          $ionicSideMenuDelegate.canDragContent(false);

          // Redraw the chart on resize
          angular.element($window).bind('resize', showChart);
        });
        $scope.$on('$ionicView.leave', function(){
          $ionicSideMenuDelegate.canDragContent(true);

          // Redraw the chart on resize
          angular.element($window).unbind('resize', showChart);
        });

        return vm;
    }
})();

(function() {
	angular.module('healthcafe.generic')
		.controller('GenericCreateController', GenericCreateController );

		GenericCreateController.$inject = ['$scope', '$ionicHistory']

  /**
   * Generic list controller to add a new datapoint
   **/
  function GenericCreateController($scope, $ionicHistory) {
    var vm = this;

    vm.data = typeof $scope.model.defaults != 'undefined' ? $scope.model.defaults() : {};

    vm.save = function() {
      console.log( "SAVING!" );
      $scope.model.create(vm.data).then(function(data) {
        $scope.model.load().then(function() {
          $ionicHistory.goBack();
         });
      });
    };

    return vm;
  }

})();

(function() {
	angular.module('healthcafe.generic')
		.factory('Datapoints', DatapointsFactory );

  DatapointsFactory.$inject = [ '$http', '$q', 'uuid2', 'OAuth2', 'config' ];

	function DatapointsFactory($http, $q, uuid2, OAuth2, config) {

    /**
     * Constructor for a generic datapoint service. Available methods (returning a promise to perform the work async):
     *    load      Loads datapoints with the given schema from the NRC instance
     *    list      Returns datapoints with the given schema (from cache, if possible, otherwise using load())
     *    get       Returns a datapoint with the given ID
     *    remove    Removes a datapoint with the given ID
     *    create    Creates a new datapoint. Data specified is being converted using the converter (specified in the constructor)
     *
     *  The following methods return some metadata immediately
     *
     *    defaults  Returns a map with default values to show when a user creates a new datapoint
     *    chartableProperties Returns a comma-separated string with properties that can be charted for this datatype
     *
     * @param schema map with namespace, name and version, identifying the schema for this datatype
     * @param chartablePropertyNames Comma-separated string with properties that can be charted for this datatype
     * @param converter method to convert the data from a newly created dataobject (see GenericCreateController) into a OMH datapoint body
     */
    var Datapoints = function(schema, converter) {
      this.schema = schema;

      // Converter is needed to convert input data into a proper body for
      // the openmhealth API
      this.converter = converter;

      // Initialize empty cache
      this.cache = null;
    }

    Datapoints.prototype.load = function() {
      var url = config.current().api.urls.dataPoints +
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
      var url = config.current().api.urls.dataPoints + '/' + id;
      return $http.get( url )
    }

    Datapoints.prototype.remove = function( id ) {
      var url = config.current().api.urls.dataPoints + '/' + id;
      return $http.delete( url )
    }

    Datapoints.prototype.create = function( body ) {
      var url = config.current().api.urls.dataPoints;

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

    /**
     * Returns a comma-separated-string with properties that can be charted for this datatype. See OMH Web Visualizations
     */
    Datapoints.prototype.chartableProperties = function() {
      return this.propertyNames;
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


(function() {
	angular.module('healthcafe.generic')
		.controller('GenericInfoController', GenericInfoController );

  /**
   * Generic list controller to show information about a datatype
   **/
  function GenericInfoController() {
    var vm = this;
    return vm;
  }

})();

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

      url = apiConfig.urls.authorization +
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
	angular.module('healthcafe.remarks')
		.controller('RemarksCreateController', RemarksCreateController );

		RemarksCreateController.$inject = [ '$scope', '$controller', 'Remarks' ];

		function RemarksCreateController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericCreateController', {$scope: $scope}));

		  return vm;
		}
})();

(function() {
	angular.module('healthcafe.timeline')
		.controller('TimelineController', TimelineController );

		TimelineController.$inject = [ 'BloodPressure', 'BodyWeight', 'BMI', 'BloodGlucose', 'Cholesterol', 'Remarks', '$q', '$ionicPopover', '$timeout'];

		function TimelineController(BloodPressure, BodyWeight, BMI, BloodGlucose, Cholesterol, Remarks, $q, $ionicPopover, $timeout) {
      var vm = this;

      var definitions = {
        'blood-pressure': { icon: 'ion-compass', model: BloodPressure },
        'body-weight': { icon: 'ion-speedometer', model: BodyWeight},
        'body-mass-index': { icon: 'ion-ios-flame', model: BMI},
        'blood-glucose': { icon: 'ion-fork', model: BloodGlucose},
        'cholesterol': { icon: 'ion-medkit', model: Cholesterol},
      };

      /**
       * Converts a blood pressure datapoint into an event on the timeline
       */
      function convertDatapoint(dataPoint) {
        return {
          id: dataPoint.header.id,
          datapoint: dataPoint,
          date: dataPoint.body.effective_time_frame.date_time,
          badgeIconClass: definitions[dataPoint.header.schema_id.name].icon,
          badgeClass: dataPoint.header.schema_id.name,
          type: 'measurement',
          measurementType: dataPoint.header.schema_id.name,
          model: definitions[dataPoint.header.schema_id.name].model
        };
      }

      /**
       * Converts an intervention into an event on the timeline
       */
      function convertIntervention(intervention) {
        return angular.extend({}, intervention, {
          badgeIconClass: 'ion-flash',
          badgeClass: 'remark',
          type: 'intervention',
          model: Remarks
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

      // Allow the client to reload
      vm.load = function() {
        var models = [BloodPressure, BodyWeight, BloodGlucose, BMI, Cholesterol, Remarks];
        load(models);
      }

      // Load the data on startup
      vm.load();

      // Enable deleting events
      vm.remove = function(event) {
        if(confirm('Are you sure?')) {
          // Perform the actual removal
          event.model.remove(event.id)
            // First tell the frontend the removing succeeded and wait 200ms for the animation to be finished
            .then(function() { event.removed = true; return $timeout(function() {}, 200); })

            // After that, do the real reloading of the data in the backend. THis will actually
            // delete the element from the cache and from the DOM
            .then(function() { return event.model.load(); })
            .then(function() { return vm.load(); })
        }
      }

      // Enable the popover when clicking the add button
      $ionicPopover.fromTemplateUrl('app/timeline/add_menu.html').then(function(popover) {
        vm.popover = popover;
      });

      return vm;
		}
})();
