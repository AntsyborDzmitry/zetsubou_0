import './../../../services/modal/modal-service';

EmailVerificationController.$inject = ['logService', '$scope', 'modalService'];

export default function EmailVerificationController(logService, $scope, modalService) {
    const vm = this;

    Object.assign(vm, {
        setRegistrationController,
        renewExpiredActivationLink,

        expired: false,
        invalid: false,
        verified: false
    });

    let registrationController;

    function setRegistrationController(ctrl) {
        registrationController = ctrl;

        registrationController.activateAccount()
            .then(() => {
                vm.verified = true;
            })
            .catch((error) => {
                vm.invalid = true;
                const key = error.data && error.data.errors && error.data.errors.length && error.data.errors[0];

                if (key === 'errors.link_expired') {
                    vm.expired = true;
                    vm.failMessageTranslationKey = 'registration.email_address_verification_expired_title';
                } else {
                    vm.failMessageTranslationKey = 'registration.email_address_verification_already_used_title';
                }

                logService.error(`Play failed! ${error}`);
            });
    }

    function renewExpiredActivationLink() {
        registrationController.renewActivationLink()
            .then(() => {
                showResendActivationLinkSuccessMessage();
            })
            .catch((error) => {
                logService.error(`Play failed! ${error}`);
            });
    }

    function showResendActivationLinkSuccessMessage() {
        modalService.showDialog({
            closeOnEsc: true,
            scope: $scope,
            windowClass: 'ngdialog-theme-default',
            templateUrl: 'resend-activation-success-modal.html'
        });
    }
}
