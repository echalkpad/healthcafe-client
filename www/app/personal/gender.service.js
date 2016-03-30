(function() {
	angular.module('healthcafe.personal')
		.factory('Gender', Gender );

  Gender.$inject = [ 'StaticDatapoint' ];

  function Gender(StaticDatapoint) {
    return StaticDatapoint.getInstance(
      { namespace: 'nrc', name: 'gender', version: '0.1' },
      function(data) {
        if( !data.gender ) {
          return null;
        }
        return { 'gender': data.gender };
      }
    );
  }

})();

