define(['exports', 'module', 'ewf', './ewfc-value-controller'], function (exports, module, _ewf, _ewfcValueController) {
    'use strict';

    module.exports = ewfcValue;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfcValueController = _interopRequireDefault(_ewfcValueController);

    _ewf2['default'].directive('ewfcValue', ewfcValue);

    function ewfcValue() {
        return {
            restrict: 'A',
            controller: _EwfcValueController['default'],
            link: {
                pre: preLink
            }
        };
    }

    function preLink(scope, element, attributes, controller) {
        function render(ciValue) {
            var text = ciValue.data.value;
            if (text) {
                element.text(text);
            }
        }

        controller.setRenderFunction(render);

        controller.setValue(attributes.ewfcValue);
    }
});
//# sourceMappingURL=ewfc-value-directive.js.map
