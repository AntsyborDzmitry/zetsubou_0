define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ColumnCustomizationService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('columnCustomizationService', ColumnCustomizationService);

    ColumnCustomizationService.$inject = ['$http', '$q', 'logService'];

    function ColumnCustomizationService($http, $q, logService) {
        return {
            getColumnsInfo: getColumnsInfo,
            updateColumnsInfo: updateColumnsInfo
        };

        function getColumnsInfo() {
            return $http.get('/api/addressbook/configure/columns').then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('can not get columns configuration');
                return $q.reject(response.data);
            });
        }

        function updateColumnsInfo(selectedColumns) {
            return $http.post('/api/addressbook/configure/columns', selectedColumns).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('columns configuration was not updated', response.data);
                return $q.reject(response.data);
            });
        }
    }
});
//# sourceMappingURL=column-customization-service.js.map
