import ewf from 'ewf';
import ShipmentToolbarController from './shipment-toolbar-controller';

ewf.directive('ewfShipmentToolbar', ewfShipmentToolbar);

function ewfShipmentToolbar() {
    return {
        restrict: 'A',
        controller: ShipmentToolbarController,
        controllerAs: 'toolbarCtrl',
        templateUrl: 'shipment-toolbar-layout.html'
    };
}
