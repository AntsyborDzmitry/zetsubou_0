import ewf from 'ewf';
import EwfContactPickupInfoController from './contact-pickup-info-controller';

ewf.directive('contactPickupInfo', contactPickupInfo);

function contactPickupInfo() {
    return {
        restrict: 'E',
        controller: EwfContactPickupInfoController,
        controllerAs: 'contactPickupInfoCtrl',
        scope: true,
        link: function(scope, element, attrs, ctrl) {
            ctrl.form = attrs.form;
        }
    };
}
