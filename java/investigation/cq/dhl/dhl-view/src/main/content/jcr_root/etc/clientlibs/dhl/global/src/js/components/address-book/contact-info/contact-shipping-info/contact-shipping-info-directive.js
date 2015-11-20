import ewf from 'ewf';
import ContactShippingInfoController from './contact-shipping-info-controller';
import './../../../../directives/ewf-form/ewf-form-directive';

ewf.directive('contactShippingInfo', contactShippingInfo);

export default function contactShippingInfo() {
    return {
        restrict: 'E',
        controller: ContactShippingInfoController,
        controllerAs: 'contactShippingInfoCtrl',
        scope: true
    };
}
