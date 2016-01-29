(function() {
	angular.module('healthcafe.cholesterol')
		.controller('CholesterolController', CholesterolController );

		CholesterolController.$inject = [ '$scope', '$controller', 'Cholesterol' ];

		function CholesterolController( $scope, $controller, Model ) {
		  var vm = this;

      $scope.model = Model;
      $scope.selector = ".cholesterol-container"
      $scope.chartableProperties = 'total-cholesterol,ldl-cholesterol,hdl-cholesterol,triglycerides';
      $scope.chartOptions = {
              'userInterface': {
                'legend': true,
                'thresholds': { 'show': false },
                'tooltips': {
                  'grouped': false,
                  'contentFormatter': function(d) {
                    return d.y.toFixed(1);
                  }
                }
              },
              'measures': {
                'total-cholesterol' : {
                  'valueKeyPath': 'body.blood_total_cholesterol.value',
                  'range':undefined,
                  'seriesName': 'Total Cholesterol',
                  'units': 'mg/dL',
                  'chart': {
                    'pointFillColor' : '#4a90e2',
                    'pointStrokeColor' : '#0066d6',
                   },
                   'thresholds': [
                      { name: 'Desirable', max: 200 },
                      { name: 'Borderline high', min: 200, max: 240 },
                      { name: 'High', min: 240 },
                    ]
                },
                'ldl-cholesterol' : {
                  'valueKeyPath': 'body.blood_ldl_cholesterol.value',
                  'range': { min: 0, max: 20 },
                  'seriesName': 'LDL Cholesterol',
                  'units': 'mg/dL',
                  'chart': {
                    'pointFillColor' : '#E24A4A',
                    'pointStrokeColor' : '#D60000',
                   }
                },
                'hdl-cholesterol' : {
                  'valueKeyPath': 'body.blood_hdl_cholesterol.value',
                  'range': { min: 0, max: 20 },
                  'units': 'mg/dL',
                  'seriesName': 'HDL Cholesterol',
                  'chart': {
                    'pointFillColor' : '#4AE250',
                    'pointStrokeColor' : '#00D605',
                   }
                },
                'triglycerides' : {
                  'valueKeyPath': 'body.blood_triglycerides.value',
                  'range': undefined,
                  'units': 'mg/dL',
                  'seriesName': 'Triglycerides',
                  'chart': {
                    'pointFillColor' : '#DA4AE2',
                    'pointStrokeColor' : '#CB00D6',
                   }
                },
              }
            };

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();
