(function() {
	angular.module('healthcafe.bloodglucose')
		.factory('BloodGlucose', BloodGlucose );

  BloodGlucose.$inject = [ 'Datapoints' ];

  function BloodGlucose(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'omh', name: 'blood-glucose', version: '1.0' },
      function(data) {
        if( !data.level ) {
          return null;
        }

        return {
          'blood_glucose': { value: data.level, unit: 'mmol/L' },
          'temporal_relationship_to_meal': data.relationship_to_meal ? data.relationship_to_meal.name : ""
        };
      }
    );
  }

})();
