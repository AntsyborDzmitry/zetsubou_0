define(['exports', 'module', 'ewf', './enhanced-invoice-address-controller', './../../../directives/ewf-form/ewf-form-directive', './../../../directives/ewf-field/ewf-field-directive', './../../../directives/ewf-validate/ewf-validate-required-directive'], function (exports, module, _ewf, _enhancedInvoiceAddressController, _directivesEwfFormEwfFormDirective, _directivesEwfFieldEwfFieldDirective, _directivesEwfValidateEwfValidateRequiredDirective) {
    'use strict';

    module.exports = ewfEnhancedInvoiceAddress;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EnhancedInvoiceAddressController = _interopRequireDefault(_enhancedInvoiceAddressController);

    _ewf2['default'].directive('ewfEnhancedInvoiceAddress', ewfEnhancedInvoiceAddress);

    function ewfEnhancedInvoiceAddress() {

        return {
            restrict: 'A',
            controller: _EnhancedInvoiceAddressController['default'],
            controllerAs: 'enhancedInvoiceAddressCtrl',
            link: {
                pre: function pre(scope, element, attributes, enhancedInvoiceAddressCtrl) {
                    enhancedInvoiceAddressCtrl.init();
                }
            }
        };
    }
});
//# sourceMappingURL=enhanced-invoice-address-directive.js.map
