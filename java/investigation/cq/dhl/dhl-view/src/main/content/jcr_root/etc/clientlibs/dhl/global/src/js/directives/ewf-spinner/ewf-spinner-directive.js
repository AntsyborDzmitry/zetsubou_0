import ewf from 'ewf';
import EwfSpinnerController from './ewf-spinner-controller';

ewf.directive('ewfSpinner', EwfSpinner);

export default function EwfSpinner() {
    return {
        restrict: 'A',
        controller: EwfSpinnerController,
        controllerAs: 'ewfSpinnerCtrl'
    };
}
