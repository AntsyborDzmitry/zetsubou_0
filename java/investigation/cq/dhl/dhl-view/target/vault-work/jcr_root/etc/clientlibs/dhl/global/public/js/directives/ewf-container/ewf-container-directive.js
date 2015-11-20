define(['exports', 'module', 'ewf', './ewf-container-controller'], function (exports, module, _ewf, _ewfContainerController) {
    'use strict';

    module.exports = ewfContainer;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfContainerController = _interopRequireDefault(_ewfContainerController);

    _ewf2['default'].directive('ewfContainer', ewfContainer);

    function ewfContainer() {
        return {
            restrict: 'A',
            controller: _EwfContainerController['default']
        };
    }
});
//# sourceMappingURL=ewf-container-directive.js.map
