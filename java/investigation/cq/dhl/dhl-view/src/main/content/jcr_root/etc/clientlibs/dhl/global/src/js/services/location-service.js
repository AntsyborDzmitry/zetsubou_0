import ewf from 'ewf';

ewf.service('locationService', LocationService);

LocationService.$inject = ['$http', '$q', '$cookies', 'logService'];

export default function LocationService($http, $q, $cookies, logService) {

    const publicAPI = {
        loadAvailableLocations,
        saveCountry,
        getStoredCountry
    };

    let availableLocations = [];

    function loadAvailableLocations() {
        if (availableLocations.length) {
            const deferred = $q.defer();
            deferred.resolve(availableLocations);
            return deferred.promise;
        }
        return $http.get('/api/location/list')
            .then((response) => {
                availableLocations = response.data.map((countryInfo) => {
                    const countryName = countryInfo.name;
                    const countryNameFirstLetter = countryName.charAt(0).toUpperCase();
                    const countryNameLast = countryName.substr(1).toLowerCase();
                    countryInfo.capitalizedName = `${countryNameFirstLetter}${countryNameLast}`;
                    countryInfo.flag = `flag_${countryInfo.code2}`;
                    return countryInfo;
                });
                return availableLocations;
            })
            .catch((response) => {
                logService.error('location-selector failed to get locations!');
                return $q.reject(response.data);
            });
    }

    function saveCountry(country) {
        if (country.code3) {
            // TODO: add expiration date
            $cookies.defaultCountry = country.code3;
        }
    }

    function getStoredCountry() {
        return $cookies.defaultCountry;
    }

    return publicAPI;
}
