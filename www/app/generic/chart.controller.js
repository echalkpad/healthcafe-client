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
            if( !$scope.events || $scope.events.length == 0 ) {
              return
            }

            function getDatapointDate(dataPoint) {
              if( dataPoint.body.effective_time_frame && dataPoint.body.effective_time_frame.date_time ) {
                return dataPoint.body.effective_time_frame.date_time;
              } else {
                return dataPoint.header.creation_date_time;
              }
            }

            // Sort by date ascending
            $scope.events.sort(function(a,b) {
              return getDatapointDate(a) - getDatapointDate(b);
            });

            $scope.events = $scope.events.map( function(datapoint) { return $scope.model.convertDates(datapoint, function(d) { return d.toJSON(); }); });

            createChart($scope.events.slice());
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
            targetElement.select('svg').style( 'display', 'block' );
            chart.renderTo(targetElement.select('svg').node());
          }
        }

        function load() {
          $scope.loading = true;
          $scope.events = [];
          $scope.model.list().then(function(data) {
            $scope.events = data;
            $scope.loading = false;

            showChart(data);
          });
        }

        function refresh() {
          $scope.loading = true;
          $scope.events = [];
          $scope.model.load().then(function(data) {
            $scope.events = data;
            $scope.loading = false;

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
