import ewf from 'ewf';
import ContactInfoController from './contact-info-controller';
import 'directives/ewf-address/ewf-address-cq-directive';
import 'directives/ewf-phone/ewf-phone-cq-directive';
import './contact-payment-info/contact-payment-info-directive';
import './contact-pickup-info/contact-pickup-info-directive';
import './re-apply-rules/re-apply-rules-directive';
import './contact-notifications-info/contact-notifications-info-directive';
import './contact-share-info/contact-share-info-directive';
import './contact-mailing-lists/contact-mailing-lists-directive';

ewf.directive('ewfContactInfo', ewfContactInfo);

function ewfContactInfo() {
    return {
        restrict: 'E',
        controller: ContactInfoController,
        controllerAs: 'contactInfoCtrl',
        required: 'ewfContactInfo'
    };
}
