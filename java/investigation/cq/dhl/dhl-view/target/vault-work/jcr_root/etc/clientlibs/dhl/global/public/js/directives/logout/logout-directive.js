define(['exports', 'module', 'ewf', './logout-controller'], function (exports, module, _ewf, _logoutController) {
    'use strict';

    module.exports = EwfLogout;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _LogoutController = _interopRequireDefault(_logoutController);

    _ewf2['default'].directive('ewfLogout', EwfLogout);

    function EwfLogout() {
        return {
            restrict: 'A',
            controller: _LogoutController['default'],
            controllerAs: 'logout',
            link: {
                post: function post($scope, elem, attr, logoutCtrl) {
                    elem.bind('click', logoutCtrl.onElementClick);
                }
            }
        };
    }
});
//# sourceMappingURL=logout-directive.js.map
