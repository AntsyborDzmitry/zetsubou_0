define(['exports', 'module', './../../services/user-service', './../../services/nls-service', './../../services/modal/modal-service'], function (exports, module, _servicesUserService, _servicesNlsService, _servicesModalModalService) {
    'use strict';

    module.exports = LoginController;

    LoginController.$inject = ['$scope', 'modalService', 'navigationService', 'userService', 'loginService', 'nlsService'];

    /**
     * Login form controller
     */

    function LoginController($scope, modalService, navigationService, userService, loginService, nlsService) {
        var vm = this;

        Object.assign(vm, {
            username: userService.getUsername() || '',
            password: '',
            rememberMe: false,
            userInactive: false,
            loginErrors: [],
            formTitle: vm.formTitle || loginService.resolveFormTitle(),
            ewfFormCtrl: null,
            activationSuccessMessage: '',

            logIn: logIn,
            resendActivationEmail: resendActivationEmail,
            startPasswordChangeProcess: startPasswordChangeProcess,
            closeStopCreditDialog: closeStopCreditDialog
        });
        var dialogPromise = undefined;

        function logIn(validationState) {
            if (validationState.$valid) {
                $scope.submitted = true;
                $scope.$broadcast('ValidateForm');
                vm.loginErrors = [];
                return userService.logIn(vm.username, vm.password).then(processCreditStopCheck).then(function (data) {
                    checkRememberMe();
                    doRedirect(data);
                })['catch'](onLogInError);
            }
        }

        function processCreditStopCheck(data) {
            if (data.accountCreditStopMsg) {
                showCreditStopNotification();
                return dialogPromise.result.then(function () {
                    return data;
                });
            }
            return data;
        }

        function checkRememberMe() {
            if (vm.rememberMe) {
                userService.setUsername(vm.username);
            }
        }

        function doRedirect(data) {
            var location = 'user-profile.html';

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
            userService.resendActivationEmail(vm.username).then(function () {
                vm.formTitle = loginService.titles.ACTIVATION_EMAIL_SENT;
                vm.ewfFormCtrl.cleanFormErrors();
                showActivationResendSuccessMessage();
                vm.userInactive = false;
            })['catch'](function (errCode) {
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
            var loginActivationDaysLimit = loginService.getLoginActivationDaysLimit();
            vm.activationSuccessMessage = nlsService.getTranslationSync('login.activation_resend_success').replace('{number}', loginActivationDaysLimit);

            modalService.showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default',
                template: '<div ewf-modal><div id=modal_resendActivation><h3 nls=login.activation_email_sent></h3><div class=ngdialog-message>{{loginCtrl.activationSuccessMessage}}</div></div></div>'
            });
        }

        function showCreditStopNotification() {
            dialogPromise = modalService.showDialog({
                closeOnEsc: false,
                scope: $scope,
                windowClass: 'ngdialog-theme-default',
                showClose: false,
                template: '<div ewf-modal><div class=ngdialog-message nls=login.credit_stop_message></div><button ng-click=loginCtrl.closeStopCreditDialog() nls=login.credit_stop_close_button_lable></button></div>'
            });
        }

        function handleExpiredPassword() {
            modalService.showDialog({
                closeOnEsc: false,
                scope: $scope,
                windowClass: 'ngdialog-theme-default',
                showClose: false,
                template: '<div ewf-modal><div id=modal_continueExpiredPassword><div class=ngdialog-message nls=login.password_expired_message></div><button ng-click=loginCtrl.startPasswordChangeProcess() nls=login.continue_with_change_expired_password></button></div></div>'
            });
        }

        function closeStopCreditDialog() {
            dialogPromise.close();
        }
    }
});
//# sourceMappingURL=login-controller.js.map
