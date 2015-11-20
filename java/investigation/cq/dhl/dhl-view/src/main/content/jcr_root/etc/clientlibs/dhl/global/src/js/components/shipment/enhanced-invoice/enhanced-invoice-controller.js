import './enhanced-invoice-service';
import './../../../services/modal/modal-service';
import './enhanced-invoice-model';
import './../ewf-shipment-service';
import './../../../services/location-service';
import './../../../constants/system-settings-constants';

EnhancedInvoiceController.$inject = ['$timeout',
                                     'systemSettings',
                                     'shipmentService',
                                     'modalService',
                                     'locationService',
                                     'enhancedInvoiceModel'];

export default function EnhancedInvoiceController($timeout,
                                                  systemSettings,
                                                  shipmentService,
                                                  modalService,
                                                  locationService,
                                                  enhancedInvoiceModel) {
    const vm = this;

    Object.assign(vm, {
        init,
        showSavedCustomsTemplatesPopup,
        logoUploaded,
        removeLogoImage,
        logoUploadError,
        isAttachLogoButtonVisible,
        isAttachNewLogoButtonVisible,
        clearInvoice,

        logoUploadErrors: []
    });

    function init() {
        vm.invoice = enhancedInvoiceModel.init({
            involvedPartiesData: shipmentService.getInvolvedPartiesAddressDetails()
        });

        locationService.loadAvailableLocations()
            .then((countriesList) => {
                enhancedInvoiceModel.setInvoiceData({countriesList});
                enhancedInvoiceModel.cacheModel();
            });
    }

    function showSavedCustomsTemplatesPopup() {
        modalService.showDialog({
            closeOnEsc: true,
            windowClass: 'ngdialog-theme-default ewf-modal_width_large',
            templateUrl: 'saved-customs-templates-popup.html'
        });
    }

    function logoUploaded(logo) {
        vm.logoUploadErrors = [];
        vm.invoice.logoParameters = logo;
    }

    function removeLogoImage() {
        vm.invoice.logoParameters = null;
    }

    function logoUploadError(errors) {
        vm.logoUploadErrors = errors || [];

        if (!vm.logoUploadErrors.length) {
            vm.logoUploadErrors = ['errors.uploaded_file_failed'];
        }

        $timeout(() => {
                vm.logoUploadErrors = [];
            },
            systemSettings.showInformationHintTimeout
        );
    }

    function isAttachLogoButtonVisible(fileUploaderCtrl) {
        return !fileUploaderCtrl.canShowFileList() && !vm.invoice.logoParameters;
    }

    function isAttachNewLogoButtonVisible(fileUploaderCtrl) {
        return fileUploaderCtrl.filesUploaded || !!vm.invoice.logoParameters;
    }

    function clearInvoice() {
        vm.invoice.resetModel();
        vm.invoice.logoParameters = null;
        vm.logoUploadErrors = [];
    }
}
