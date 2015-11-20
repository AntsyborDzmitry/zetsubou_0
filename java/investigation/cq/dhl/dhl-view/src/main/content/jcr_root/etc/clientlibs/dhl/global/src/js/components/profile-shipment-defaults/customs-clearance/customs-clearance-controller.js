import './../../../services/ewf-crud-service';
import './../../../services/navigation-service';

CustomsClearanceController.$inject = ['ewfCrudService', 'navigationService'];

export default function CustomsClearanceController(
    ewfCrudService,
    navigationService) {

    const vm = this;
    const customsClearanceUrl = '/api/myprofile/shipment/defaults/customs/clearance';
    const customClearanceSection = 'customsClearance';
    let customClearanceDefault;

    Object.assign(vm, {
        editMode: false,
        selectedShipmentPurpose: {},
        selectedIncoterm: {},
        init,
        getCustomsClearance,
        updateCustomsClearance,
        resetToDefault,
        resetInvoiceType,
        toggleEditMode,
        setSelectedValues,
        getSelectedShipmentPurpose,
        getSelectedIncoterm
    });

    function init() {
        const section = navigationService.getParamFromUrl('section');
        vm.editMode = section === customClearanceSection;
        vm.getCustomsClearance()
            .then((customClearanceOptions) => {
                customClearanceDefault = angular.copy(customClearanceOptions);
                vm.customsClearance = customClearanceOptions;
                vm.customsClearance.shipmentValue = vm.customsClearance.shipmentValue || '0.00';
                vm.setSelectedValues();
            });
    }

    function getCustomsClearance() {
        return ewfCrudService.getElementList(customsClearanceUrl);
    }

    function updateCustomsClearance() {
        vm.customsClearance.selectedShipmentPurpose = vm.selectedShipmentPurpose
            ? vm.selectedShipmentPurpose.key
            : '';
        vm.customsClearance.selectedIncoterm = vm.selectedIncoterm
            ? vm.selectedIncoterm.key
            : '';

        ewfCrudService.updateElement(customsClearanceUrl, vm.customsClearance)
            .then(() => {
                customClearanceDefault = angular.copy(vm.customsClearance);
                vm.editMode = false;
            });
    }

    function resetToDefault() {
        Object.assign(vm, {
            customsClearance: angular.copy(customClearanceDefault),
            editMode: false
        });
        vm.setSelectedValues();
    }

    function resetInvoiceType() {
        vm.customsClearance.invoiceType = 'NONE';
    }

    function toggleEditMode() {
        vm.editMode = !vm.editMode;
    }

    function setSelectedValues() {
        Object.assign(vm, {
            selectedShipmentPurpose: vm.getSelectedShipmentPurpose(),
            selectedIncoterm: vm.getSelectedIncoterm()
        });
    }

    function getSelectedShipmentPurpose() {
        const comparator = (purpose) => purpose.key === vm.customsClearance.selectedShipmentPurpose;
        return vm.customsClearance.shipmentPurposes.find(comparator);
    }

    function getSelectedIncoterm() {
        const comparator = (incoterm) => incoterm.key === vm.customsClearance.selectedIncoterm;
        return vm.customsClearance.incoterms.find(comparator);
    }
}
