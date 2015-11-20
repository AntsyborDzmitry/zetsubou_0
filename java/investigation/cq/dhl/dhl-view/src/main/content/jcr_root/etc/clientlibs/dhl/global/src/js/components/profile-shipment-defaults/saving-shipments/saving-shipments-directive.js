import ewf from 'ewf';
import SavingShipmentsController from './saving-shipments-controller';

ewf.directive('savingShipments', SavingShipments);

export default function SavingShipments() {
    return {
        restrict: 'AE',
        controller: SavingShipmentsController,
        controllerAs: 'savingShipmentsController',
        link: {
            pre: preLink
        }
    };

    function preLink($scope, elem, attrs, controller) {
        controller.preloadDefaultSavingShipment();
        controller.preloadSectionFromUrl();
    }
}
