define(['exports', 'module', 'ewf', './paperless-customs-controller'], function (exports, module, _ewf, _paperlessCustomsController) {
    'use strict';

    module.exports = PaperlessCustoms;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _PaperlessCustomsController = _interopRequireDefault(_paperlessCustomsController);

    _ewf2['default'].directive('ewfPaperlessCustoms', PaperlessCustoms);

    function PaperlessCustoms() {
        return {
            restrict: 'AE',
            controller: _PaperlessCustomsController['default'],
            controllerAs: 'paperlessCustomsCtrl',
            link: {
                pre: preLink
            }
        };

        function preLink(scope, elem, attrs, controller) {
            controller.loadSettings();
        }
    }
});
//# sourceMappingURL=paperless-customs-directive.js.map
