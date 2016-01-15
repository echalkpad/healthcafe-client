(function() {
	angular.module('healthcafe.login')
		.controller('LoginController', LoginController );

	LoginController.$inject = [ 'config' ];

	function LoginController(config ) {
	  var vm = this;

	  // Generate login URL
    var apiConfig = config.current().api;

    vm.url = apiConfig.urls.autorization +
            "?client_id=" + apiConfig.key +
            "&redirect_uri=" + encodeURIComponent(apiConfig.urls.redirect) +
            "&response_type=token" +
            "&scope=read_data_points write_data_points delete_data_points"

    // window.location.href = url;

    return vm;
	}
})();
