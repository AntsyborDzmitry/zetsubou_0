import ewf from 'ewf';
import DeliveryOptionsController from './delivery-options-controller';

ewf.directive('deliveryOptions', DeliveryOptions);

export default function DeliveryOptions() {
    return {
        restrict: 'AE',
        controller: DeliveryOptionsController,
        controllerAs: 'deliveryOptionsCtrl',
        link: {
            post
        }
    };

    function post($scope, elem, attrs, controller) {
        controller.init();
    }
}
