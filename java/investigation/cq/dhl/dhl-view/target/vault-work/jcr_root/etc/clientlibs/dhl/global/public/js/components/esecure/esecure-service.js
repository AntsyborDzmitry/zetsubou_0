define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = eSecureService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('eSecureService', eSecureService);

    eSecureService.$inject = ['$http', '$q', 'logService'];

    function eSecureService($http, $q, logService) {

        this.getToken = getToken;

        function getToken() {
            return $http.get('/api/auth/esecure').then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('Could not get esecure token');
                return $q.reject(response.data);
            });
        }
    }
});
//# sourceMappingURL=esecure-service.js.map
