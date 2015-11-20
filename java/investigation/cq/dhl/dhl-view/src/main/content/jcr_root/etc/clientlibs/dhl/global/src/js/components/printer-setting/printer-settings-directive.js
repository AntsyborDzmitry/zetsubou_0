import ewf from 'ewf';
import PrinterSettingsController from './printer-settings-controller';

ewf.directive('printerSettings', PrinterSettings);

export default function PrinterSettings() {
    return {
        restrict: 'AE',
        controller: PrinterSettingsController,
        controllerAs: 'printerSettingsCtrl',
        link: {
            pre: preLink
        }
    };

    function preLink(scope, elem, attrs, controller) {
        controller.preloadPrinterSettings();
    }
}
