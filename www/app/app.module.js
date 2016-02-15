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
	    'healthcafe.remarks',
	    'healthcafe.sharing',
    ];

	angular.module('healthcafe', ['ionic', 'ngMessages', 'angularUUID2', 'angular-timeline', 'indexedDB' ].concat(appModules) )
		.run([ '$ionicPlatform', function($ionicPlatform) {
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
		}]);

	for( idx in appModules ) {
		angular.module( appModules[idx], []);
	}
})();
