import './../../services/location-service';

LocationSelectorController.$inject = ['logService', 'navigationService', 'nlsService', 'locationService'];

/**
 * Location selector controller
 *
 * @param {logService} logService
 * @param {navigationService} navigationService
 * @param {nlsService} nlsService
 * @param {locationService} locationService
 */
export default function LocationSelectorController(logService, navigationService, nlsService, locationService) {
    const vm = this;
    //properties
    vm.rememberLocation = true;
    vm.availableLocations = [];
    vm.currentLocation = null;
    vm.error = null;
    // methods
    vm.saveLocation = saveLocation;

    const chooseLocationOption = vm.currentLocation = {};
    const nlsPromise = nlsService.getDictionary('selectlocation');

    locationService.loadAvailableLocations()
        .then(function(locations) {
            nlsPromise
                .then(function(dictionary) {
                    locations.forEach(function(location) {
                        let code = location.code3;
                        let text = dictionary[code];
                        if (text) {
                            location.name = text;
                        }
                    });
                    displayLocations(locations, dictionary.choose_a_location);
                })
                .catch(function(error) {
                    logService.warn('failed to get dictionary "select location": ' + error);
                    displayLocations(locations, 'Choose a location');
                });
        })
        .catch((error) => {
            logService.error('locationService ' + error);
            vm.error = 'Service is currently unavailable';
        });

    function displayLocations(locations, chooseLocationText) {
        chooseLocationOption.name = chooseLocationText;
        vm.availableLocations = locations;
        vm.availableLocations.unshift(chooseLocationOption);
        const storedCountry = locationService.getStoredCountry();
        if (storedCountry) {
            vm.currentLocation = locations.find((location) => location.code3 === storedCountry.code3);
        }
        vm.error = null;
    }

    function saveLocation() {
        let currentLocation = vm.currentLocation;
        if (currentLocation && currentLocation.code3) {
            if (vm.rememberLocation) {
                locationService.saveCountry(currentLocation);
            }
            navigationService.redirectToLoginWithCountryId(currentLocation.code3);
        }
    }
}
