import ewf from 'ewf';
import ReturnShipmentsController from './return-shipments-controller';
import './../../../directives/ewf-form/ewf-form-directive';

ewf.directive('returnShipments', returnShipments);

export default function returnShipments() {
    return {
        restrict: 'AE',
        controller: ReturnShipmentsController,
        controllerAs: 'returnShipmentsCtrl',
        link: {
            pre: preLink
        }
    };

    function preLink(scope, elem, attrs, controller) {
        controller.preloadSectionFromUrl();
    }
}
