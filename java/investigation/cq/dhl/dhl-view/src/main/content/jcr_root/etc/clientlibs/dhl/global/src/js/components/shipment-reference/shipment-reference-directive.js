import ewf from 'ewf';
import './../../directives/ewf-form/ewf-form-directive';
import ShipmentReferenceController from './shipment-reference-controller';

ewf.directive('shipmentReference', ShipmentReference);

export default function ShipmentReference() {
    return {
        restrict: 'E',
        controller: ShipmentReferenceController,
        controllerAs: 'shipmentReferenceCtrl',
        require: ['shipmentReference', 'ewfContainer'],
        link: {
            post: postLink
        }
    };

    function postLink(scope, elem, attrs, controllers) {
        const [shipmentReferenceCtrl, ewfContainerCtrl] = controllers;
        const gridCtrl = ewfContainerCtrl.getRegisteredControllerInstance('grid');
        gridCtrl.ctrlToNotify = shipmentReferenceCtrl;
        shipmentReferenceCtrl.gridCtrl = gridCtrl;
        shipmentReferenceCtrl.init();
    }
}
