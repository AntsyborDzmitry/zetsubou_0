import ewf from 'ewf';
import EwfOptionalServicesController from './ewf-optional-services-controller';
import './digital-customs-invoice/digital-customs-invoice-directive';

ewf.directive('ewfOptionalServices', EwfOptionalServices);

export default function EwfOptionalServices() {
    return {
        restrict: 'E',
        controller: EwfOptionalServicesController,
        controllerAs: 'servicesCtrl',
        require: ['^ewfShipment', 'ewfOptionalServices'],
        link: {
            pre: function($scope, element, attrs, controllers) {
                const [shipmentCtrl, servicesCtrl] = controllers;
                shipmentCtrl.addStep(servicesCtrl);
            }
        }
    };
}
