import ewf from 'ewf';
import ManageShipmentsController from './manage-shipments-controller';

ewf.directive('ewfManageShipments', ewfManageShipments);

function ewfManageShipments() {
    return {
        restrict: 'E',
        controller: ManageShipmentsController,
        controllerAs: 'manageShipmentsCtrl'
    };
}
