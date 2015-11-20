define(['exports', 'module', './../../services/user-service'], function (exports, module, _servicesUserService) {
    'use strict';

    module.exports = LogoutController;

    LogoutController.$inject = ['logService', 'navigationService', 'userService', 'loginService'];

    function LogoutController(logService, navigationService, userService, loginService) {
        var vm = this;

        // methods
        vm.onElementClick = onElementClick;
        vm.logoutUser = logoutUser;

        function onElementClick(event) {
            event.preventDefault();
            vm.logoutUser();
            return false;
        }

        function logoutUser() {
            userService.logOut().then(function () {
                loginService.saveNextFormTitle(loginService.titles.LOGGED_OUT);
                navigationService.redirectToLogin();
            })['catch'](function (error) {
                logService.error('logoutUser in LogoutController is failed: ' + error);
            });
        }
    }
});
//# sourceMappingURL=logout-controller.js.map
