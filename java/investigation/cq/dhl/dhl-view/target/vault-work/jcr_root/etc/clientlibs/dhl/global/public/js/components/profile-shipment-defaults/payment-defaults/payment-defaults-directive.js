define(['exports', 'ewf', './payment-defaults-controller', './../../../directives/ewf-form/ewf-form-directive'], function (exports, _ewf, _paymentDefaultsController, _directivesEwfFormEwfFormDirective) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _CustomClearanceController = _interopRequireDefault(_paymentDefaultsController);

    _ewf2['default'].directive('CustomClearance', CustomClearance);

    function CustomClearance() {
        return {
            restrict: 'AE',
            controller: _CustomClearanceController['default'],
            controllerAs: 'customClearanceController'
        };
    }
});
//# sourceMappingURL=payment-defaults-directive.js.map
