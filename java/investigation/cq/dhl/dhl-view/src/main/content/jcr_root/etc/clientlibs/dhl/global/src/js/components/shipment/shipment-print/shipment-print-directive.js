import ewf from 'ewf';
import ShipmentPrintController from './shipment-print-controller';
import './../../../directives/ewf-pdf/ewf-pdf-directive';
import './../../../directives/ewf-validate/ewf-validate-pattern-directive';
import './../../../directives/ewf-input/ewf-input-directive';
import './../../../directives/ewf-form/ewf-form-directive';

ewf.directive('ewfShipmentPrint', ewfShipmentPrint);

function ewfShipmentPrint() {
    return {
        restrict: 'E',
        controller: ShipmentPrintController,
        controllerAs: 'printCtrl',
        templateUrl: 'shipment-print-layout.html'
    };
}
