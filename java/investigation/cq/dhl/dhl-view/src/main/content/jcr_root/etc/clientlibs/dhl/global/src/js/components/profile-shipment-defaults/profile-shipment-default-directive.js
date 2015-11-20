import ewf from 'ewf';
import ProfileSettingsDefaultController from './profile-shipment-default-controller';


ewf.directive('ewfProfileShipmentDefault', ewfProfileShipmentDefault);

export default function ewfProfileShipmentDefault() {
    return {
        restrict: 'AE',
        controller: ProfileSettingsDefaultController,
        controllerAs: 'defaultShipmentController',
        link: {
            pre: preLink
        }
    };

    function preLink(scope, elem, attrs, controller) {
        controller.preloadTabFromUrl();
    }
}
