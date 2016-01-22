(function() {
	angular.module('healthcafe.bloodpressure')
		.factory('BloodPressure', BloodPressure );

  BloodPressure.$inject = [ 'Datapoints' ];

  function BloodPressure(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'omh', name: 'blood-pressure', version: '1.0' },
      function(data) {
        return {
          'systolic_blood_pressure': { value: data.systolic, unit: 'mmHg' },
          'diastolic_blood_pressure': { value: data.diastolic, unit: 'mmHg' },
        };
      }
    );
  }

})();
