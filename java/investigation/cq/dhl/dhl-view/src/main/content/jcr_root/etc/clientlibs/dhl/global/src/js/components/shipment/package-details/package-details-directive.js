import ewf from 'ewf';
import PackageDetailsController from './package-details-controller';
import '../../../directives/ewf-validate/ewf-validate-max-directive';
import './field-name-dynamic-directive';
import '../../../filters/calculate-total-filter';
import '../../../filters/convert-uom-filter';

ewf.directive('ewfPackageDetails', ewfPackageDetails);

export default function ewfPackageDetails() {
    return {
        restrict: 'E',
        controller: PackageDetailsController,
        controllerAs: 'packageDetailsCtrl',
        require: ['^ewfShipment', 'ewfPackageDetails'],
        link: {
            post: function($scope, elem, attrs, controllers) {
                const [shipmentCtrl, packageDetailsCtrl] = controllers;
                shipmentCtrl.addStep(packageDetailsCtrl);
            }
        }
    };
}
