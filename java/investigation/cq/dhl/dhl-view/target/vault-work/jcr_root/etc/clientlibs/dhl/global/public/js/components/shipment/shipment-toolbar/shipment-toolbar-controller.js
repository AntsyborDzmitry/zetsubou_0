define(['exports', 'module', './../../../services/modal/modal-service', './../ewf-shipment-service', './../ewf-shipment-flow-service', './../enhanced-invoice/enhanced-invoice-model'], function (exports, module, _servicesModalModalService, _ewfShipmentService, _ewfShipmentFlowService, _enhancedInvoiceEnhancedInvoiceModel) {
    'use strict';

    module.exports = ShipmentToolbarController;

    ShipmentToolbarController.$inject = ['$scope', 'navigationService', 'shipmentService', 'shipmentFlowService', 'modalService', 'enhancedInvoiceModel'];

    function ShipmentToolbarController($scope, navigationService, shipmentService, shipmentFlowService, modalService, enhancedInvoiceModel) {
        var vm = this;
        var modal = null;

        Object.assign(vm, {
            showSaveForLaterDialog: showSaveForLaterDialog,
            saveShipmentForLater: saveShipmentForLater,
            cancelEnhancedInvoiceChanges: cancelEnhancedInvoiceChanges,

            shipmentName: null
        });

        function showSaveForLaterDialog() {
            modal = modalService.showDialog({
                template: '<div ewf-modal title=\"Would you like to save this shipment?\"><div class=section__content><p>Naming your shipment is optional. If you do not name your shipment, a temporary ID will be assigned to it for you. This name will appear in your manage shipment section.</p><div class=\"row single-line\"><label>Save As:</label> <input type=text class=\"input input_width_half\" placeholder=RochesterUSA_LondonUK ng-model=toolbarCtrl.shipmentName><div class=msg-error ng-repeat=\"error in toolbarCtrl.errors\" nls={{error}}></div><button class=\"btn btn_success btn_regular\" ng-click=toolbarCtrl.saveShipmentForLater()>Save Name or Continue</button></div></div></div>',
                scope: $scope
            });
        }

        function saveShipmentForLater() {
            shipmentFlowService.getStepsIncompleteData();
            shipmentService.saveShipmentForLater(vm.shipmentName).then(function () {
                modal.close();
                navigationService.location('manage-shipments.html');
            })['catch'](function (reason) {
                vm.errors = reason.errors;
            });
        }

        function cancelEnhancedInvoiceChanges(shipmentCtrl) {
            enhancedInvoiceModel.resetModel();
            shipmentCtrl.triggerMainFlowVisibility();
        }
    }
});
//# sourceMappingURL=shipment-toolbar-controller.js.map
