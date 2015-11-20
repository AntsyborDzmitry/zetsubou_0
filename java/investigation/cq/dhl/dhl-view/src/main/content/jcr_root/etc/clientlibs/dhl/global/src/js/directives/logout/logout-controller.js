import './../../services/user-service';

LogoutController.$inject = ['logService', 'navigationService', 'userService', 'loginService'];

export default function LogoutController(logService, navigationService, userService, loginService) {
    const vm = this;

    // methods
    vm.onElementClick = onElementClick;
    vm.logoutUser = logoutUser;

    function onElementClick(event) {
        event.preventDefault();
        vm.logoutUser();
        return false;
    }

    function logoutUser() {
        userService.logOut()
            .then(() => {
                loginService.saveNextFormTitle(loginService.titles.LOGGED_OUT);
                navigationService.redirectToLogin();
            })
            .catch((error) => {
                logService.error('logoutUser in LogoutController is failed: ' + error);
            });
    }
}
