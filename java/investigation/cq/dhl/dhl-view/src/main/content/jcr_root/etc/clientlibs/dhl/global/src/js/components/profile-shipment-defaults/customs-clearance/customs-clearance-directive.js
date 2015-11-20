import ewf from 'ewf';
import CustomsClearanceController from './customs-clearance-controller';

ewf.directive('customsClearance', CustomsClearance);

export default function CustomsClearance() {
    return {
        restrict: 'AE',
        controller: CustomsClearanceController,
        controllerAs: 'customsClearanceCtrl',
        link: {
            post
        }
    };

    function post(scope, elem, attrs, controller) {
        controller.init();
    }
}
