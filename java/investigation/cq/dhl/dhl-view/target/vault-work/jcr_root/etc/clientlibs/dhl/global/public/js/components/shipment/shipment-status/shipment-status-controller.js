define(['exports', 'module', './../ewf-shipment-service', './../../../services/navigation-service'], function (exports, module, _ewfShipmentService, _servicesNavigationService) {
    'use strict';

    module.exports = ShipmentStatusController;

    ShipmentStatusController.$inject = ['navigationService', 'shipmentService'];

    function ShipmentStatusController(navigationService, shipmentService) {
        var vm = this;

        Object.assign(vm, {
            shipmentId: navigationService.getParamFromUrl('shipmentId'),
            checkoutId: navigationService.getParamFromUrl('hostedCheckoutId')
        });

        if (vm.shipmentId && vm.checkoutId) {
            getShipmentStatus();
        }

        function getShipmentStatus() {
            return shipmentService.completeShipmentPayment(vm.shipmentId, vm.checkoutId).then(function (status) {
                var page = status.success ? 'shipment-print' : 'shipment';
                var url = page + '.html?shipmentId=' + vm.shipmentId;

                navigationService.location(url);
            });
        }
    }
});
//# sourceMappingURL=shipment-status-controller.js.map
