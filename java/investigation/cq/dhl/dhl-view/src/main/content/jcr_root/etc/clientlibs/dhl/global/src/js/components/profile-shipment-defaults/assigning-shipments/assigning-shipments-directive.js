import ewf from 'ewf';
import AssigningShipmentsController from './assigning-shipments-controller';

ewf.directive('assigningShipments', AssigningShipments);

export default function AssigningShipments() {
    return {
        restrict: 'E',
        controller: AssigningShipmentsController,
        controllerAs: 'assigningShipmentsCtrl',
        link: {
            pre: preLink
        }
    };
}

function preLink(scope, element, attributes, assigningShipmentsCtrl) {
    assigningShipmentsCtrl.init();
}
