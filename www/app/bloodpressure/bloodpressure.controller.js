(function() {
	angular.module('healthcafe.bloodpressure')
		.controller('BloodPressureController', [ '$scope', '$ionicSideMenuDelegate', '$window', 'BloodPressure', GenericChartController ] );
})();
