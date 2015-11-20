import ewf from 'ewf';
import CustomClearanceController from './payment-defaults-controller';
import './../../../directives/ewf-form/ewf-form-directive';

ewf.directive('CustomClearance', CustomClearance);

function CustomClearance() {
    return {
        restrict: 'AE',
        controller: CustomClearanceController,
        controllerAs: 'customClearanceController'
    };
}
