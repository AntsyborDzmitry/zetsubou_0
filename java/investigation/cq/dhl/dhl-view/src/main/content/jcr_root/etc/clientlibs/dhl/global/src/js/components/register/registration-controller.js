/* global location */
import './registration-service';

RegistrationController.$inject = ['$timeout', '$q', 'navigationService', 'logService', 'registrationService'];

export default function RegistrationController($timeout, $q, navigationService, logService, registrationService) {
    const vm = this;

    const RESULT_STEP = 'result';
    const FORM_STEP = 'form';
    const ACTIVATION_STEP = 'verification';
    const ACTIVATION_TIMEOUT = 3333;
    const LOGIN_URL = 'auth/login.html';

    Object.assign(vm, {
        registerNewUser,
        getActivationId,
        activateAccount,
        renewActivationLink,
        navigateToEmailActivationPage,

        currentStep: FORM_STEP,
        emailActivationId: ''
    });

    const activationIdParam = getParameterByName('activationId');
    if (activationIdParam) {
        navigateToEmailActivationPage();
    }

    function registerNewUser(newUser) {
        return registrationService.registerNewUser(newUser)
            .then((activationId) => {
                // go to next step
                vm.currentStep = RESULT_STEP;
                vm.emailActivationId = activationId;
                return activationId;
            })
            .catch((error) => {
                logService.error(error);
                return $q.reject(error);
            });
    }

    function getActivationId() {
        return vm.emailActivationId;
    }

    function activateAccount() {
        return registrationService.verifyEmail(activationIdParam)
            .then(() => {
                $timeout(() => {
                    navigationService.location(LOGIN_URL);
                }, ACTIVATION_TIMEOUT);
            });
    }

    function renewActivationLink() {
        return registrationService.renewExpiredActivationLink(activationIdParam)
            .then((activationId) => {
                vm.emailActivationId = activationId;
                return activationId;
            });
    }

    function navigateToEmailActivationPage() {
        vm.currentStep = ACTIVATION_STEP;
    }

    function getParameterByName(paramName) {
        const name = paramName.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);

        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
}
