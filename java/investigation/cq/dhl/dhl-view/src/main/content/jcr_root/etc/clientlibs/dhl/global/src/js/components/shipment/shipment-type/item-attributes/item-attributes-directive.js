import ewf from 'ewf';
import ItemAttributesController from './item-attributes-controller';
import './../../../../directives/ewf-container/ewf-container-directive';
import './item-attributes-directive';

ewf.directive('itemAttributes', itemAttributes);

export default function itemAttributes() {
    let itemAttrCtrl, ewfContainerCtrl;

    function setGridCtrlLink() {
        const gridCtrl = ewfContainerCtrl.getRegisteredControllerInstance('grid');
        gridCtrl.ctrlToNotify = itemAttrCtrl;
        itemAttrCtrl.gridCtrl = gridCtrl;
    }

    return {
        restrict: 'E',
        controller: ItemAttributesController,
        controllerAs: 'itemAttrCtrl',
        templateUrl: 'item-attributes-layout.html',
        require: ['itemAttributes', '^ewfContainer'],
        link: {
            pre: function(scope, element, attributes, controllers) {
                [itemAttrCtrl, ewfContainerCtrl] = controllers;
                ewfContainerCtrl.registerControllerInstance('itemAttrCtrl', itemAttrCtrl);
                itemAttrCtrl.init();

                ewfContainerCtrl.registerCallback('grid', setGridCtrlLink);
            }
        }
    };
}
