define(['exports', 'module', './registration-service'], function (exports, module, _registrationService) {
    /* global location */
    'use strict';

    module.exports = RegistrationController;

    RegistrationController.$inject = ['$timeout', '$q', 'navigationService', 'logService', 'registrationService'];

    function RegistrationController($timeout, $q, navigationService, logService, registrationService) {
        var vm = this;

        var RESULT_STEP = 'result';
        var FORM_STEP = 'form';
        var ACTIVATION_STEP = 'verification';
        var ACTIVATION_TIMEOUT = 3333;
        var LOGIN_URL = 'auth/login.html';

        Object.assign(vm, {
            registerNewUser: registerNewUser,
            getActivationId: getActivationId,
            activateAccount: activateAccount,
            renewActivationLink: renewActivationLink,
            navigateToEmailActivationPage: navigateToEmailActivationPage,

            currentStep: FORM_STEP,
            emailActivationId: ''
        });

        var activationIdParam = getParameterByName('activationId');
        if (activationIdParam) {
            navigateToEmailActivationPage();
        }

        function registerNewUser(newUser) {
            return registrationService.registerNewUser(newUser).then(function (activationId) {
                // go to next step
                vm.currentStep = RESULT_STEP;
                vm.emailActivationId = activationId;
                return activationId;
            })['catch'](function (error) {
                logService.error(error);
                return $q.reject(error);
            });
        }

        function getActivationId() {
            return vm.emailActivationId;
        }

        function activateAccount() {
            return registrationService.verifyEmail(activationIdParam).then(function () {
                $timeout(function () {
                    navigationService.location(LOGIN_URL);
                }, ACTIVATION_TIMEOUT);
            });
        }

        function renewActivationLink() {
            return registrationService.renewExpiredActivationLink(activationIdParam).then(function (activationId) {
                vm.emailActivationId = activationId;
                return activationId;
            });
        }

        function navigateToEmailActivationPage() {
            vm.currentStep = ACTIVATION_STEP;
        }

        function getParameterByName(paramName) {
            var name = paramName.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);

            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }
    }
});
//# sourceMappingURL=registration-controller.js.map
