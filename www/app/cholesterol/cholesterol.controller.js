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
                  'units': 'mmol/L',
                  'chart': {
                    'pointFillColor' : '#4a90e2',
                    'pointStrokeColor' : '#0066d6',
                   },
                   'thresholds': [
                      { name: 'Desirable', max: 5 },
                      { name: 'Borderline high', min: 5, max: 6.5 },
                      { name: 'High', min: 6.5 },
                    ]
                },
                'ldl-cholesterol' : {
                  'valueKeyPath': 'body.blood_ldl_cholesterol.value',
                  'range': { min: 0, max: 20 },
                  'seriesName': 'LDL Cholesterol',
                  'units': 'mmol/L',
                  'chart': {
                    'pointFillColor' : '#E24A4A',
                    'pointStrokeColor' : '#D60000',
                   },
                   'thresholds': [
                      { name: 'Desirable', max: 2.5 },
                      { name: 'Borderline high', min: 2.5, max: 3.5 },
                      { name: 'High', min: 3.5 },
                    ]
                },
                'hdl-cholesterol' : {
                  'valueKeyPath': 'body.blood_hdl_cholesterol.value',
                  'range': { min: 0, max: 20 },
                  'units': 'mmol/L',
                  'seriesName': 'HDL Cholesterol',
                  'chart': {
                    'pointFillColor' : '#4AE250',
                    'pointStrokeColor' : '#00D605',
                   },
                   'thresholds': [
                      { name: 'Desirable', min: 1.5 },
                      { name: 'Borderline high', min: 1.5, max: 1.3 },
                      { name: 'High', max: 1.3 },
                    ]                   
                },
                'triglycerides' : {
                  'valueKeyPath': 'body.blood_triglycerides.value',
                  'range': undefined,
                  'units': 'mmol/L',
                  'seriesName': 'Triglycerides',
                  'chart': {
                    'pointFillColor' : '#DA4AE2',
                    'pointStrokeColor' : '#CB00D6',
                   },
                   'thresholds': [
                      { name: 'Desirable', max: 1.7 },
                      { name: 'Borderline high', min: 1.7, max: 6.0 },
                      { name: 'High', min: 6.0 },
                    ]
                },
              }
            };

      // Initialize the super class and extend it.
      angular.extend(vm, $controller('GenericChartController', {$scope: $scope}));

		  return vm;
		}
})();
