import ewf from 'ewf';
import ShipmentInsuranceController from './shipment-insurance-controller';
import './../../../directives/ewf-form/ewf-form-directive';

ewf.directive('shipmentInsurance', shipmentInsurance);

export default function shipmentInsurance() {
    return {
        restrict: 'AE',
        controller: ShipmentInsuranceController,
        controllerAs: 'shipmentInsuranceCtrl',
        link: {
            pre: preLink
        }
    };

    function preLink(scope, elem, attrs, controller) {
        controller.preloadSectionFromUrl();
    }
}
