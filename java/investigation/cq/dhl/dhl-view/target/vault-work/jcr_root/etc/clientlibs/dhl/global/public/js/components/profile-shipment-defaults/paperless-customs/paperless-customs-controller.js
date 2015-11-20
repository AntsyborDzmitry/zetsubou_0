define(['exports', 'module', './../../../constants/system-settings-constants', './../../../services/ewf-crud-service', './../../../services/modal/modal-service'], function (exports, module, _constantsSystemSettingsConstants, _servicesEwfCrudService, _servicesModalModalService) {
    'use strict';

    module.exports = PaperlessCustomsController;

    PaperlessCustomsController.$inject = ['$q', '$timeout', 'systemSettings', 'ewfCrudService', 'modalService'];

    function PaperlessCustomsController($q, $timeout, systemSettings, ewfCrudService, modalService) {
        var CUSTOMS_ENDPOINT = '/api/myprofile/customs';
        var PAPERLESS_SETTINGS_ENDPOINT = CUSTOMS_ENDPOINT + '/paperless';
        var PAPERLESS_STATUS_ENDPOINT = PAPERLESS_SETTINGS_ENDPOINT + '/status';

        var GENERATED = {
            OWN: 'OWN',
            DHL: 'DHL'
        };

        var vm = this;

        Object.assign(vm, {
            settings: {},
            errors: {
                signature: [],
                logo: []
            },
            actionStatus: {
                displayErrors: false
            },
            generated: GENERATED,
            enrollmentRequest: false,
            isPaperlessHelpShown: false,

            loadSettings: loadSettings,
            updateSettings: updateSettings,
            isEnrollmentDisplayed: isEnrollmentDisplayed,
            isTermsAgreementDisplayed: isTermsAgreementDisplayed,
            isSignatureRequiredError: isSignatureRequiredError,
            enablePaperless: enablePaperless,
            pausePaperless: pausePaperless,
            acceptTermsConditions: acceptTermsConditions,
            termsConditionsPopup: termsConditionsPopup,
            signatureUploaded: signatureUploaded,
            logoUploaded: logoUploaded,
            fileUploadError: fileUploadError,
            removeImage: removeImage,
            togglePaperlessHelp: togglePaperlessHelp
        });

        function loadSettings() {
            ewfCrudService.getElementList(PAPERLESS_SETTINGS_ENDPOINT).then(function (response) {
                Object.assign(vm.settings, response);
            });
        }

        function updateSettings(ewfFormController) {
            var promise = undefined;
            if (ewfFormController.ewfValidation() && isValid()) {
                var params = {};

                Object.assign(params, vm.settings);

                if (vm.settings.logo) {
                    params.logo = vm.settings.logo.key;
                }

                if (vm.settings.signature) {
                    params.signature = vm.settings.signature.key;
                }

                promise = ewfCrudService.updateElement(PAPERLESS_SETTINGS_ENDPOINT, params);
            } else {
                vm.actionStatus.displayErrors = true;
                promise = $q.reject();
            }
            return promise;
        }

        function isValid() {
            if (vm.settings.generatedBy === GENERATED.DHL) {
                return vm.signerForm.$valid && !!vm.settings.signature;
            }
            return vm.settings.generatedBy === GENERATED.OWN;
        }

        function togglePaperlessHelp() {
            vm.isPaperlessHelpShown = !vm.isPaperlessHelpShown;
        }

        function isSignatureRequiredError() {
            return vm.settings.generatedBy === GENERATED.DHL && !vm.settings.signature && vm.actionStatus.displayErrors;
        }

        function isEnrollmentDisplayed() {
            return !!(vm.settings.enrolled || vm.enrollmentRequest);
        }

        function isTermsAgreementDisplayed() {
            return !!(vm.settings.generatedBy && !vm.settings.enrolled);
        }

        function enablePaperless() {
            return changePaperlessStatus(true);
        }

        function pausePaperless() {
            return changePaperlessStatus(false);
        }

        function changePaperlessStatus(status) {
            return ewfCrudService.changeElement(PAPERLESS_STATUS_ENDPOINT, { enabled: status }).then(function () {
                return vm.settings.enabled = status;
            });
        }

        function acceptTermsConditions(ewfFormController) {
            vm.settings.enabled = true;
            return vm.updateSettings(ewfFormController).then(onSuccessfulEnrollment);
        }

        function termsConditionsPopup() {
            modalService.showDialog({
                closeOnEsc: true,
                windowClass: 'ngdialog-theme-default',
                template: '<ewf-modal dialog-width=large><ewf-paperless-customs-terms-conditions></ewf-paperless-customs-terms-conditions></ewf-modal>'
            });
        }

        function onSuccessfulEnrollment() {
            vm.actionStatus.enrolled = true;
            vm.settings.enrolled = true;
            vm.enrollmentRequest = false;
            $timeout(function () {
                vm.actionStatus.enrolled = false;
            }, systemSettings.showInformationHintTimeout);
        }

        function signatureUploaded(signature) {
            vm.errors.signature = [];
            vm.settings.signature = signature;
        }

        function logoUploaded(logo) {
            vm.errors.logo = [];
            vm.settings.logo = logo;
        }

        function fileUploadError(_ref) {
            var errors = _ref.errors;
            var type = _ref.type;

            vm.errors[type] = errors || [];

            if (vm.errors[type].length === 0) {
                vm.errors[type].push('errors.uploaded_file_failed');
            }

            $timeout(function () {
                vm.errors[type] = [];
            }, systemSettings.showInformationHintTimeout);
        }

        function removeImage(type) {
            vm.settings[type] = null;
        }
    }
});
//# sourceMappingURL=paperless-customs-controller.js.map
