import './../../../constants/system-settings-constants';
import './../../../services/ewf-crud-service';
import './../../../services/modal/modal-service';

PaperlessCustomsController.$inject = [
    '$q',
    '$timeout',
    'systemSettings',
    'ewfCrudService',
    'modalService'
];

export default function PaperlessCustomsController($q, $timeout, systemSettings, ewfCrudService, modalService) {
    const CUSTOMS_ENDPOINT = '/api/myprofile/customs';
    const PAPERLESS_SETTINGS_ENDPOINT = `${CUSTOMS_ENDPOINT}/paperless`;
    const PAPERLESS_STATUS_ENDPOINT = `${PAPERLESS_SETTINGS_ENDPOINT}/status`;

    const GENERATED = {
        OWN: 'OWN',
        DHL: 'DHL'
    };

    const vm = this;

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

        loadSettings,
        updateSettings,
        isEnrollmentDisplayed,
        isTermsAgreementDisplayed,
        isSignatureRequiredError,
        enablePaperless,
        pausePaperless,
        acceptTermsConditions,
        termsConditionsPopup,
        signatureUploaded,
        logoUploaded,
        fileUploadError,
        removeImage,
        togglePaperlessHelp
    });

    function loadSettings() {
        ewfCrudService.getElementList(PAPERLESS_SETTINGS_ENDPOINT)
            .then((response) => {
                Object.assign(vm.settings, response);
            });
    }

    function updateSettings(ewfFormController) {
        let promise;
        if (ewfFormController.ewfValidation() && isValid()) {
            const params = {};

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
        return ewfCrudService.changeElement(PAPERLESS_STATUS_ENDPOINT, {enabled: status})
            .then(() => vm.settings.enabled = status);
    }

    function acceptTermsConditions(ewfFormController) {
        vm.settings.enabled = true;
        return vm.updateSettings(ewfFormController)
            .then(onSuccessfulEnrollment);
    }

    function termsConditionsPopup() {
        modalService.showDialog({
            closeOnEsc: true,
            windowClass: 'ngdialog-theme-default',
            templateUrl: 'paperless-customs-terms-conditions-popup.html'
        });
    }

    function onSuccessfulEnrollment() {
        vm.actionStatus.enrolled = true;
        vm.settings.enrolled = true;
        vm.enrollmentRequest = false;
        $timeout(() => {
                vm.actionStatus.enrolled = false;
            },
            systemSettings.showInformationHintTimeout
        );
    }

    function signatureUploaded(signature) {
        vm.errors.signature = [];
        vm.settings.signature = signature;
    }

    function logoUploaded(logo) {
        vm.errors.logo = [];
        vm.settings.logo = logo;
    }

    function fileUploadError({errors, type}) {
        vm.errors[type] = errors || [];

        if (vm.errors[type].length === 0) {
            vm.errors[type].push('errors.uploaded_file_failed');
        }

        $timeout(() => {
                vm.errors[type] = [];
            },
            systemSettings.showInformationHintTimeout
        );
    }

    function removeImage(type) {
        vm.settings[type] = null;
    }
}
