import ewf from 'ewf';
import EwfPickupController from './ewf-pickup-controller';
import ionrangeslider from 'ionrangeslider'; // eslint-disable-line

ewf.directive('ewfPickup', EwfPickup);

export default function EwfPickup() {
    return {
        restrict: 'E',
        controller: EwfPickupController,
        controllerAs: 'pickupCtrl',
        require: ['^ewfShipment', 'ewfPickup'],
        link: {
            post: function($scope, element, attrs, controllers) {
                const [shipmentCtrl, pickupCtrl] = controllers;
                shipmentCtrl.addStep(pickupCtrl);

                pickupCtrl.setPickupWindowDisplayCallback((rangeSliderOptions) => {
                    element.find('#range-slider').ionRangeSlider(rangeSliderOptions);
                    element.find('.irs-from').attr('data-content', element.find('#earliest-pickup').text());
                    element.find('.irs-to').attr('data-content', element.find('#latest-pickup').text());
                });
            }
        }
    };
}
