define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = langselectorService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('langselectorService', langselectorService);

    langselectorService.$inject = ['$http', '$q', 'logService'];

    function langselectorService($http, $q, logService) {
        this.loadAvailableLanguages = loadAvailableLanguages;

        function loadAvailableLanguages(pagePath, countryCode) {
            var resultPagePath = pagePath;
            if (pagePath.includes('.html')) {
                resultPagePath = pagePath.substring(0, pagePath.indexOf('.html'));
            }

            return $http.get('/services/dhl/nls/pagelangs?pagepath=' + resultPagePath + '&country=' + countryCode)
            // TODO: check 'data' validity
            .then(function (response) {
                return response.data;
            })['catch'](function (response) {
                var data = response.data;
                logService.error('LangSelector failed to get langs! ' + data);
                return $q.reject(data);
            });
        }
    }
});
//# sourceMappingURL=langselector-service.js.map
