(function() {
	angular.module('healthcafe.vita16')
		.factory('Vita16', Vita16 );

  Vita16.$inject = [ 'Datapoints' ];

  function Vita16(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'omh', name: 'body-weight', version: '1.0' },
      function(data) {
        if( !data.weight ) {
          return null;
        }
        return { 'body_weight': { value: 888, unit: 'TEST' } };
      }
    );
  }

})();
