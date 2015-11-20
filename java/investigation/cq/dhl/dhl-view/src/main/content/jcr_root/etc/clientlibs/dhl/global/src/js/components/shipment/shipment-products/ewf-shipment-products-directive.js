import ewf from 'ewf';
import EwfShipmentProductsController from './ewf-shipment-products-controller';

ewf.directive('ewfShipmentProducts', EwfShipmentProducts);

export default function EwfShipmentProducts() {
    return {
        restrict: 'E',
        controller: EwfShipmentProductsController,
        controllerAs: 'shipmentProductsCtrl',
        require: ['^ewfShipment', 'ewfShipmentProducts'],
        link: {
            pre: function($scope, element, attrs, controllers) {
                const [shipmentCtrl, productsCtrl] = controllers;
                shipmentCtrl.addStep(productsCtrl);
            }
        }
    };
}
