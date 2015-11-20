import ewf from 'ewf';

ewf.service('ewfAddressService', EwfAddressService);

EwfAddressService.$inject = ['$http', '$q', 'logService'];

export default function EwfAddressService($http, $q, logService) {
    function onError(reason) {
        logService.error(reason);
        return $q.reject(reason);
    }

    function uniqueFilterByKey(array, key) {
        return array.filter((item, id) => id === array.findIndex((el) => item[key] === el[key]));
    }

    function getAddresses(countryCode, query) {
        const regex = new RegExp(query, 'i');

        return $http.get(`/api/admr/address/${countryCode}/${query}`)
            .then((response) => {
                if (response.data.length === 0) {
                    return [];
                }

                const responseList = response.data
                    .filter((item) => regex.test(item.street)
                        || regex.test(item.city)
                        || regex.test(item.district))
                    .map((item) => ({
                        name: item.street,
                        fullAddress: `${item.street}, ${item.city}, ${item.district}`,
                        group: 'Search Addresses',
                        data: item
                    }));

                if (responseList.length) {
                    responseList[0].firstInGroup = true;
                }

                return responseList;
            })
            .catch(onError);
    }

    function addressSearchByZipCode(countryCode, zipCode) {
        return $http.get(`/api/addressbook/search?countryCode=${countryCode}&zipCode=${zipCode}`)
            .then((response) => uniqueFilterByKey(response.data, 'postalCode'))
            .catch(onError);
    }

    function addressSearchByCity(countryCode, city) {
        return $http.get(`/api/addressbook/search?countryCode=${countryCode}&city=${city}`)
            .then((response) => uniqueFilterByKey(response.data, 'city'))
            .catch(onError);
    }

    function getShipmentAddressDefaults() {
        return $http.get('/api/myprofile/shipment/defaults/address')
            .then((response) => response.data)
            .catch(onError);
    }

    return {
        getAddresses,
        addressSearchByZipCode,
        addressSearchByCity,
        getShipmentAddressDefaults
    };
}
