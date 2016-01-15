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
