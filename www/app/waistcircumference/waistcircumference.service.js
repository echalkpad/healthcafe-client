(function() {
	angular.module('healthcafe.waistcircumference')
		.factory('WaistCircumference', WaistCircumference );

  WaistCircumference.$inject = [ 'Datapoints' ];

  function WaistCircumference(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'nrc', name: 'waist-circumference', version: '0.1' },
      function(data) {
        if( !data.waist ) {
          return null;
        }
        return { 'waist_circumference': { value: data.waist, unit: 'm' } };
      }
    );
  }

})();

