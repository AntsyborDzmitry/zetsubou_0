define(['exports', 'module', './../../package-details/package-details-service'], function (exports, module, _packageDetailsPackageDetailsService) {
    'use strict';

    module.exports = PickupPackagingsCtrl;

    PickupPackagingsCtrl.$inject = ['packageDetailsService'];

    function PickupPackagingsCtrl(packageDetailsService) {
        var vm = this;

        var DEFAULT_PACKAGING_QUANTITY = 1;

        Object.assign(vm, {
            onShipperCountryUpdate: onShipperCountryUpdate,
            removePackaging: removePackaging,
            addPackaging: addPackaging,
            hasOnlyOnePackaging: hasOnlyOnePackaging,
            getMaxQty: getMaxQty,
            onPackagingTypeChange: onPackagingTypeChange,

            packagings: null,
            packagingTypes: []
        });

        function onShipperCountryUpdate(shipperCountry) {
            loadPackagingTypes(shipperCountry);
        }

        function loadPackagingTypes(shipperCountry) {
            return packageDetailsService.getPackagingDetails('BOTH', shipperCountry, true).then(onPackagingTypesLoad);
        }

        function onPackagingTypesLoad(packagingData) {
            vm.packagingTypes = packagingData.packagingList;
        }

        function removePackaging(packaging) {
            var hasPackaging = vm.packagings.includes(packaging);

            if (hasPackaging) {
                vm.packagings.splice(vm.packagings.indexOf(packaging), 1);
            }
        }

        function addPackaging() {
            vm.packagings.push({ id: null, quantity: 1 });
        }

        function hasOnlyOnePackaging() {
            return vm.packagings.length === 1;
        }

        function getMaxQty(packaging) {
            var packagingType = vm.packagingTypes.find(function (type) {
                return type.id === packaging.id;
            });

            return packagingType ? packagingType.maxQuantity : '';
        }

        function onPackagingTypeChange(packaging) {
            packaging.quantity = DEFAULT_PACKAGING_QUANTITY;
        }
    }
});
//# sourceMappingURL=pickup-packagings-controller.js.map
