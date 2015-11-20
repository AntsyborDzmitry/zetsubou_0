define(['exports', 'module', './delivery-options-service', './../../../services/navigation-service'], function (exports, module, _deliveryOptionsService, _servicesNavigationService) {
    'use strict';

    module.exports = DeliveryOptionsController;

    DeliveryOptionsController.$inject = ['deliveryOptionsService', 'navigationService'];

    function DeliveryOptionsController(deliveryOptionsService, navigationService) {

        var vm = this;
        var deliveryOptionSection = 'deliveryOptions';
        var deliveryDefaults = undefined;

        Object.assign(vm, {
            selectedOption: {},
            editMode: false,
            options: {},
            saveDeliveryOptions: saveDeliveryOptions,
            init: init,
            resetShipmentType: resetShipmentType,
            toggleEditMode: toggleEditMode,
            onCountrySelect: onCountrySelect,
            setShipperCountry: setShipperCountry,
            resetDefaults: resetDefaults,
            isDocumentType: isDocumentType,
            setDeliveryOption: setDeliveryOption,
            setSelectedValue: setSelectedValue
        });

        function init() {
            var section = navigationService.getParamFromUrl('section');
            vm.editMode = section === deliveryOptionSection;
            deliveryOptionsService.getData().then(function (optionsData) {
                Object.assign(vm, optionsData);
                vm.connected = true;
                deliveryDefaults = angular.copy(optionsData);
                vm.setSelectedValue();
            });
        }

        function saveDeliveryOptions() {
            if (vm.shipperCountry === '') {
                vm.options.shippingCountry = '';
            }

            vm.options.selectedDeliveryOptionsKey = vm.selectedOption && vm.selectedOption.key || '';
            deliveryOptionsService.saveOptions(vm.options).then(function (optionsData) {
                return deliveryDefaults = angular.copy(optionsData);
            })['finally'](function () {
                return vm.editMode = false;
            });
        }

        function resetShipmentType() {
            vm.options.shipmentType = 'NONE';
        }

        function toggleEditMode() {
            vm.editMode = !vm.editMode;
        }

        function onCountrySelect(country) {
            vm.options.shippingCountry = country.code2;
        }

        function setShipperCountry() {
            var comparator = function comparator(country) {
                return country.code2 === vm.options.shippingCountry;
            };
            vm.shipperCountry = vm.countryList.find(comparator);
        }

        function setDeliveryOption() {
            var comparator = function comparator(deliveryOption) {
                return deliveryOption.key === vm.options.selectedDeliveryOptionsKey;
            };
            vm.selectedOption = vm.options.deliveryOptions.find(comparator);
        }

        function resetDefaults() {
            vm.editMode = false;
            Object.assign(vm, angular.copy(deliveryDefaults));
            vm.setSelectedValue();
        }

        function isDocumentType() {
            return vm.options.shipmentType === 'DOCUMENT';
        }

        function setSelectedValue() {
            vm.setShipperCountry();
            vm.setDeliveryOption();
        }
    }
});
//# sourceMappingURL=delivery-options-controller.js.map
