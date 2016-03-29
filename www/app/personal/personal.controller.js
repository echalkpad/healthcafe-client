(function() {
	angular.module('healthcafe.personal')
		.controller('PersonalController', PersonalController );

		PersonalController.$inject = ['$q', '$state', '$ionicHistory', 'DateOfBirth', 'Gender', 'BodyHeight']

  /**
   * Controller to add/view static personal data (DOB, gender, height)
   **/
  function PersonalController($q, $state, $ionicHistory, DateOfBirth, Gender, BodyHeight) {
    var vm = this;

    vm.data = {
      body: {
        dob: null,
        gender: null,
        height: null
      },
      date: new Date()
    };

    // Load existing data
    DateOfBirth.get().then(function(datapoint) { vm.data.body.dob = datapoint.body.date_of_birth; });
    Gender.get().then(function(datapoint) { vm.data.body.gender = datapoint.body.gender; });
    BodyHeight.get().then(function(datapoint) { vm.data.body.height = datapoint.body.body_height.value; });

    // Save new data
    vm.save = function() {
      var saves = [
        DateOfBirth.set(vm.data.body),
        Gender.set(vm.data.body),
        BodyHeight.set(vm.data.body),
      ]

      function reload() {
        DateOfBirth.load();
        Gender.load();
        BodyHeight.load();
      }
      function go() {
        $ionicHistory.nextViewOptions({
          disableBack: true,
        });
        $state.go('app.timeline');
      }

      $q.all(saves).then(function() {
        reload();
        go();
      }).catch(function(e) {
        reload();
        go();
      });
    };

    return vm;
  }

})();
