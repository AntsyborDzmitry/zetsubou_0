import ewf from 'ewf';
import EwfPhoneController from './ewf-phone-controller';

ewf.directive('ewfPhone', ewfPhone);

function ewfPhone() {
    return {
        restrict: 'E',
        controller: EwfPhoneController,
        controllerAs: 'phoneCtrl',
        scope: true,
        require: 'ewfPhone',
        //templateUrl: /* NO EMBED */'ewf-phone.html',
        link: function(scope, element, attrs, ctrl) {
            ctrl.form = attrs.form;
            ctrl.preId = attrs.preId;
        }
    };
}
