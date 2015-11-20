import './ewf-address-service';
import './../../services/location-service';
import './../../services/ewf-spinner-service';

EwfAddressController.$inject = [
    '$scope',
    '$attrs',
    'attrsService',
    'ewfAddressService',
    'locationService',
    'ewfSpinnerService'
];

export default function EwfAddressController(
    $scope,
    $attrs,
    attrsService,
    ewfAddressService,
    locationService,
    ewfSpinnerService) {

    const vm = this;

    Object.assign(vm, {
        init,
        getAddresses,
        getZipCodes,
        getCities,
        onCountrySelect,
        zipCodeOrCitySelected,
        addressSelected,
        nicknameGenerator,
        isResidentialFlagVisible,

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

    function init(settings = {}) {
        Object.assign(vm.attributes.settings, settings);

        attrsService.track($scope, $attrs, 'address', vm.attributes);
        getCountries();

        if (vm.attributes.settings.setResidentialFlagFromProfile) {
            getShipmentAddressDefaults();
        }
    }

    function getCountry() {
        const countryCodeField = (vm.attributes.address.addressDetails || $scope.address).countryCode;
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
        vm.attributes.address.nickname = (vm.attributes.address.name || '') +
                                                ' at ' + (vm.attributes.address.company || '');
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
        const promise = locationService.loadAvailableLocations()
            .then((data) => {
                vm.attributes.address = vm.attributes.address || {};
                vm.attributes.address.countries = data;
            })
            .finally(() => {
                if (vm.attributes.address.addressDetails.countryCode) {
                    vm.attributes.address.countries.forEach((singleCountry) => {
                        if (vm.attributes.address.addressDetails.countryCode === singleCountry.code2) {
                            vm.attributes.address.addressDetails.countryName = singleCountry.name;
                        }
                    });
                }
            });
        return ewfSpinnerService.applySpinner(promise);
    }

    function getShipmentAddressDefaults() {
        ewfAddressService.getShipmentAddressDefaults().then((defaults) => {
            vm.attributes.defaults = defaults;
        });
    }

    function isResidentialFlagVisible() {
        const {address, settings} = vm.attributes;
        return !settings.setResidentialFlagFromProfile || !!address.addressDetails.countryCode;
    }
}
