define(['exports', 'module', './../../services/location-service'], function (exports, module, _servicesLocationService) {
    'use strict';

    module.exports = EwfLocationController;

    EwfLocationController.$inject = ['locationService', 'navigationService'];

    function EwfLocationController(locationService, navigationService) {
        var vm = this;
        vm.logInAnotherCountry = logInAnotherCountry;

        locationService.loadAvailableLocations().then(function (locations) {
            vm.availableLocations = locations;
        });

        function logInAnotherCountry(countryCode) {
            navigationService.redirectToLoginWithCountryId(countryCode);
        }
    }
});
//# sourceMappingURL=ewf-location-controller.js.map
