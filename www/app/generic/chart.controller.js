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
          vm.chart = new OMHWebVisualizations.Chart( omhDataPoints, targetElement, $scope.model.chartableProperties() );
        }

        function showChart() {
          var targetElement = d3.select($scope.selector);
          var chart = getChart();

          console.log( "Show chart", chart, vm.events );

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
          console.log( "enter view " );
          $ionicSideMenuDelegate.canDragContent(false);

          // Redraw the chart on resize
          angular.element($window).bind('resize', showChart);

          // Show chart on enter (otherwise the chart will not be drawn when a user reenters)
          if( vm.events && vm.events.length > 0 )
            showChart();
        });
        $scope.$on('$ionicView.leave', function(){
          $ionicSideMenuDelegate.canDragContent(true);

          // Redraw the chart on resize
          angular.element($window).unbind('resize', showChart);
        });

        return vm;
    }
})();
