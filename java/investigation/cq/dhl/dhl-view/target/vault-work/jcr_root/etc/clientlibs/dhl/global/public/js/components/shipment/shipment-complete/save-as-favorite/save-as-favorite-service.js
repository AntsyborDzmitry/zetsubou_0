define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = SaveAsFavoriteService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('saveAsFavoriteService', SaveAsFavoriteService);

    SaveAsFavoriteService.$inject = ['$http', '$q', 'logService'];

    function SaveAsFavoriteService($http, $q, logService) {
        this.saveAsFavorite = saveAsFavorite;

        function saveAsFavorite(shipmentId, shipmentName) {
            return $http.put('/api/shipment/' + shipmentId + '/favorite', { shipmentName: shipmentName })['catch'](function (response) {
                logService.error(response);
                return $q.reject(response.data);
            });
        }
    }
});
//# sourceMappingURL=save-as-favorite-service.js.map
