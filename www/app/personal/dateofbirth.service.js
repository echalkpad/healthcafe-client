(function() {
	angular.module('healthcafe.personal')
		.factory('DateOfBirth', DateOfBirth );

  DateOfBirth.$inject = [ 'StaticDatapoint' ];

  function DateOfBirth(StaticDatapoint) {
    return StaticDatapoint.getInstance(
      { namespace: 'nrc', name: 'date-of-birth', version: '0.1' },
      function(data) {
        if( !data.dob ) {
          return null;
        }
        return { 'date_of_birth': data.dob };
      }
    );
  }

})();

