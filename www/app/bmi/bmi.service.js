(function() {
	angular.module('healthcafe.bmi')
		.factory('BMI', BMI );

  BMI.$inject = [ 'Datapoints' ];

  function BMI(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'omh', name: 'body-mass-index', version: '1.0' },
      function(data) {
        if( !data.weight || !data.height ) {
          return null;
        }
        return {
          'body_mass_index': { value: data.weight / ( data.height * data.height ), unit: 'kg/m2' },
        };
      }
    );
  }

})();
