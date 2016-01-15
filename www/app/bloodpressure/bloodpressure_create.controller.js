(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('BloodPressureCreateController', [ '$ionicHistory', 'BloodPressure', GenericCreateController ] );
})();
