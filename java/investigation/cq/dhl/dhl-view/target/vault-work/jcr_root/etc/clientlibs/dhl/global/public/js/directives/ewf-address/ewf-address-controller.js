define(['exports', 'module', './ewf-address-service', './../../services/location-service', './../../services/ewf-spinner-service'], function (exports, module, _ewfAddressService, _servicesLocationService, _servicesEwfSpinnerService) {
    'use strict';

    module.exports = EwfAddressController;

    EwfAddressController.$inject = ['$scope', '$attrs', 'attrsService', 'ewfAddressService', 'locationService', 'ewfSpinnerService'];

    function EwfAddressController($scope, $attrs, attrsService, ewfAddressService, locationService, ewfSpinnerService) {

        var vm = this;

        Object.assign(vm, {
            init: init,
            getAddresses: getAddresses,
            getZipCodes: getZipCodes,
            getCities: getCities,
            onCountrySelect: onCountrySelect,
            zipCodeOrCitySelected: zipCodeOrCitySelected,
            addressSelected: addressSelected,
            nicknameGenerator: nicknameGenerator,
            isResidentialFlagVisible: isResidentialFlagVisible,

            attributes: {
                defaults: {},
                settings: {}
            },
            //TODO remove it and use pattern service
            patterns: {
                email: '^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-zA-Z]{2,6}(?:\\.[a-zA-Z]{2})?)$',
                numeric: '^(\\s*|\\d+)$',
                alphaNumeric: '^[a-z\\d\\-_\\s]+$',
                numericSpecialChars: '^[0-9\\+]*$'
            }
        });

        function init() {
            var settings = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            Object.assign(vm.attributes.settings, settings);

            attrsService.track($scope, $attrs, 'address', vm.attributes);
            getCountries();

            if (vm.attributes.settings.setResidentialFlagFromProfile) {
                getShipmentAddressDefaults();
            }
        }

        function getCountry() {
            var countryCodeField = (vm.attributes.address.addressDetails || $scope.address).countryCode;
            return countryCodeField.value || countryCodeField;
        }

        function getAddresses(query) {
            return ewfAddressService.getAddresses(getCountry(), query);
        }

        function getZipCodes(query) {
            return ewfAddressService.addressSearchByZipCode(getCountry(), query);
        }

        function getCities(query) {
            return ewfAddressService.addressSearchByCity(getCountry(), query);
        }

        function addressSelected(item) {
            vm.attributes.address.addressDetails.addrLine1 = item.fullAddress;
            vm.attributes.address.addressDetails.city = item.data.city;
            vm.attributes.address.addressDetails.zipOrPostCode = item.data.zip;
            vm.attributes.address.addressDetails.stateOrProvince = item.data.district;
        }

        function nicknameGenerator() {
            vm.attributes.address.nickname = (vm.attributes.address.name || '') + ' at ' + (vm.attributes.address.company || '');
        }

        function zipCodeOrCitySelected(item) {
            vm.attributes.address.addressDetails.city = item.city;
            vm.attributes.address.addressDetails.stateOrProvince = item.stateName;
            vm.attributes.address.addressDetails.zipOrPostCode = item.postalCode;
        }

        function onCountrySelect(country, ewfFormCtrl) {
            countrySelected(country);
            ewfFormCtrl.reloadRules(country.code2);
        }

        function countrySelected(item) {
            Object.assign(vm.attributes.address.addressDetails, {
                countryCode: item.code2,
                countryName: item.name,
                residentialAddress: vm.attributes.defaults.residentialDefault
            });
        }

        //TODO: think about synch of this promise and one in the contact-info-controller.js#init
        function getCountries() {
            var promise = locationService.loadAvailableLocations().then(function (data) {
                vm.attributes.address = vm.attributes.address || {};
                vm.attributes.address.countries = data;
            })['finally'](function () {
                if (vm.attributes.address.addressDetails.countryCode) {
                    vm.attributes.address.countries.forEach(function (singleCountry) {
                        if (vm.attributes.address.addressDetails.countryCode === singleCountry.code2) {
                            vm.attributes.address.addressDetails.countryName = singleCountry.name;
                        }
                    });
                }
            });
            return ewfSpinnerService.applySpinner(promise);
        }

        function getShipmentAddressDefaults() {
            ewfAddressService.getShipmentAddressDefaults().then(function (defaults) {
                vm.attributes.defaults = defaults;
            });
        }

        function isResidentialFlagVisible() {
            var _vm$attributes = vm.attributes;
            var address = _vm$attributes.address;
            var settings = _vm$attributes.settings;

            return !settings.setResidentialFlagFromProfile || !!address.addressDetails.countryCode;
        }
    }
});
//# sourceMappingURL=ewf-address-controller.js.map
