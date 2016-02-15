(function() {
	angular.module('healthcafe.sharing')
		.controller('ShareController', ShareController );

		ShareController.$inject = [ '$state', '$ionicHistory', '$ionicPopup', 'OAuth2', 'config', 'Share'];

		function ShareController($state, $ionicHistory, $ionicPopup, OAuth2, config, Share) {
      var vm = this;

      var serviceKey = $state.params.service;

      // Check whether this user is already connected
      if( !OAuth2.isAuthenticated(serviceKey) ) {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });

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
      vm.importing = false;
      vm.import = function() {
        vm.importing = true;
        Share.pull(serviceKey, vm.datatypes)
          .then(function(e) {
            vm.importing = false;

            var numDatapoints = e.reduce(function(previousSum, currentIds) { return previousSum + (currentIds ? currentIds.length : 0); }, 0);
            $ionicPopup.alert({
              "title": "Import succeeded",
              "template": "" + numDatapoints + " data point(s) have been imported into your app."
            }).then(function(res) {
              // After popup, go to the timeline
              $state.go("app.timeline");
            });
          }).catch(function(response) {
            vm.importing = false;

            // If any of the request fails with a 401 error, the access token
            // has most probably expired. Send the user to the login page again.
            if(response.status == 401) {
              $ionicPopup.alert({
                "title": "Credentials expired",
                "template": "Unfortunately your credentials have expired. Please allow the application access."
              }).then(function(res) {
                // After popup, go to the login screen
                OAuth2.logoff(serviceKey);
                $state.go("app.connect", { service: serviceKey });
              });
            } else {
              $ionicPopup.alert({
                "title": "Sharing error",
                "template": "An error occurred while importing data from " + vm.service.label + ". Please contact an administrator.<br /><br />" + response.status + ": " + response.data.error
              });
            }
          });
      }

      vm.exporting = false;
      vm.export = function() {
        vm.exporting = true;
        Share.push(serviceKey, vm.datatypes)
          .then(function(e) {
            vm.exporting = false;
            var numDatapoints = e.reduce(function(previousSum, currentIds) { return previousSum + (currentIds ? currentIds.length : 0); }, 0);
            $ionicPopup.alert({
              "title": "Share succeeded",
              "template": "" + numDatapoints + " data point(s) have been shared with " + vm.service.label + "."
            }).then(function(res) {
              // After popup, go to the timeline
              $state.go("app.timeline");
            });
          }).catch(function(response) {
            vm.exporting = false;

            // If any of the request fails with a 401 error, the access token
            // has most probably expired. Send the user to the login page again.
            if(response.status == 401) {
              $ionicPopup.alert({
                "title": "Credentials expired",
                "template": "Unfortunately your credentials have expired. Please allow the application access."
              }).then(function(res) {
                // After popup, go to the login screen
                OAuth2.logoff(serviceKey);
                $state.go("app.connect", { service: serviceKey });
              });
            } else {
              $ionicPopup.alert({
                "title": "Sharing error",
                "template": "An error occurred while sharing data with " + vm.service.label + ". Please contact an administrator.<br /><br />" + response.status + ": " + response.data.error
              });
            }
          });
      }


      return vm;
		}
})();
