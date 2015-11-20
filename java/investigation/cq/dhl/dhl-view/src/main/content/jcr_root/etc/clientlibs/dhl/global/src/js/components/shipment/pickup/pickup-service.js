import ewf from 'ewf';

ewf.service('pickupService', pickupService);

pickupService.$inject = ['$http', '$q', 'logService'];

export default function pickupService($http, $q, logService) {

    const publicApi = {
        getPickupLocations,
        getUserProfileDefaultValues,
        getBookingReferenceNumber,
        getLatestBooking
    };

    // TODO: change endpoint to actual one
    function getPickupLocations(shipmentCountry) {
        return $http.get(`/api/shipment/pickup/locations/list/${shipmentCountry}`)
            .then((response) => response.data)
            .catch((response) => {
                logService.log(`Pickup locations failed with ${response.data}`);
                // TODO: remove mock
                if (shipmentCountry === 'DE') {
                    return [
                        {name: 'FRONT DOOR'},
                        {name: 'RECEPTION'}
                    ];
                }
                return [
                    {name: 'FRONT DOOR'},
                    {name: 'BACK DOOR'},
                    {name: 'RECEPTION'},
                    {name: 'LOADING DOCK'}
                ];
            });
    }

    function getUserProfileDefaultValues() {
        return $http.get(`/api/myprofile/shipment/defaults/pickup`)
            .then((response) => response.data || $q.reject(response))
            .catch((response) => {
                logService.log(`Pickup default values failed with ${response.data}`);
                return $q.reject(response.data);
            });
    }

    function getBookingReferenceNumber(pickupDate, pickupAddress) {
        const data = {pickupDate, pickupAddress};
        return $http.post(`/api/shipment/pickup/search`, data)
            .then((response) => (response.data && response.data.length) ? response.data[0] : $q.reject(response))
            .catch((response) => {
                logService.log(`Booking Reference Number failed with ${response.data}`);
                return $q.reject(response.data);
            });
    }

    function getLatestBooking(product) {
        return product.pickupCutoffTime - product.bookingCutoffOffset;
    }

    return publicApi;
}
