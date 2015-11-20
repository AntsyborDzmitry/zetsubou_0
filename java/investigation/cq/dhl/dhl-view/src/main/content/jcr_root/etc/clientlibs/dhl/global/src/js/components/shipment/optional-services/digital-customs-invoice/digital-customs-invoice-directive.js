import ewf from 'ewf';

import DigitalCustomsInvoiceController from './digital-customs-invoice-controller';

import './../../../../directives/ewf-modal/ewf-modal-directive';
import './../../../../directives/ewf-modal/ewf-modal-resolver-directive';
import './../../../../directives/ewf-file-uploader/ewf-file-uploader-directive';
import './../../../../directives/ewf-progress-bar/ewf-progress-bar-directive';

ewf.directive('digitalCustomsInvoice', DigitalCustomsInvoice);

export default function DigitalCustomsInvoice() {
    return {
        restrict: 'EA',
        templateUrl: './digital-customs-invoice-layout.html',
        controller: DigitalCustomsInvoiceController,
        controllerAs: 'dciCtrl',
        scope: {
            digitalCustomsInvoice: '=',
            ownCustomsInvoice: '=',
            countryCode: '='
        }
    };
}
