define(['exports', 'module', 'ewf', './../../../../services/ewf-crud-service', './../../../../services/modal/modal-service'], function (exports, module, _ewf, _servicesEwfCrudService, _servicesModalModalService) {
    'use strict';

    module.exports = DigitalCustomsInvoiceController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].controller('DigitalCustomsInvoiceController', DigitalCustomsInvoiceController);

    DigitalCustomsInvoiceController.$inject = ['$scope', 'ewfCrudService', 'modalService'];

    function DigitalCustomsInvoiceController($scope, ewfCrudService, modalService) {
        var vm = this;

        var state = null;

        var STATE = {
            ENROLLED: 'enrolled',
            DISMISSED: 'dismissed'
        };

        Object.assign(vm, {
            dismiss: dismiss,
            enroll: enroll,
            showEnrollmentDialog: showEnrollmentDialog,
            getFormAction: getFormAction,
            handleCustomsInvoiceUploadSuccess: handleCustomsInvoiceUploadSuccess,
            handleCustomsInvoiceUploadError: handleCustomsInvoiceUploadError,
            clearCustomsInvoiceUploadErrors: clearCustomsInvoiceUploadErrors,
            deleteCustomsInvoice: deleteCustomsInvoice,
            handleAdditionalDocumentsUploadSuccess: handleAdditionalDocumentsUploadSuccess,
            handleAdditionalDocumentsUploadError: handleAdditionalDocumentsUploadError,
            clearAdditionalDocumentsUploadErrors: clearAdditionalDocumentsUploadErrors,
            deleteAdditionalDocument: deleteAdditionalDocument,
            isEnrolled: isEnrolled,
            isDismissed: isDismissed
        });

        function dismiss() {
            state = STATE.DISMISSED;
        }

        function enroll() {
            state = STATE.ENROLLED;
        }

        function showEnrollmentDialog() {
            var dialogPromise = modalService.showDialog({
                template: '<div ewf-modal title=\"Digital Customs Invoice\"><hr><div class=section__content><b nls=shipment.digital_customs_invoice_popup_header></b> <textarea class=\"textarea textarea_width_full textarea_height_large\" nls=shipment.digital_customs_invoice_popup_terms_and_conditions_text>\r\n        </textarea> <label class=checkbox><input type=checkbox class=checkbox__input ng-model=agreedAndAccepted> <span class=label nls=shipment.digital_customs_invoice_popup_accept_t_and_c_checkbox></span></label><div class=right ng-if=agreedAndAccepted><button class=\"btn btn_success right\" ewf-modal-resolver nls=shipment.digital_customs_invoice_popup_enroll_button_label></button> <b class=block nls=shipment.digital_customs_invoice_popup_need_to_make_updates></b><div><span nls=shipment.digital_customs_invoice_popup_footer_left></span> <a href=# nls=shipment.digital_customs_invoice_popup_my_profile_and_settings_link></a> <span nls=shipment.digital_customs_invoice_popup_footer_right></span></div></div></div></div>'
            }).result;
            dialogPromise.then(vm.enroll);
        }

        function getFormAction() {
            return '/api/shipment/customs-invoice/digital/' + $scope.countryCode;
        }

        function deleteDocument(key) {
            return ewfCrudService.deleteElement('/api/shipment/customs-invoice/digital/' + key);
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
            var model = $scope.digitalCustomsInvoice;
            deleteDocument(model.document.key).then(function () {
                model.document = null;
            });
        }

        function handleAdditionalDocumentsUploadSuccess(files, onSuccessHandled) {
            var _$scope$digitalCustomsInvoice$additionalDocuments;

            (_$scope$digitalCustomsInvoice$additionalDocuments = $scope.digitalCustomsInvoice.additionalDocuments).push.apply(_$scope$digitalCustomsInvoice$additionalDocuments, _toConsumableArray(files));
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
            var model = $scope.digitalCustomsInvoice;
            deleteDocument(model.additionalDocuments[documentIndex].key).then(function () {
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
});
//# sourceMappingURL=digital-customs-invoice-controller.js.map
