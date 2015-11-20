import ewf from 'ewf';
import PickupsController from './pickups-controller';
import ionrangeslider from 'ionrangeslider'; // eslint-disable-line
import './../../../directives/ewf-form/ewf-form-directive';

ewf.directive('pickupsDirective', pickupsDirective);

export default function pickupsDirective() {
    return {
        restrict: 'AE',
        controller: PickupsController,
        controllerAs: 'pickupsCtrl',
        link: {
            pre: preLink,
            post: postLink
        }
    };

    function preLink(scope, elem, attrs, controller) {
        controller.preloadSectionFromUrl();
    }

    function postLink(scope, element, attrs, ctrl) {
        ctrl.init().then(() => {
            element.find('#range-slider').ionRangeSlider(ctrl.rangeSliderOptions);
            element.find('.irs-from').attr('data-content', element.find('#earliest-pickup').text());
            element.find('.irs-to').attr('data-content', element.find('#latest-pickup').text());
        });

        element.find('button.btn').click(() => {
            ctrl.savePickupsSettings(ctrl.pickupSettings);
        });
    }
}
