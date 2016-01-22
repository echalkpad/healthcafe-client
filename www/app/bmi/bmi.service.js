(function() {
	angular.module('healthcafe.bmi')
		.factory('BMI', BMI );

  BMI.$inject = [ 'Datapoints' ];

  function BMI(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'omh', name: 'body-mass-index', version: '1.0' },
      'body-mass-index',
      function(data) {
        console.log( "Convert data point BMI" );
        return {
          'body_mass_index': { value: data.weight / ( data.length * data.length ), unit: 'kg/m2' },
        };
      }
    );
  }

})();
