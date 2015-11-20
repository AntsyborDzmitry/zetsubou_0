define(['exports', 'module', 'ewf', './../../ewf-shipment-error-service', './../../../../services/config-service'], function (exports, module, _ewf, _ewfShipmentErrorService, _servicesConfigService) {
    'use strict';

    module.exports = ItarService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('itarService', ItarService);

    ItarService.$inject = ['$http', '$q', 'logService', 'configService', 'shipmentErrorService'];

    function ItarService($http, $q, logService, configService, shipmentErrorService) {
        var publicAPI = {
            getItarDetails: getItarDetails,
            getCriticalShipmentItem: getCriticalShipmentItem,
            getEnableItarValue: getEnableItarValue
        };

        function getItarDetails(destinationCountry) {
            return $http.get('/api/shipment/itar/details/' + destinationCountry).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('Critical shipment item price failed with ' + response.data);
                return shipmentErrorService.processErrorCode(response);
            });
        }

        function getCriticalShipmentItem(country) {
            return configService.getValue('Shipment Details.EEI.critical.shipment.item.value', country).then(function (criticalShipmentItem) {
                return criticalShipmentItem.data.value.replace(/\D+/g, '');
            });
        }

        function getEnableItarValue(country) {
            return configService.getBoolean('Shipment Details.EEI.enable.eei', country);
        }

        return publicAPI;
    }
});
//# sourceMappingURL=ewf-itar-service.js.map
