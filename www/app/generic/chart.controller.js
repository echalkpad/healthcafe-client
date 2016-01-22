/**
 * Generic chart controller to handle a list of datapoints
 **/
function GenericChartController($scope, $ionicSideMenuDelegate, $window, Model) {
    var vm = this;
    vm.chart = null;

    function getChart() {
      if( !vm.chart ) {
        createChart(vm.events);
      }

      return vm.chart;
    }

    function createChart(omhDataPoints) {
      if( vm.chart )
        vm.chart.destroy();

      var targetElement = d3.select('.chart-container');
      vm.chart = new OMHWebVisualizations.Chart( omhDataPoints, targetElement, Model.chartableProperties() );
    }

    function showChart() {
      var targetElement = d3.select('.chart-container');
      getChart().renderTo(targetElement.select('svg').node());
    }

    function load() {
      vm.events = [];
      Model.list().then(function(data) {
        vm.events = data;
        showChart(data);
      });
    }

    function refresh() {
      vm.events = [];
      Model.load().then(function(data) {
        vm.events = data;
        showChart(data);
      });
    }

    vm.remove = function(id) {
      Model.remove(id).then(function() {
        refresh();
      });
    };

    // Start loading data
    load();

    // Disable dragging of side menu when a chart is shown
    $scope.$on('$ionicView.enter', function(){
      $ionicSideMenuDelegate.canDragContent(false);
    });
    $scope.$on('$ionicView.leave', function(){
      $ionicSideMenuDelegate.canDragContent(true);
    });

    // Redraw the chart
    angular.element($window).bind('resize', function(){
      showChart();
    });

    return vm;
}
