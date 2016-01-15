(function() {
	angular.module('healthcafe.body_weight')
		.factory('BodyWeight', BodyWeight );

  BodyWeight.$inject = [ 'Datapoints' ];

  function BodyWeight(Datapoints) {
    return Datapoints.getInstance({ namespace: 'omh', name: 'body-weight', version: '1.0' }, function(data) {
      return { 'body_weight': { value: data.weight, unit: 'kg' } };
    });
  }

})();

