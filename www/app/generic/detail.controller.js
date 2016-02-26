(function() {
	angular.module('healthcafe.generic')
		.controller('GenericDetailController', GenericDetailController );

		GenericDetailController.$inject = ['$scope', '$state', 'Datapoints']

  /**
   * Generic controller to show details about a datapoint
   **/
  function GenericDetailController($scope, $state, DatapointsFactory) {
    var vm = this;

    vm.measurementId = $state.params.measurementId;
    vm.measurement = null;

    // Get anonymous instance, since we don't care about the specific schema
    var model = DatapointsFactory.getInstance();

    // Load the datapoint
    model.get(vm.measurementId)
      .then(function(dataPoint) {
        vm.measurement = dataPoint;

        if( dataPoint.body.effective_time_frame && dataPoint.body.effective_time_frame.date_time ) {
          date = dataPoint.body.effective_time_frame.date_time;
        } else {
          date = dataPoint.header.creation_date_time;
        }

        vm.date = date;
      })
      .catch(function(e) {
        console.log( "Error loading data: ", e );
      });

    return vm;
  }

})();
