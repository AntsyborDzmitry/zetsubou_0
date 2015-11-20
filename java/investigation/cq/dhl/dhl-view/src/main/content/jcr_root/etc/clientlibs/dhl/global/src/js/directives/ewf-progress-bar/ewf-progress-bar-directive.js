import ewf from 'ewf';
import EwfProgressBarController from './ewf-progress-bar-controller';

ewf.directive('ewfProgressBar', EwfProgressBar);

export default function EwfProgressBar() {
    return {
        restrict: 'E',
        controller: EwfProgressBarController,
        controllerAs: 'progressBarCtrl',
        templateUrl: 'ewf-progress-bar-layout.html',
        scope: true
    };
}
