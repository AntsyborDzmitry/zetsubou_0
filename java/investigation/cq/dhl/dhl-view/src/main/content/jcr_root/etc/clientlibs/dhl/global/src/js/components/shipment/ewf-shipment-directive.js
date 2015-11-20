import ewf from 'ewf';
import EwfShipmentController from './ewf-shipment-controller';

ewf.directive('ewfShipment', ewfShipment);

export default function ewfShipment() {
    return {
        restrict: 'E',
        controller: EwfShipmentController,
        controllerAs: 'shipmentCtrl',
        link: {
            post: function($scope, element, attrs, shipmentCtrl) {
                shipmentCtrl.init();
            }
        }
    };
}
