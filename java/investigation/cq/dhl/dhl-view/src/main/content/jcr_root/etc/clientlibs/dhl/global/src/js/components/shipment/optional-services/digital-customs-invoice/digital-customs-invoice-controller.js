import ewf from 'ewf';
import './../../../../services/ewf-crud-service';
import './../../../../services/modal/modal-service';

ewf.controller('DigitalCustomsInvoiceController', DigitalCustomsInvoiceController);

DigitalCustomsInvoiceController.$inject = ['$scope', 'ewfCrudService', 'modalService'];

export default function DigitalCustomsInvoiceController($scope, ewfCrudService, modalService) {
    const vm = this;

    let state = null;

    const STATE = {
        ENROLLED: 'enrolled',
        DISMISSED: 'dismissed'
    };

    Object.assign(vm, {
        dismiss,
        enroll,
        showEnrollmentDialog,
        getFormAction,
        handleCustomsInvoiceUploadSuccess,
        handleCustomsInvoiceUploadError,
        clearCustomsInvoiceUploadErrors,
        deleteCustomsInvoice,
        handleAdditionalDocumentsUploadSuccess,
        handleAdditionalDocumentsUploadError,
        clearAdditionalDocumentsUploadErrors,
        deleteAdditionalDocument,
        isEnrolled,
        isDismissed
    });

    function dismiss() {
        state = STATE.DISMISSED;
    }

    function enroll() {
        state = STATE.ENROLLED;
    }

    function showEnrollmentDialog() {
        const dialogPromise = modalService.showDialog({
            templateUrl: './digital-customs-invoice-enrollment-dialog-layout.html'
        }).result;
        dialogPromise.then(vm.enroll);
    }

    function getFormAction() {
        return `/api/shipment/customs-invoice/digital/${$scope.countryCode}`;
    }

    function deleteDocument(key) {
        return ewfCrudService.deleteElement(`/api/shipment/customs-invoice/digital/${key}`);
    }

    function handleCustomsInvoiceUploadSuccess(files, onSuccessHandled) {
        $scope.digitalCustomsInvoice.document = files[0];

        onSuccessHandled();
    }

    function handleCustomsInvoiceUploadError(errors) {
        vm.customsInvoiceUploadErrors = errors;
    }

    function clearCustomsInvoiceUploadErrors(onErrorsCleared) {
        vm.customsInvoiceUploadErrors = null;
        onErrorsCleared();
    }

    function deleteCustomsInvoice() {
        const model = $scope.digitalCustomsInvoice;
        deleteDocument(model.document.key)
            .then(() => {
                model.document = null;
            });
    }

    function handleAdditionalDocumentsUploadSuccess(files, onSuccessHandled) {
        $scope.digitalCustomsInvoice.additionalDocuments.push(...files);
        onSuccessHandled();
    }

    function handleAdditionalDocumentsUploadError(errors) {
        vm.additionalDocumentsUploadErrors = errors;
    }

    function clearAdditionalDocumentsUploadErrors(onErrorsCleared) {
        vm.additionalDocumentsUploadErrors = null;
        onErrorsCleared();
    }

    function deleteAdditionalDocument(documentIndex) {
        const model = $scope.digitalCustomsInvoice;
        deleteDocument(model.additionalDocuments[documentIndex].key)
            .then(() => {
                model.additionalDocuments.splice(documentIndex, 1);
            });
    }

    function isDismissed() {
        return state === STATE.DISMISSED;
    }

    function isEnrolled() {
        return state === STATE.ENROLLED;
    }
}
