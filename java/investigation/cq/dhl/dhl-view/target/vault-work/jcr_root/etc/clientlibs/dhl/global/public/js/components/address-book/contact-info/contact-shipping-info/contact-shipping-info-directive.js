define(['exports', 'module', 'ewf', './contact-shipping-info-controller', './../../../../directives/ewf-form/ewf-form-directive'], function (exports, module, _ewf, _contactShippingInfoController, _directivesEwfFormEwfFormDirective) {
    'use strict';

    module.exports = contactShippingInfo;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ContactShippingInfoController = _interopRequireDefault(_contactShippingInfoController);

    _ewf2['default'].directive('contactShippingInfo', contactShippingInfo);

    function contactShippingInfo() {
        return {
            restrict: 'E',
            controller: _ContactShippingInfoController['default'],
            controllerAs: 'contactShippingInfoCtrl',
            scope: true
        };
    }
});
//# sourceMappingURL=contact-shipping-info-directive.js.map
