(function() {
	angular.module('healthcafe.personal')
		.factory('BodyHeight', BodyHeight );

  BodyHeight.$inject = [ 'StaticDatapoint' ];

  function BodyHeight(StaticDatapoint) {
    return StaticDatapoint.getInstance(
      { namespace: 'omh', name: 'body-height', version: '1.0' },
      function(data) {
        if( !data.height ) {
          return null;
        }
        return { 'body_height': { value: data.height, unit: 'kg' } };
      }
    );
  }

})();

