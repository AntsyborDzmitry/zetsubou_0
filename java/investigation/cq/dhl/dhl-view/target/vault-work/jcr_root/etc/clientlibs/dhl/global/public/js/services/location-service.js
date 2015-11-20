define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = LocationService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('locationService', LocationService);

    LocationService.$inject = ['$http', '$q', '$cookies', 'logService'];

    function LocationService($http, $q, $cookies, logService) {

        var publicAPI = {
            loadAvailableLocations: loadAvailableLocations,
            saveCountry: saveCountry,
            getStoredCountry: getStoredCountry
        };

        var availableLocations = [];

        function loadAvailableLocations() {
            if (availableLocations.length) {
                var deferred = $q.defer();
                deferred.resolve(availableLocations);
                return deferred.promise;
            }
            return $http.get('/api/location/list').then(function (response) {
                availableLocations = response.data.map(function (countryInfo) {
                    var countryName = countryInfo.name;
                    var countryNameFirstLetter = countryName.charAt(0).toUpperCase();
                    var countryNameLast = countryName.substr(1).toLowerCase();
                    countryInfo.capitalizedName = '' + countryNameFirstLetter + countryNameLast;
                    countryInfo.flag = 'flag_' + countryInfo.code2;
                    return countryInfo;
                });
                return availableLocations;
            })['catch'](function (response) {
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
});
//# sourceMappingURL=location-service.js.map
