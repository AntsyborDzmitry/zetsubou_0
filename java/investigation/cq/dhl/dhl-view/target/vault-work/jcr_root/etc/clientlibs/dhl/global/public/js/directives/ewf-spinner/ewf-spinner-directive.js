define(['exports', 'module', 'ewf', './ewf-spinner-controller'], function (exports, module, _ewf, _ewfSpinnerController) {
    'use strict';

    module.exports = EwfSpinner;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfSpinnerController = _interopRequireDefault(_ewfSpinnerController);

    _ewf2['default'].directive('ewfSpinner', EwfSpinner);

    function EwfSpinner() {
        return {
            restrict: 'A',
            controller: _EwfSpinnerController['default'],
            controllerAs: 'ewfSpinnerCtrl'
        };
    }
});
//# sourceMappingURL=ewf-spinner-directive.js.map
