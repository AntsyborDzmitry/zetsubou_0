define(['exports', 'module', 'ewf', './../ewf-shipment-error-service'], function (exports, module, _ewf, _ewfShipmentErrorService) {
    'use strict';

    module.exports = ShipmentTypeService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('shipmentTypeService', ShipmentTypeService);

    ShipmentTypeService.$inject = ['$http', '$q', 'logService', 'shipmentErrorService'];

    function ShipmentTypeService($http, $q, logService, shipmentErrorService) {
        var publicAPI = {
            getReferencesDetails: getReferencesDetails,
            getReferenceBehavior: getReferenceBehavior,
            getShipmentParameters: getShipmentParameters
        };

        function getReferencesDetails(fromContactId, toContactId) {
            return $http.get('/api/shipment/reference/details/' + fromContactId + '/' + toContactId).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('References list failed with ' + response.data);
                return shipmentErrorService.processErrorCode(response);
            });
        }

        function getReferenceBehavior(countryCode) {
            return $http.get('/api/shipment/reference/guest/behavior/' + countryCode).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('Reference behavior failed with ' + response.data);
                return shipmentErrorService.processErrorCode(response);
            });
        }

        function getShipmentParameters(fromCountry, toCountry) {
            return $http.get('/api/shipment/parameters/' + fromCountry + '/' + toCountry).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('response error ' + response);
                return $q.reject(response);
            });
        }

        return publicAPI;
    }
});
//# sourceMappingURL=shipment-type-service.js.map
