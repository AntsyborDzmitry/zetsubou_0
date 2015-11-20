import './../../../services/modal/modal-service';
import './../ewf-shipment-service';
import './../ewf-shipment-flow-service';
import './../enhanced-invoice/enhanced-invoice-model';

ShipmentToolbarController.$inject = [
    '$scope',
    'navigationService',
    'shipmentService',
    'shipmentFlowService',
    'modalService',
    'enhancedInvoiceModel'
];

export default function ShipmentToolbarController($scope,
                                                  navigationService,
                                                  shipmentService,
                                                  shipmentFlowService,
                                                  modalService,
                                                  enhancedInvoiceModel) {
    const vm = this;
    let modal = null;

    Object.assign(vm, {
        showSaveForLaterDialog,
        saveShipmentForLater,
        cancelEnhancedInvoiceChanges,

        shipmentName: null
    });

    function showSaveForLaterDialog() {
        modal = modalService.showDialog({
            templateUrl: 'shipment-save-for-later-modal-layout.html',
            scope: $scope
        });
    }

    function saveShipmentForLater() {
        shipmentFlowService.getStepsIncompleteData();
        shipmentService.saveShipmentForLater(vm.shipmentName)
            .then(() => {
                modal.close();
                navigationService.location('manage-shipments.html');
            })
            .catch((reason) => {
                vm.errors = reason.errors;
            });
    }

    function cancelEnhancedInvoiceChanges(shipmentCtrl) {
        enhancedInvoiceModel.resetModel();
        shipmentCtrl.triggerMainFlowVisibility();
    }
}
