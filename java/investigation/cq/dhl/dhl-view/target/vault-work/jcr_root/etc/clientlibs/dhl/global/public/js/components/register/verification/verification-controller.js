define(['exports', 'module', './../../../services/modal/modal-service'], function (exports, module, _servicesModalModalService) {
    'use strict';

    module.exports = EmailVerificationController;

    EmailVerificationController.$inject = ['logService', '$scope', 'modalService'];

    function EmailVerificationController(logService, $scope, modalService) {
        var vm = this;

        Object.assign(vm, {
            setRegistrationController: setRegistrationController,
            renewExpiredActivationLink: renewExpiredActivationLink,

            expired: false,
            invalid: false,
            verified: false
        });

        var registrationController = undefined;

        function setRegistrationController(ctrl) {
            registrationController = ctrl;

            registrationController.activateAccount().then(function () {
                vm.verified = true;
            })['catch'](function (error) {
                vm.invalid = true;
                var key = error.data && error.data.errors && error.data.errors.length && error.data.errors[0];

                if (key === 'errors.link_expired') {
                    vm.expired = true;
                    vm.failMessageTranslationKey = 'registration.email_address_verification_expired_title';
                } else {
                    vm.failMessageTranslationKey = 'registration.email_address_verification_already_used_title';
                }

                logService.error('Play failed! ' + error);
            });
        }

        function renewExpiredActivationLink() {
            registrationController.renewActivationLink().then(function () {
                showResendActivationLinkSuccessMessage();
            })['catch'](function (error) {
                logService.error('Play failed! ' + error);
            });
        }

        function showResendActivationLinkSuccessMessage() {
            modalService.showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default',
                template: '<div ewf-modal><div id=modal_resendActivation><h3 nls=login.activation_email_sent></h3><div class=ngdialog-message nls=login.activation_resend_success></div></div></div>'
            });
        }
    }
});
//# sourceMappingURL=verification-controller.js.map
