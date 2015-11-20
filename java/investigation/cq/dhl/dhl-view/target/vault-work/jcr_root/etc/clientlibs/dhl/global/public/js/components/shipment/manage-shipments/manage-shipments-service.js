define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ManageShipmentsService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('manageShipmentsService', ManageShipmentsService);

    ManageShipmentsService.$inject = ['$http', '$q', 'logService'];

    function ManageShipmentsService($http, $q, logService) {
        Object.assign(this, {
            getShipments: getShipments
        });

        function getShipments() {
            return $http.get('/api/shipment').then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error(response);
                return $q.reject(response);
            });
        }
    }
});
//# sourceMappingURL=manage-shipments-service.js.map
