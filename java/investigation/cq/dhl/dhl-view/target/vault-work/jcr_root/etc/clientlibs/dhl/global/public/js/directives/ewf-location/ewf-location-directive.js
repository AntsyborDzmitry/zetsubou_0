define(['exports', 'module', 'ewf', './ewf-location-controller'], function (exports, module, _ewf, _ewfLocationController) {
    'use strict';

    module.exports = EwfLocation;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfLocationController = _interopRequireDefault(_ewfLocationController);

    _ewf2['default'].directive('ewfLocation', EwfLocation);

    function EwfLocation() {
        return {
            restrict: 'EA',
            controller: _EwfLocationController['default'],
            controllerAs: 'locationCtrl'
        };
    }
});
//# sourceMappingURL=ewf-location-directive.js.map
