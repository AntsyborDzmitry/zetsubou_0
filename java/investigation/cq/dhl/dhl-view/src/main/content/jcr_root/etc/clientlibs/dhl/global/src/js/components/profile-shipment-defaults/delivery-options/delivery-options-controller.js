import './delivery-options-service';
import './../../../services/navigation-service';

DeliveryOptionsController.$inject = ['deliveryOptionsService', 'navigationService'];

export default function DeliveryOptionsController(
    deliveryOptionsService,
    navigationService) {

    const vm = this;
    const deliveryOptionSection = 'deliveryOptions';
    let deliveryDefaults;

    Object.assign(vm, {
        selectedOption: {},
        editMode: false,
        options: {},
        saveDeliveryOptions,
        init,
        resetShipmentType,
        toggleEditMode,
        onCountrySelect,
        setShipperCountry,
        resetDefaults,
        isDocumentType,
        setDeliveryOption,
        setSelectedValue
    });

    function init() {
        const section = navigationService.getParamFromUrl('section');
        vm.editMode = section === deliveryOptionSection;
        deliveryOptionsService.getData()
            .then((optionsData) => {
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
        deliveryOptionsService.saveOptions(vm.options)
            .then((optionsData) => deliveryDefaults = angular.copy(optionsData))
            .finally(() => vm.editMode = false);
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
        const comparator = (country) => country.code2 === vm.options.shippingCountry;
        vm.shipperCountry = vm.countryList.find(comparator);
    }

    function setDeliveryOption() {
        const comparator = (deliveryOption) => deliveryOption.key === vm.options.selectedDeliveryOptionsKey;
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
