import ewf from 'ewf';
import ShipmentCompleteController from './shipment-complete-controller';
import './want-to-share/want-to-share-directive';

ewf.directive('ewfShipmentComplete', ewfShipmentComplete);

function ewfShipmentComplete() {
    return {
        restrict: 'E',
        controller: ShipmentCompleteController,
        controllerAs: 'completeCtrl',
        templateUrl: 'shipment-complete-layout.html'
    };
}
