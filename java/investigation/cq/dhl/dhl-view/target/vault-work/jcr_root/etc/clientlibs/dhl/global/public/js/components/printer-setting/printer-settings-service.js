define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = printerSettingsService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('printerSettingsService', printerSettingsService);

    printerSettingsService.$inject = ['$http', '$q', 'logService'];

    // TODO: add jsdoc

    function printerSettingsService($http, $q, logService) {
        this.getPrinterSettings = getPrinterSettings;
        this.updatePrinterSettings = updatePrinterSettings;

        function getPrinterSettings() {
            return $http.get('/api/myprofile/shipment/settings/printer').then(function (response) {
                // TODO: check 'data' validity
                return response.data;
            })['catch'](function (response) {
                var data = response.data;
                logService.error('Failed to load printer settings ' + data);
                return $q.reject(data);
            });
        }

        function updatePrinterSettings(printerObject) {
            return $http.post('/api/myprofile/shipment/settings/printer', printerObject).then(function (response) {
                // TODO: check 'data' validity
                return response.data;
            })['catch'](function (response) {
                var data = response.data;
                logService.error('Error to update printer settings ' + data);
                return $q.reject(data);
            });
        }
    }
});
//# sourceMappingURL=printer-settings-service.js.map
