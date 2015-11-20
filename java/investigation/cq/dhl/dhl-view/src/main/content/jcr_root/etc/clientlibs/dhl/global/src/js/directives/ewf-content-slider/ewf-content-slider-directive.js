import ewf from 'ewf';
import './ewf-content-slider-item-directive';
import EwfContentSliderController from './ewf-content-slider-controller';

ewf.directive('ewfContentSlider', ewfContentSlider);

export default function ewfContentSlider() {
    return {
        restrict: 'E',
        controllerAs: 'contentSlider',
        controller: EwfContentSliderController,
        transclude: true,
        templateUrl: './ewf-content-slider-layout.html',
        scope: {
            isShowing: '=showWhen'
        }
    };
}
