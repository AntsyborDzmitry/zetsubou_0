import ewf from 'ewf';
import EnhancedInvoiceAddressController from './enhanced-invoice-address-controller';
import './../../../directives/ewf-form/ewf-form-directive';
import './../../../directives/ewf-field/ewf-field-directive';
import './../../../directives/ewf-validate/ewf-validate-required-directive';

ewf.directive('ewfEnhancedInvoiceAddress', ewfEnhancedInvoiceAddress);

export default function ewfEnhancedInvoiceAddress() {

    return {
        restrict: 'A',
        controller: EnhancedInvoiceAddressController,
        controllerAs: 'enhancedInvoiceAddressCtrl',
        link: {
            pre: function(scope, element, attributes, enhancedInvoiceAddressCtrl) {
                enhancedInvoiceAddressCtrl.init();
            }
        }
    };
}
