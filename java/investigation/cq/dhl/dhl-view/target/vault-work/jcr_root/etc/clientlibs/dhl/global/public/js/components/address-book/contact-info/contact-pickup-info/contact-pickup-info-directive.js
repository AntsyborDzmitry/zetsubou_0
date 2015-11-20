define(['exports', 'ewf', './contact-pickup-info-controller'], function (exports, _ewf, _contactPickupInfoController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfContactPickupInfoController = _interopRequireDefault(_contactPickupInfoController);

    _ewf2['default'].directive('contactPickupInfo', contactPickupInfo);

    function contactPickupInfo() {
        return {
            restrict: 'E',
            controller: _EwfContactPickupInfoController['default'],
            controllerAs: 'contactPickupInfoCtrl',
            scope: true,
            link: function link(scope, element, attrs, ctrl) {
                ctrl.form = attrs.form;
            }
        };
    }
});
//# sourceMappingURL=contact-pickup-info-directive.js.map
