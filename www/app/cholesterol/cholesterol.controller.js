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
                'tooltips': {
                  'contentFormatter': function(d) {
                    var body = d.omhDatum.body;
                    var total = body.blood_total_cholesterol.value.toFixed( 1 );

                    var details = [];

                    if(body.blood_ldl_cholesterol)
                      details.push( "LDL: " + body.blood_ldl_cholesterol.value.toFixed( 1 ) );

                    if(body.blood_hdl_cholesterol)
                      details.push( "HDL: " + body.blood_hdl_cholesterol.value.toFixed( 1 ) );

                    if(body.blood_triglycerides)
                      details.push( "Triglycerides: " + body.blood_triglycerides.value.toFixed( 1 ) );

                    var content = total;

                    if( details.length > 0 ) {
                      content += " <small>(" + details.join(", " ) + ")</small>"
                    }

                    return content;
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
                   }
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
