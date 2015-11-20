define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = proviewService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('proviewService', proviewService);

    proviewService.$inject = ['$http', '$q', 'logService'];

    function proviewService($http, $q, logService) {

        this.getUrl = getUrl;

        function getUrl() {
            return $http.get('/api/auth/proview').then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('Could not get proview access URL');
                return $q.reject(response.data);
            });
        }
    }
});
//# sourceMappingURL=proview-service.js.map
