import ewf from 'ewf';
import LogoutController from './logout-controller';

ewf.directive('ewfLogout', EwfLogout);

export default function EwfLogout() {
    return {
        restrict: 'A',
        controller: LogoutController,
        controllerAs: 'logout',
        link: {
            post: function($scope, elem, attr, logoutCtrl) {
                elem.bind('click', logoutCtrl.onElementClick);
            }
        }
    };
}
