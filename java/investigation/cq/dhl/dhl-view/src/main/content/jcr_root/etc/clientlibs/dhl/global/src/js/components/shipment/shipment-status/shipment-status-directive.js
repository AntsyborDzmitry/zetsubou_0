import ewf from 'ewf';
import ShipmentStatusController from './shipment-status-controller';

ewf.directive('ewfShipmentStatus', ShipmentStatus);

export default function ShipmentStatus() {
    return {
        restrict: 'E',
        controller: ShipmentStatusController,
        controllerAs: 'shipmentStatusCtrl'
    };
}
