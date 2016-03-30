(function() {
	angular.module('healthcafe.bodyfat')
		.factory('BodyFat', BodyFat );

  BodyFat.$inject = [ 'Datapoints' ];

  function BodyFat(Datapoints) {
    return Datapoints.getInstance(
      { namespace: 'omh', name: 'body-fat-percentage', version: '1.0' },
      function(data) {
        if( !data.bodyfat ) {
          return null;
        }
        return { 'body_fat_percentage': { value: data.bodyfat, unit: '%' } };
      }
    );
  }

})();

