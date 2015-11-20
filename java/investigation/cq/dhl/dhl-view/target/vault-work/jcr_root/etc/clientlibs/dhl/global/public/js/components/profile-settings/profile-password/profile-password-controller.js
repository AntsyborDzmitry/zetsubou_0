define(['exports', 'module', './profile-password-directive', './../profile-settings-service', './../../../constants/system-settings-constants', './../../../services/ewf-spinner-service'], function (exports, module, _profilePasswordDirective, _profileSettingsService, _constantsSystemSettingsConstants, _servicesEwfSpinnerService) {
    'use strict';

    module.exports = ProfilePasswordController;

    ProfilePasswordController.$inject = ['$scope', '$timeout', 'profileSettingsService', 'systemSettings', 'ewfSpinnerService'];

    function ProfilePasswordController($scope, $timeout, profileSettingsService, systemSettings, ewfSpinnerService) {

        var vm = this;

        Object.assign(vm, {
            ewfFormCtrl: null,
            oldPassword: '',
            newPassword: '',
            emailAddress: '',
            passwordUpdated: false,

            updatePassword: updatePassword
        });

        var authenticateDetailsPromise = profileSettingsService.getAuthenticationDetails();

        var promise = authenticateDetailsPromise.then(function (response) {
            return vm.emailAddress = response.userName;
        });
        return ewfSpinnerService.applySpinner(promise);

        function updatePassword() {
            if (vm.oldPassword !== vm.newPassword) {
                var credentialsObject = getCredentialsObject(vm.oldPassword, vm.newPassword);
                var profilePasswordPromise = profileSettingsService.updateProfilePassword(credentialsObject);

                return profilePasswordPromise.then(function (response) {
                    vm.profilePasswordResponse = response;
                    vm.newPassword = '';
                    vm.emailAddress = '';
                    vm.passwordUpdated = true;
                    vm.newPasswordValidation = false;
                    vm.newPasswordValidationMessage = '';

                    $timeout(function () {
                        return vm.passwordUpdated = false;
                    }, systemSettings.showInformationHintTimeout);
                })['catch'](function (err) {
                    vm.ewfFormCtrl.setErrorsFromResponse(err);

                    Object.keys(err.fieldErrors).forEach(function (fieldName) {
                        err.fieldErrors[fieldName].forEach(function (errorMessage) {
                            vm.ewfFormCtrl.addFieldError(fieldName, errorMessage);
                        });
                    });
                    vm.ewfFormCtrl.ewfValidation();
                });
            }
        }

        function getCredentialsObject(oldPassword, newPassword) {
            return {
                oldPassword: oldPassword,
                newPassword: newPassword
            };
        }
    }
});
//# sourceMappingURL=profile-password-controller.js.map
