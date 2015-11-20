define(['exports', 'module', './../../services/modal/modal-service'], function (exports, module, _servicesModalModalService) {
    'use strict';

    module.exports = ResetPasswordController;

    ResetPasswordController.$inject = ['$window', '$scope', 'modalService', 'logService', 'nlsService', 'navigationService', 'passwordService', 'loginService', 'userService'];

    function ResetPasswordController($window, $scope, modalService, logService, nlsService, navigationService, passwordService, loginService, userService) {

        var vm = this;

        Object.assign(vm, {
            init: init,
            resetPassword: resetPassword,
            createPassword: createPassword,
            changePassword: changePassword,
            resendPasswordResetEmail: resendPasswordResetEmail,
            resendPasswordCreateEmail: resendPasswordCreateEmail,
            redirectToLogin: redirectToLogin,
            validateResetForm: validateResetForm,

            password: '',
            errors: [],
            token: navigationService.getParamFromUrl('token'),
            tokenValidation: false,
            tokenExpired: false
        });

        //TODO: fix gulp-jscpd bug with duplicate lines and extract function
        vm.isTokenValidAndNotExpired = function () {
            return !vm.tokenExpired && vm.tokenValidation;
        };

        var RESET_PASSWORD_SCENARIO = {
            RESET: 'reset',
            CREATE: 'create',
            CHANGE: 'change'
        };

        var LINK_EXPIRED = 'errors.link_expired';
        var LINK_INVALID = 'errors.link_invalid';

        var scenario = navigationService.getParamFromUrl('scenario');
        scenario = scenario ? scenario : RESET_PASSWORD_SCENARIO.RESET;

        vm.scenario = RESET_PASSWORD_SCENARIO[scenario.toUpperCase()] ? scenario : RESET_PASSWORD_SCENARIO.RESET;

        vm.init();

        function init() {
            switch (vm.scenario) {
                case RESET_PASSWORD_SCENARIO.RESET:
                    processResetPassword();
                    break;
                case RESET_PASSWORD_SCENARIO.CREATE:
                    processCreatePassword();
                    break;
                case RESET_PASSWORD_SCENARIO.CHANGE:
                    processChangePassword();
                    break;
            }
        }

        function processResetPassword() {
            passwordService.validateResetToken(vm.token).then(function () {
                vm.tokenValidation = true;
            })['catch'](processTokenError);
        }

        function processCreatePassword() {
            nlsService.getTranslation('resetpassword.create_password_action').then(function (text) {
                $window.document.title = text;
            });
            passwordService.validateCreateToken(vm.token).then(function () {
                vm.tokenValidation = true;
            })['catch'](processTokenError);
        }

        function processChangePassword() {
            nlsService.getTranslation('resetpassword.change_password_action').then(function (text) {
                $window.document.title = text;
            });
            vm.tokenValidation = true;
            var expiredPassword = userService.getPassword();
            var username = userService.getUsername();
            userService.clearStoredCredentials();
            if (!expiredPassword) {
                logService.log('Expired password not found. Redirecting to login...');
                redirectToLogin();
            }
            vm.expiredPassword = expiredPassword;
            vm.username = username;
        }

        function validateResetForm(resetForm) {
            return $scope.ewfFormCtrl.ewfValidation() && resetForm.$valid;
        }

        function resetPassword() {
            vm.submitted = true;

            passwordService.resetPassword(vm.token, vm.password).then(function () {
                showSuccessDialog({
                    nlsTitle: 'resetpassword.reset_password_success_title',
                    nlsMessage: 'resetpassword.reset_password_success_message',
                    okButtonNlsLabel: 'resetpassword.confirm'
                });
            })['catch'](onServiceError);
        }

        function createPassword() {
            vm.submitted = true;

            passwordService.createPassword(vm.token, vm.password).then(function () {
                showSuccessDialog({
                    nlsTitle: 'resetpassword.create_password_success_title',
                    nlsMessage: 'resetpassword.create_password_success_message',
                    okButtonNlsLabel: 'resetpassword.confirm'
                });
            })['catch'](onServiceError);
        }

        function changePassword() {
            vm.submitted = true;

            passwordService.changeExpiredPassword(vm.username, vm.expiredPassword, vm.password).then(function () {
                showSuccessDialog({
                    nlsTitle: 'resetpassword.change_password_success_title',
                    nlsMessage: 'resetpassword.change_password_success_message',
                    okButtonNlsLabel: 'resetpassword.confirm'
                });
            })['catch'](onServiceError);
        }

        function resendPasswordResetEmail() {
            passwordService.resendPasswordResetEmail(vm.token).then(redirectToLogin)['catch'](onServiceError);
        }

        function resendPasswordCreateEmail() {
            passwordService.resendPasswordCreateEmail(vm.token).then(redirectToLogin)['catch'](onServiceError);
        }

        function processTokenError(err) {
            logService.log(err);
            var error = err.data.errors[0];
            if (error === LINK_INVALID) {
                if (vm.scenario === RESET_PASSWORD_SCENARIO.CREATE) {
                    loginService.saveNextFormTitle('resetpassword.create_password_already_used');
                    navigationService.redirectToLogin();
                }
                if (vm.scenario === RESET_PASSWORD_SCENARIO.RESET) {
                    loginService.saveNextFormTitle('resetpassword.reset_password_already_used');
                    navigationService.redirectToLogin();
                }
            }
            if (err.status === 400) {
                if (error === LINK_EXPIRED) {
                    vm.tokenExpired = true;
                } else {
                    vm.errors.push(LINK_INVALID);
                }
            }
        }

        function showSuccessDialog(dialogOptions) {
            modalService.showMessageDialog(dialogOptions)['finally'](redirectToLogin);
        }

        function onServiceError(err) {
            logService.log(err);
            if (err.data) {
                vm.errors = err.data.errors ? err.data.errors : err.data.fieldErrors && err.data.fieldErrors.newPassword;
            }
        }

        function redirectToLogin() {
            navigationService.redirectToLogin();
        }
    }
});
//# sourceMappingURL=reset-password-controller.js.map
