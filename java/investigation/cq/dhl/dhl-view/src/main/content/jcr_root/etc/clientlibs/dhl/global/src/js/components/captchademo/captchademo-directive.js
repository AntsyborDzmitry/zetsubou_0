import ewf from 'ewf';
import CaptchademoController from './captchademo-controller';

ewf.directive('ewfCaptchademo', () => {
    return {
        restrict: 'E',
        controller: CaptchademoController,
        controllerAs: 'captchademo',
        templateUrl: 'captchademo-layout.html'
    };
});
