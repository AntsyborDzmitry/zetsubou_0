import './../ewf-shipment-service';
import './../../../services/navigation-service';

ShipmentStatusController.$inject = ['navigationService', 'shipmentService'];

export default function ShipmentStatusController(navigationService, shipmentService) {
    const vm = this;

    Object.assign(vm, {
        shipmentId: navigationService.getParamFromUrl('shipmentId'),
        checkoutId: navigationService.getParamFromUrl('hostedCheckoutId')
    });

    if (vm.shipmentId && vm.checkoutId) {
        getShipmentStatus();
    }

    function getShipmentStatus() {
        return shipmentService
            .completeShipmentPayment(vm.shipmentId, vm.checkoutId)
            .then((status) => {
                const page = status.success ? 'shipment-print' : 'shipment';
                const url = `${page}.html?shipmentId=${vm.shipmentId}`;

                navigationService.location(url);
            });
    }
}
