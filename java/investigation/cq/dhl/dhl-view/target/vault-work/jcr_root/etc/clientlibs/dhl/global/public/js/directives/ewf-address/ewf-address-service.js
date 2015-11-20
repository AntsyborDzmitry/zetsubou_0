define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = EwfAddressService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('ewfAddressService', EwfAddressService);

    EwfAddressService.$inject = ['$http', '$q', 'logService'];

    function EwfAddressService($http, $q, logService) {
        function onError(reason) {
            logService.error(reason);
            return $q.reject(reason);
        }

        function uniqueFilterByKey(array, key) {
            return array.filter(function (item, id) {
                return id === array.findIndex(function (el) {
                    return item[key] === el[key];
                });
            });
        }

        function getAddresses(countryCode, query) {
            var regex = new RegExp(query, 'i');

            return $http.get('/api/admr/address/' + countryCode + '/' + query).then(function (response) {
                if (response.data.length === 0) {
                    return [];
                }

                var responseList = response.data.filter(function (item) {
                    return regex.test(item.street) || regex.test(item.city) || regex.test(item.district);
                }).map(function (item) {
                    return {
                        name: item.street,
                        fullAddress: item.street + ', ' + item.city + ', ' + item.district,
                        group: 'Search Addresses',
                        data: item
                    };
                });

                if (responseList.length) {
                    responseList[0].firstInGroup = true;
                }

                return responseList;
            })['catch'](onError);
        }

        function addressSearchByZipCode(countryCode, zipCode) {
            return $http.get('/api/addressbook/search?countryCode=' + countryCode + '&zipCode=' + zipCode).then(function (response) {
                return uniqueFilterByKey(response.data, 'postalCode');
            })['catch'](onError);
        }

        function addressSearchByCity(countryCode, city) {
            return $http.get('/api/addressbook/search?countryCode=' + countryCode + '&city=' + city).then(function (response) {
                return uniqueFilterByKey(response.data, 'city');
            })['catch'](onError);
        }

        function getShipmentAddressDefaults() {
            return $http.get('/api/myprofile/shipment/defaults/address').then(function (response) {
                return response.data;
            })['catch'](onError);
        }

        return {
            getAddresses: getAddresses,
            addressSearchByZipCode: addressSearchByZipCode,
            addressSearchByCity: addressSearchByCity,
            getShipmentAddressDefaults: getShipmentAddressDefaults
        };
    }
});
//# sourceMappingURL=ewf-address-service.js.map
