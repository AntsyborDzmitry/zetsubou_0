import ewf from 'ewf';
import EwfShipmentTypeController from './ewf-shipment-type-controller';
import './../../../directives/ewf-container/ewf-container-directive';
import './itar/ewf-itar-directive';
import './itar/eei/ewf-itar-eei-directive';

ewf.directive('ewfShipmentType', EwfShipmentType);

export default function EwfShipmentType() {
    let shipmentTypeCtrl, ewfContainerCtrl;

    function setItemAttrCtrlLink() {
        const itemAttrCtrl = ewfContainerCtrl.getRegisteredControllerInstance('itemAttrCtrl');
        shipmentTypeCtrl.itemAttrCtrl = itemAttrCtrl;
    }

    function setItarCtrlLink() {
        const itarCtrl = ewfContainerCtrl.getRegisteredControllerInstance('itarCtrl');
        shipmentTypeCtrl.itarCtrl = itarCtrl;
    }

    return {
        restrict: 'E',
        controller: EwfShipmentTypeController,
        controllerAs: 'shipmentTypeCtrl',
        require: ['^ewfShipment', 'ewfShipmentType', 'ewfContainer'],
        link: {
            pre: function($scope, element, attrs, controllers) {
                const shipmentCtrl = controllers[0];
                shipmentTypeCtrl = controllers[1];
                shipmentCtrl.addStep(shipmentTypeCtrl);
            },
            post: function postLink($scope, element, attrs, controllers) {
                shipmentTypeCtrl = controllers[1];
                ewfContainerCtrl = controllers[2];

                ewfContainerCtrl.registerCallback('itemAttrCtrl', setItemAttrCtrlLink);
                ewfContainerCtrl.registerCallback('itarCtrl', setItarCtrlLink);
            }
        }
    };
}
