define(['exports', 'ewf'], function (exports, _ewf) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('savingShipmentsService', savingShipmentsService);

    savingShipmentsService.$inject = ['$http', '$q', 'logService'];

    // TODO: add jsdoc
    function savingShipmentsService($http, $q, logService) {
        this.getMyDhlAccountsSavingShipments = getMyDhlAccountsSavingShipments;
        this.updateMyDhlAccountSavingShipments = updateMyDhlAccountSavingShipments;

        function getMyDhlAccountsSavingShipments() {
            return $http.get('/api/myprofile/shipment/defaults/savings').then(function (response) {
                // TODO: check 'data' validity
                return response.data;
            })['catch'](function (response) {
                var data = response.data;
                logService.error('LangSelector failed to get langs! ' + data);
                return $q.reject(data);
            });
        }

        function updateMyDhlAccountSavingShipments(accountsDefaults) {
            return $http.post('/api/myprofile/shipment/defaults/savings', accountsDefaults).then(function (response) {
                // TODO: check 'data' validity
                return response.data;
            })['catch'](function (response) {
                var data = response.data;
                logService.error('LangSelector failed to get langs! ' + data);
                return $q.reject(data);
            });
        }
    }
});
//# sourceMappingURL=saving-shipments-service.js.map
