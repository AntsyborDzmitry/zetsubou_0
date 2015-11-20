import ewf from 'ewf';
import AddressDetailsController from './address-details-controller';
import './../../../directives/validation/validated-email/validated-email-directive';
import './../../../directives/ewf-form/ewf-form-directive';
import './../../../components/address-book/contact-info/re-apply-rules/re-apply-rules-directive';

ewf.directive('ewfAddressDetails', ewfAddressDetails);

export default function ewfAddressDetails() {
    return {
        restrict: 'E',
        controller: AddressDetailsController,
        controllerAs: 'addressDetailsCtrl',
        require: ['^ewfShipment', 'ewfAddressDetails'],
        link: {
            post: function($scope, elem, attrs, controllers) {
                const [shipmentCtrl, addressDetailsCtrl] = controllers;
                shipmentCtrl.addStep(addressDetailsCtrl);
            }
        }
    };
}
