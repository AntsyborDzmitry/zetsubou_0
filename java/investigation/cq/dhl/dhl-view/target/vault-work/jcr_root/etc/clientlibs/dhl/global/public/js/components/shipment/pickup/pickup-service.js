define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = pickupService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('pickupService', pickupService);

    pickupService.$inject = ['$http', '$q', 'logService'];

    function pickupService($http, $q, logService) {

        var publicApi = {
            getPickupLocations: getPickupLocations,
            getUserProfileDefaultValues: getUserProfileDefaultValues,
            getBookingReferenceNumber: getBookingReferenceNumber,
            getLatestBooking: getLatestBooking
        };

        // TODO: change endpoint to actual one
        function getPickupLocations(shipmentCountry) {
            return $http.get('/api/shipment/pickup/locations/list/' + shipmentCountry).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.log('Pickup locations failed with ' + response.data);
                // TODO: remove mock
                if (shipmentCountry === 'DE') {
                    return [{ name: 'FRONT DOOR' }, { name: 'RECEPTION' }];
                }
                return [{ name: 'FRONT DOOR' }, { name: 'BACK DOOR' }, { name: 'RECEPTION' }, { name: 'LOADING DOCK' }];
            });
        }

        function getUserProfileDefaultValues() {
            return $http.get('/api/myprofile/shipment/defaults/pickup').then(function (response) {
                return response.data || $q.reject(response);
            })['catch'](function (response) {
                logService.log('Pickup default values failed with ' + response.data);
                return $q.reject(response.data);
            });
        }

        function getBookingReferenceNumber(pickupDate, pickupAddress) {
            var data = { pickupDate: pickupDate, pickupAddress: pickupAddress };
            return $http.post('/api/shipment/pickup/search', data).then(function (response) {
                return response.data && response.data.length ? response.data[0] : $q.reject(response);
            })['catch'](function (response) {
                logService.log('Booking Reference Number failed with ' + response.data);
                return $q.reject(response.data);
            });
        }

        function getLatestBooking(product) {
            return product.pickupCutoffTime - product.bookingCutoffOffset;
        }

        return publicApi;
    }
});
//# sourceMappingURL=pickup-service.js.map
