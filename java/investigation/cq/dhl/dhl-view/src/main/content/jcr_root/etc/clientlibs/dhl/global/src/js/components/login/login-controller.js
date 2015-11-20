import './../../services/user-service';
import './../../services/nls-service';
import './../../services/modal/modal-service';

LoginController.$inject = [
    '$scope',
    'modalService',
    'navigationService',
    'userService',
    'loginService',
    'nlsService'
];

/**
 * Login form controller
 */
export default function LoginController(
    $scope,
    modalService,
    navigationService,
    userService,
    loginService,
    nlsService) {
    const vm = this;

    Object.assign(vm, {
        username: userService.getUsername() || '',
        password: '',
        rememberMe: false,
        userInactive: false,
        loginErrors: [],
        formTitle: vm.formTitle || loginService.resolveFormTitle(),
        ewfFormCtrl: null,
        activationSuccessMessage: '',

        logIn,
        resendActivationEmail,
        startPasswordChangeProcess,
        closeStopCreditDialog
    });
    let dialogPromise;

    function logIn(validationState) {
        if (validationState.$valid) {
            $scope.submitted = true;
            $scope.$broadcast('ValidateForm');
            vm.loginErrors = [];
            return userService.logIn(vm.username, vm.password)
                .then(processCreditStopCheck)
                .then((data) => {
                    checkRememberMe();
                    doRedirect(data);
                })
                .catch(onLogInError);
        }
    }

    function processCreditStopCheck(data) {
        if (data.accountCreditStopMsg) {
            showCreditStopNotification();
            return dialogPromise.result
                .then(() => data);
        }
        return data;
    }

    function checkRememberMe() {
        if (vm.rememberMe) {
            userService.setUsername(vm.username);
        }
    }

    function doRedirect(data) {
        let location = 'user-profile.html';

        if (data.shipmentExpert) {
            location = 'shipment.html';
        }

        if (data.paperlessTrading) {
            location = 'dashboard.html';
        }

        navigationService.location(location);
    }

    function onLogInError(errors) {
        vm.ewfFormCtrl.setErrorsFromResponse(errors);

        if (errors.errors) {
            if (loginService.isPasswordExpired(errors.errors)) {
                handleExpiredPassword();
            } else if (loginService.isUserInactive(errors.errors)) {
                vm.formTitle = loginService.titles.DEFAULT;
                vm.userInactive = true;
            } else if (loginService.isUserInactiveAndActivationExpired(errors.errors)) {
                vm.formTitle = loginService.titles.ACTIVATION_EMAIL_EXPIRED;
                vm.userInactive = true;
            }
        }
    }

    function resendActivationEmail() {
        userService.resendActivationEmail(vm.username)
            .then(() => {
                vm.formTitle = loginService.titles.ACTIVATION_EMAIL_SENT;
                vm.ewfFormCtrl.cleanFormErrors();
                showActivationResendSuccessMessage();
                vm.userInactive = false;
            })
            .catch((errCode) => {
                vm.formTitle = loginService.titles.DEFAULT;
                vm.ewfFormCtrl.setErrorsFromResponse(errCode);
            });
    }

    function startPasswordChangeProcess() {
        userService.setPassword(vm.password);
        userService.setUsername(vm.username);
        navigationService.location('/auth/reset-password.html?scenario=change');
    }

    function showActivationResendSuccessMessage() {
        const loginActivationDaysLimit = loginService.getLoginActivationDaysLimit();
        vm.activationSuccessMessage = nlsService.getTranslationSync('login.activation_resend_success')
            .replace('{number}', loginActivationDaysLimit);

       modalService.showDialog({
            closeOnEsc: true,
            scope: $scope,
            windowClass: 'ngdialog-theme-default',
            templateUrl: 'resend-activation-success-modal.html'
        });
    }

    function showCreditStopNotification() {
        dialogPromise = modalService.showDialog({
            closeOnEsc: false,
            scope: $scope,
            windowClass: 'ngdialog-theme-default',
            showClose: false,
            templateUrl: 'credit-stop-message.html'
        });
    }

    function handleExpiredPassword() {
        modalService.showDialog({
            closeOnEsc: false,
            scope: $scope,
            windowClass: 'ngdialog-theme-default',
            showClose: false,
            templateUrl: 'expired-password-notification-modal.html'
        });
    }

    function closeStopCreditDialog() {
        dialogPromise.close();
    }
}
