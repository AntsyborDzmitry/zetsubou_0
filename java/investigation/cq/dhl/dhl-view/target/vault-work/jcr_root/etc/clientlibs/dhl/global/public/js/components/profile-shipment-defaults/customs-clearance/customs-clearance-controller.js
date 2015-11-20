define(['exports', 'module', './../../../services/ewf-crud-service', './../../../services/navigation-service'], function (exports, module, _servicesEwfCrudService, _servicesNavigationService) {
    'use strict';

    module.exports = CustomsClearanceController;

    CustomsClearanceController.$inject = ['ewfCrudService', 'navigationService'];

    function CustomsClearanceController(ewfCrudService, navigationService) {

        var vm = this;
        var customsClearanceUrl = '/api/myprofile/shipment/defaults/customs/clearance';
        var customClearanceSection = 'customsClearance';
        var customClearanceDefault = undefined;

        Object.assign(vm, {
            editMode: false,
            selectedShipmentPurpose: {},
            selectedIncoterm: {},
            init: init,
            getCustomsClearance: getCustomsClearance,
            updateCustomsClearance: updateCustomsClearance,
            resetToDefault: resetToDefault,
            resetInvoiceType: resetInvoiceType,
            toggleEditMode: toggleEditMode,
            setSelectedValues: setSelectedValues,
            getSelectedShipmentPurpose: getSelectedShipmentPurpose,
            getSelectedIncoterm: getSelectedIncoterm
        });

        function init() {
            var section = navigationService.getParamFromUrl('section');
            vm.editMode = section === customClearanceSection;
            vm.getCustomsClearance().then(function (customClearanceOptions) {
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
            vm.customsClearance.selectedShipmentPurpose = vm.selectedShipmentPurpose ? vm.selectedShipmentPurpose.key : '';
            vm.customsClearance.selectedIncoterm = vm.selectedIncoterm ? vm.selectedIncoterm.key : '';

            ewfCrudService.updateElement(customsClearanceUrl, vm.customsClearance).then(function () {
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
            var comparator = function comparator(purpose) {
                return purpose.key === vm.customsClearance.selectedShipmentPurpose;
            };
            return vm.customsClearance.shipmentPurposes.find(comparator);
        }

        function getSelectedIncoterm() {
            var comparator = function comparator(incoterm) {
                return incoterm.key === vm.customsClearance.selectedIncoterm;
            };
            return vm.customsClearance.incoterms.find(comparator);
        }
    }
});
//# sourceMappingURL=customs-clearance-controller.js.map
