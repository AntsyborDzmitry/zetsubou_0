import ewf from 'ewf';
import EwfShipmentCostController from './ewf-shipment-cost-controller';

ewf.directive('ewfShipmentCost', EwfShipmentCost);

export default function EwfShipmentCost() {
    return {
        restrict: 'E',
        controller: EwfShipmentCostController,
        controllerAs: 'shipmentCostCtrl',
        require: ['^ewfShipment', 'ewfShipmentCost'],
        link: {
            pre: function($scope, element, attrs, controllers) {
                const [shipmentCtrl, costCtrl] = controllers;
                shipmentCtrl.addStep(costCtrl);
            }
        }
    };
}
