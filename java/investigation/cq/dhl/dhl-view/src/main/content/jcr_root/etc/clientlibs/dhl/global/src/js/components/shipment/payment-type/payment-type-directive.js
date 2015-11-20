import ewf from 'ewf';

import PaymentTypeController from './payment-type-controller';

ewf.directive('ewfPaymentType', EwfPaymentType);

export default function EwfPaymentType() {
    return {
        restrict: 'E',
        controller: PaymentTypeController,
        controllerAs: 'paymentTypeCtrl',
        require: ['^ewfShipment', 'ewfPaymentType'],
        link: {
            post: function($scope, elem, attrs, controllers) {
                const [shipmentCtrl, paymentTypeCtrl] = controllers;
                shipmentCtrl.addStep(paymentTypeCtrl);
            }
        }
    };
}

