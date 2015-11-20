define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = wantToShareService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('wantToShareService', wantToShareService);

    wantToShareService.$inject = ['$http', '$q', 'logService'];

    function wantToShareService($http, $q, logService) {

        this.getShipmentShareDefaults = getShipmentShareDefaults;
        this.getShareFields = getShareFields;
        this.shareDetails = shareDetails;

        function getShipmentShareDefaults(shipmentId) {
            return $http.get('/api/shipment/' + shipmentId + '/share/settings').then(function (response) {
                return response.data;
            })['catch'](function (err) {
                logService.error(err);
                return err;
            });
        }

        function shareDetails(shipmentId, sharingInfo, sharingDefaults) {
            var shareObject = angular.copy(sharingInfo);
            shareObject.details = angular.copy(sharingDefaults);

            shareObject.toAddresses = sharingInfo.toAddresses.split(',').map(function (item) {
                return item.trim();
            });

            return $http.post('/api/shipment/' + shipmentId + '/share', shareObject).then(function (response) {
                return response.data;
            })['catch'](function (err) {
                logService.error(err);
                return err;
            });
        }

        function getShareFields(shipmentId) {
            return $http.get('/api/shipment/' + shipmentId + '/share/fields').then(function (response) {
                return response.data;
            })['catch'](function (err) {
                logService.error(err);
                return err;
            });
        }
    }
});
//# sourceMappingURL=want-to-share-service.js.map
