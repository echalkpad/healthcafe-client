(function() {
	angular.module('healthcafe.cholesterol')
		.factory('Cholesterol', Cholesterol );

  Cholesterol.$inject = [ 'Datapoints' ];

  function Cholesterol(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'nrc', name: 'cholesterol', version: '0.1' },
      function(data) {
        if( !data.total ) {
          return null;
        }

        var output = {
          'blood_total_cholesterol': { value: data.total, unit: 'mmol/L' },
        };

        if( data.ldl ) {
          output['blood_ldl_cholesterol'] = { value: data.ldl, unit: 'mmol/L' };
        }

        if( data.hdl ) {
          output['blood_hdl_cholesterol'] = { value: data.hdl, unit: 'mmol/L' };
        }

        if( data.triglycerides ) {
          output['blood_triglycerides'] = { value: data.triglycerides, unit: 'mmol/L' };
        }

        return output;
      }
    );
  }

})();
