import ewf from 'ewf';
import EwfContactNotificationsInfoController from './contact-notifications-info-controller';
import 'directives/ewf-content-slider/ewf-content-slider-directive';

ewf.directive('contactNotificationsInfo', contactNotificationsInfo);

export default function contactNotificationsInfo() {
    return {
        restrict: 'E',
        controller: EwfContactNotificationsInfoController,
        controllerAs: 'contactNotificationsInfoCtrl',
        scope: true,
        link: {
            post: function(scope, element, attrs, ctrl) {
                ctrl.init();
                if (!ctrl.attributes.notificationSettings.length) {
                    ctrl.attributes.notificationSettings = [];
                    ctrl.addRepeaterItem();
                }
            }
        }
    };
}
