import './../../services/location-service';

EwfLocationController.$inject = ['locationService', 'navigationService'];

export default function EwfLocationController(locationService, navigationService) {
    const vm = this;
    vm.logInAnotherCountry = logInAnotherCountry;

    locationService.loadAvailableLocations()
        .then((locations) => {
            vm.availableLocations = locations;
        });

    function logInAnotherCountry(countryCode) {
        navigationService.redirectToLoginWithCountryId(countryCode);
    }
}
