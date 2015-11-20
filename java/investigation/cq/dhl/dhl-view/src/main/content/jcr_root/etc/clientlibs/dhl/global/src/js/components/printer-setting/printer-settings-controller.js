
import './printer-settings-directive';
import './printer-settings-service';

PrinterSettingsController.$inject = ['$scope', '$q', '$timeout', 'printerSettingsService'];

export default function PrinterSettingsController($scope, $q, $timeout, printerSettingsService) {
    const vm = this;

    //TODO take these from the server (see available.printer.types setting)
    const printerTypes = [
        {key: 'laser', name: 'Laser Printer'},
        {key: 'LPL', name: 'Thermal LPL printer'},
        {key: 'ZPL', name: 'Thermal ZPL printer'},
        {key: 'inkJet', name: 'Ink Jet Printer'}
    ];

    //properties
    vm.printerTypes = printerTypes;
    vm.defautPrinterSettings = {
        printerType: '',
        printReceipt: false,
        automaticallyPrint: false
    };
    vm.alertTypes = {
        updated: false
    };
    vm.printerType = vm.defautPrinterSettings.printerType;
    vm.printReceipt = vm.defautPrinterSettings.printReceipt;
    vm.automaticallyPrint = vm.defautPrinterSettings.automaticallyPrint;

    //methods
    vm.preloadPrinterSettings = preloadPrinterSettings;
    vm.updatePrinterSettings = updatePrinterSettings;
    vm.resetValuesToDefault = resetValuesToDefault;

    function preloadPrinterSettings() {
        printerSettingsService.getPrinterSettings().then((response) => {
            setDefaultPrinterSettingFromResponse(response);

            vm.printerType = response.printerType !== null ? getPrinterTypeByKey(response.printerType) : '';
            vm.printReceipt = response.printReceipt;
            vm.automaticallyPrint = response.automaticallyPrint;
        });
    }

    function updatePrinterSettings() {
        const printerType = vm.printerType ? vm.printerType.key : '';
        const printerObject = createPrinterSettingObject(printerType, vm.printReceipt, vm.automaticallyPrint);

        const printerSettingsPromise = printerSettingsService.updatePrinterSettings(printerObject);
        printerSettingsPromise
            .then((response) => {
                setDefaultPrinterSettingFromResponse(response);

                vm.errorMessages = [];
                toggleNotificationAlert('updated');
            });
    }

    function resetValuesToDefault() {
        vm.printerType = vm.defautPrinterSettings.printerType;
        vm.printReceipt = vm.defautPrinterSettings.printReceipt;
        vm.automaticallyPrint = vm.defautPrinterSettings.automaticallyPrint;
        vm.updated = false;
    }

    function createPrinterSettingObject(printerType, printReceipt, automaticallyPrint) {
        return {
            printerType,
            printReceipt,
            automaticallyPrint
        };
    }

    function setDefaultPrinterSettingFromResponse(response) {
        vm.defautPrinterSettings.printerType = response.printerType !== null
            ? getPrinterTypeByKey(response.printerType)
            : '';
        vm.defautPrinterSettings.printReceipt = response.printReceipt;
        vm.defautPrinterSettings.automaticallyPrint = response.automaticallyPrint;
    }

    function getPrinterTypeByKey(key) {
        return vm.printerTypes.find((printerType) => printerType.key === key);
    }

    /*TODO change temporary solution for toggle notification alert*/
    function toggleNotificationAlert(action) {
        vm.alertTypes[action] = true;
        $timeout(() => {
            vm.alertTypes[action] = false;
        }, 4000);
    }
}
