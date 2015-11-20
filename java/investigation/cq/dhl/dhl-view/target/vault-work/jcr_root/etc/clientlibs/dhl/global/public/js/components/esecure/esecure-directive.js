define(['exports', 'ewf', './esecure-controller'], function (exports, _ewf, _esecureController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ESecureController = _interopRequireDefault(_esecureController);

    _ewf2['default'].directive('ewfEsecure', function () {
        return {
            restrict: 'E',
            controller: _ESecureController['default'],
            controllerAs: 'eSecureController',
            template: '<div class=container><div class=area ng-if=eSecureController.eSecureToken><iframe class=external-system__frame ng-src={{eSecureController.eSecureToken}}>INSIDE FRAME</iframe></div></div>'
        };
    });
});
//# sourceMappingURL=esecure-directive.js.map
