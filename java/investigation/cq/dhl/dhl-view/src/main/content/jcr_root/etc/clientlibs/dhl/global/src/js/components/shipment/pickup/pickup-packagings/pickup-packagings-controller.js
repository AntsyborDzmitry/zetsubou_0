import './../../package-details/package-details-service';

PickupPackagingsCtrl.$inject = ['packageDetailsService'];

export default function PickupPackagingsCtrl(packageDetailsService) {
    const vm = this;

    const DEFAULT_PACKAGING_QUANTITY = 1;

    Object.assign(vm, {
        onShipperCountryUpdate,
        removePackaging,
        addPackaging,
        hasOnlyOnePackaging,
        getMaxQty,
        onPackagingTypeChange,

        packagings: null,
        packagingTypes: []
    });

    function onShipperCountryUpdate(shipperCountry) {
        loadPackagingTypes(shipperCountry);
    }

    function loadPackagingTypes(shipperCountry) {
        return packageDetailsService
            .getPackagingDetails('BOTH', shipperCountry, true)
            .then(onPackagingTypesLoad);
    }

    function onPackagingTypesLoad(packagingData) {
        vm.packagingTypes = packagingData.packagingList;
    }

    function removePackaging(packaging) {
        const hasPackaging = vm.packagings.includes(packaging);

        if (hasPackaging) {
            vm.packagings.splice(vm.packagings.indexOf(packaging), 1);
        }
    }

    function addPackaging() {
        vm.packagings.push({id: null, quantity: 1});
    }

    function hasOnlyOnePackaging() {
        return vm.packagings.length === 1;
    }

    function getMaxQty(packaging) {
        const packagingType = vm.packagingTypes.find((type) => type.id === packaging.id);

        return packagingType ? packagingType.maxQuantity : '';
    }

    function onPackagingTypeChange(packaging) {
        packaging.quantity = DEFAULT_PACKAGING_QUANTITY;
    }
}
