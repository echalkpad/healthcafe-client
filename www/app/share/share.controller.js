(function() {
	angular.module('healthcafe.sharing')
		.controller('ShareController', ShareController );

		ShareController.$inject = [ '$state', '$ionicPopup', 'OAuth2', 'config', 'Share'];

		function ShareController($state, $ionicPopup, OAuth2, config, Share) {
      var vm = this;

      var serviceKey = $state.params.service;

      // Check whether this user is already connected
      if( !OAuth2.isAuthenticated(serviceKey) ) {
        $state.go("app.connect", { service: serviceKey });
        return;
      }

      // Add information about the current service
      vm.serviceKey = serviceKey;
      vm.service = config.sharing[serviceKey];

      // Show the datatypes for the user to choose.
      var datatypes = config.datatypes.slice();

      // By default, all items are checked
      for( i in datatypes ) {
        datatypes[i].checked = true;
      }
      vm.datatypes = datatypes;

      // Method to import data
      vm.import = function() {
        Share.pull(serviceKey, vm.datatypes)
          .then(function(e) {
            var numDatapoints = e.reduce(function(previousSum, currentIds) { return previousSum + (currentIds ? currentIds.length : 0); }, 0);
            $ionicPopup.alert({
              "title": "Import succeeded",
              "template": "" + numDatapoints + " data point(s) have been imported into your app."
            }).then(function(res) {
              // After popup, go to the timeline
              $state.go("app.timeline");
            });
          }).catch(function(e) {
            // If any of the request fails with a 401 error, the access token
            // has most probably expired. Send the user to the login page again.
            OAuth2.logoff(serviceKey);
            $state.go("app.connect", { service: serviceKey });
          });
      }

      vm.export = function() {
        Share.push(serviceKey, vm.datatypes)
          .then(function(e) {
            var numDatapoints = e.reduce(function(previousSum, currentIds) { return previousSum + (currentIds ? currentIds.length : 0); }, 0);
            $ionicPopup.alert({
              "title": "Share succeeded",
              "template": "" + numDatapoints + " data point(s) have been shared with " + vm.service.label + "."
            }).then(function(res) {
              // After popup, go to the timeline
              $state.go("app.timeline");
            });
          }).catch(function(e) {
            // If any of the request fails with a 401 error, the access token
            // has most probably expired. Send the user to the login page again.
            console.log(e);

            //OAuth2.logoff(serviceKey);
            //$state.go("app.connect", { service: serviceKey });
          });
      }


      return vm;
		}
})();
