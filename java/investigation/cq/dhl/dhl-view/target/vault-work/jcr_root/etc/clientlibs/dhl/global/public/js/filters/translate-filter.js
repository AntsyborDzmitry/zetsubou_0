define(['exports', 'module', 'ewf', './../services/nls-service'], function (exports, module, _ewf, _servicesNlsService) {
    'use strict';

    module.exports = translate;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].filter('translate', translate);

    function translate(nlsService) {
        return function (fullKey) {
            return nlsService.translate(fullKey);
        };
    }
});
//# sourceMappingURL=translate-filter.js.map
