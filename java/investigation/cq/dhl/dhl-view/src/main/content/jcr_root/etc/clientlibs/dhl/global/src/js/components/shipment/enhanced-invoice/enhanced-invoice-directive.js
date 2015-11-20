import ewf from 'ewf';
import EnhancedInvoiceController from './enhanced-invoice-controller';
import './enhanced-invoice-address-directive';
import './../../../directives/ewf-form/ewf-form-directive';
import './../../../directives/ewf-field/ewf-field-directive';
import './../../../directives/ewf-validate/ewf-validate-required-directive';

ewf.directive('ewfEnhancedInvoice', ewfEnhancedInvoice);

export default function ewfEnhancedInvoice() {

    return {
        restrict: 'E',
        controller: EnhancedInvoiceController,
        controllerAs: 'enhancedInvoiceCtrl',
        link: {
            pre: function(scope, element, attributes, enhancedInvoiceCtrl) {
                enhancedInvoiceCtrl.init();
            }
        }
    };
}
