
import './profile-password-directive';
import './../profile-settings-service';
import './../../../constants/system-settings-constants';
import './../../../services/ewf-spinner-service';

ProfilePasswordController.$inject = [
    '$scope',
    '$timeout',
    'profileSettingsService',
    'systemSettings',
    'ewfSpinnerService'
];

export default function ProfilePasswordController(
    $scope,
    $timeout,
    profileSettingsService,
    systemSettings,
    ewfSpinnerService) {

    const vm = this;

    Object.assign(vm, {
        ewfFormCtrl: null,
        oldPassword: '',
        newPassword: '',
        emailAddress: '',
        passwordUpdated: false,

        updatePassword
    });

    const authenticateDetailsPromise = profileSettingsService.getAuthenticationDetails();

    const promise = authenticateDetailsPromise
        .then((response) => vm.emailAddress = response.userName);
    return ewfSpinnerService.applySpinner(promise);

    function updatePassword() {
        if (vm.oldPassword !== vm.newPassword) {
            const credentialsObject = getCredentialsObject(vm.oldPassword, vm.newPassword);
            const profilePasswordPromise = profileSettingsService.updateProfilePassword(credentialsObject);

            return profilePasswordPromise
                .then((response) => {
                    vm.profilePasswordResponse = response;
                    vm.newPassword = '';
                    vm.emailAddress = '';
                    vm.passwordUpdated = true;
                    vm.newPasswordValidation = false;
                    vm.newPasswordValidationMessage = '';

                    $timeout(() => vm.passwordUpdated = false, systemSettings.showInformationHintTimeout);
                })
                .catch((err) => {
                    vm.ewfFormCtrl.setErrorsFromResponse(err);

                    Object.keys(err.fieldErrors).forEach((fieldName) => {
                        err.fieldErrors[fieldName].forEach((errorMessage) => {
                            vm.ewfFormCtrl.addFieldError(fieldName, errorMessage);
                        });
                    });
                    vm.ewfFormCtrl.ewfValidation();
                });
        }
    }

   function getCredentialsObject(oldPassword, newPassword) {
        return {
            oldPassword,
            newPassword
        };
    }
}
