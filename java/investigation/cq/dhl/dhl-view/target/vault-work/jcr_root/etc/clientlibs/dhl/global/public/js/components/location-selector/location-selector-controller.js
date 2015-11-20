define(['exports', 'module', './../../services/location-service'], function (exports, module, _servicesLocationService) {
    'use strict';

    module.exports = LocationSelectorController;

    LocationSelectorController.$inject = ['logService', 'navigationService', 'nlsService', 'locationService'];

    /**
     * Location selector controller
     *
     * @param {logService} logService
     * @param {navigationService} navigationService
     * @param {nlsService} nlsService
     * @param {locationService} locationService
     */

    function LocationSelectorController(logService, navigationService, nlsService, locationService) {
        var vm = this;
        //properties
        vm.rememberLocation = true;
        vm.availableLocations = [];
        vm.currentLocation = null;
        vm.error = null;
        // methods
        vm.saveLocation = saveLocation;

        var chooseLocationOption = vm.currentLocation = {};
        var nlsPromise = nlsService.getDictionary('selectlocation');

        locationService.loadAvailableLocations().then(function (locations) {
            nlsPromise.then(function (dictionary) {
                locations.forEach(function (location) {
                    var code = location.code3;
                    var text = dictionary[code];
                    if (text) {
                        location.name = text;
                    }
                });
                displayLocations(locations, dictionary.choose_a_location);
            })['catch'](function (error) {
                logService.warn('failed to get dictionary "select location": ' + error);
                displayLocations(locations, 'Choose a location');
            });
        })['catch'](function (error) {
            logService.error('locationService ' + error);
            vm.error = 'Service is currently unavailable';
        });

        function displayLocations(locations, chooseLocationText) {
            chooseLocationOption.name = chooseLocationText;
            vm.availableLocations = locations;
            vm.availableLocations.unshift(chooseLocationOption);
            var storedCountry = locationService.getStoredCountry();
            if (storedCountry) {
                vm.currentLocation = locations.find(function (location) {
                    return location.code3 === storedCountry.code3;
                });
            }
            vm.error = null;
        }

        function saveLocation() {
            var currentLocation = vm.currentLocation;
            if (currentLocation && currentLocation.code3) {
                if (vm.rememberLocation) {
                    locationService.saveCountry(currentLocation);
                }
                navigationService.redirectToLoginWithCountryId(currentLocation.code3);
            }
        }
    }
});
//# sourceMappingURL=location-selector-controller.js.map
