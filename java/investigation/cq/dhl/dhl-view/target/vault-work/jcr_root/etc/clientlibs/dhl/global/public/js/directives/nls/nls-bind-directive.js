define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = nlsBind;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('nlsBind', nlsBind);

    function nlsBind() {
        return {
            restrict: 'A',
            require: 'nls',
            link: function link(scope, element, attrs, nlsCtrl) {
                attrs.$observe('nls', function (value) {
                    nlsCtrl.translate(value);
                });
            }
        };
    }
});
//# sourceMappingURL=nls-bind-directive.js.map
