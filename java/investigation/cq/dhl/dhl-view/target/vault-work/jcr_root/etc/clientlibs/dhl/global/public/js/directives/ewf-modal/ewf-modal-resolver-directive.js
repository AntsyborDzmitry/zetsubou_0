define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = EwfModalResolver;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('ewfModalResolver', EwfModalResolver);

    function EwfModalResolver() {
        return {
            restrict: 'EA',
            require: '^ewfModal',
            scope: {
                result: '=ewfModalResolver'
            },
            link: link
        };

        function link(scope, element, attrs, ewfModalCtrl) {
            element.click(function () {
                ewfModalCtrl.close(scope.result);
            });
        }
    }
});
//# sourceMappingURL=ewf-modal-resolver-directive.js.map
