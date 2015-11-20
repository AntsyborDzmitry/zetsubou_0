import ewf from 'ewf';
import EwfContactPaymentInfoController from './contact-payment-info-controller';

ewf.directive('contactPaymentInfo', contactPaymentInfo);

function contactPaymentInfo() {
    return {
        restrict: 'E',
        controller: EwfContactPaymentInfoController,
        controllerAs: 'contactPaymentInfoCtrl',
        scope: true,
        templateUrl: 'contact-payment-info-directive.html'
    };
}
