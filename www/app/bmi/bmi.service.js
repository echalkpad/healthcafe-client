(function() {
	angular.module('healthcafe.bmi')
		.factory('BMI', BMI );

  BMI.$inject = [ 'Datapoints' ];

  function BMI(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'omh', name: 'body-mass-index', version: '1.0' },
      function(data) {
        if( !data.weight || !data.length ) {
          return null;
        }
        return {
          'body_mass_index': { value: data.weight / ( data.length * data.length ), unit: 'kg/m2' },
        };
      }
    );
  }

})();
