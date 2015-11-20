define(['exports', 'ewf', './nls-controller', './nls-bind-directive'], function (exports, _ewf, _nlsController, _nlsBindDirective) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _NLSController = _interopRequireDefault(_nlsController);

    _ewf2['default'].directive('nls', function () {
        return {
            restrict: 'A',
            controller: _NLSController['default'],
            link: {
                pre: preLink
            }
        };
    });

    function preLink(scope, element, attributes, controller) {
        function render(value) {
            var text = value.text;
            if (text) {
                element.text(text);
                delete value.text;
            }

            var keys = Object.keys(value);
            keys.forEach(function (key) {
                element.attr(key, value[key]);
            });
        }

        controller.setRenderFunction(render);

        controller.translate(attributes.nls);
    }
});
//# sourceMappingURL=nls-directive.js.map
