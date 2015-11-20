import ItemAttributesFormController from './item-attributes-form-controller';
import './../../../../filters/convert-uom-filter';
import './../../../../filters/calculate-total-filter';
import './../../../../directives/ewf-validate/ewf-validate-attribute-directive';
import ewf from 'ewf';

ewf.directive('itemAttributesForm', itemAttributesForm);

export default function itemAttributesForm() {
    return {
        restrict: 'EA',
        controller: ItemAttributesFormController,
        controllerAs: 'itemAttrFormCtrl',
        templateUrl: 'item-attributes-form-layout.html',
        require: ['itemAttributesForm', '?^itemAttributes'],
        link: {
            pre: function(scope, element, attributes, [itemAttrFormCtrl, itemAttrCtrl]) {
                itemAttrFormCtrl.init();
                if (itemAttrCtrl) {
                    itemAttrCtrl.itemAttrFormCtrl = itemAttrFormCtrl;
                }
            }
        }
    };
}
