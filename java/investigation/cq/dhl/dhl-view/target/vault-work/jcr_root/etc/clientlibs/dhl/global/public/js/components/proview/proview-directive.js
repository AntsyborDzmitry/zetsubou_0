define(['exports', 'ewf', './proview-controller'], function (exports, _ewf, _proviewController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ProviewController = _interopRequireDefault(_proviewController);

    _ewf2['default'].directive('ewfProview', function () {
        return {
            restrict: 'E',
            controller: _ProviewController['default'],
            controllerAs: 'proviewController',
            template: '<div class=container><div class=area ng-if=proviewController.proviewAccessUrl><iframe class=external-system__frame ng-src={{proviewController.proviewAccessUrl}}>INSIDE FRAME</iframe></div><div class=area ng-if=!proviewController.proviewAccessUrl><span class=error>Proview access...</span></div></div>'
        };
    });
});
//# sourceMappingURL=proview-directive.js.map
