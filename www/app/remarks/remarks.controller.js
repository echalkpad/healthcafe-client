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
