define(['exports', 'module', 'ewf', './enhanced-invoice-controller', './enhanced-invoice-address-directive', './../../../directives/ewf-form/ewf-form-directive', './../../../directives/ewf-field/ewf-field-directive', './../../../directives/ewf-validate/ewf-validate-required-directive'], function (exports, module, _ewf, _enhancedInvoiceController, _enhancedInvoiceAddressDirective, _directivesEwfFormEwfFormDirective, _directivesEwfFieldEwfFieldDirective, _directivesEwfValidateEwfValidateRequiredDirective) {
    'use strict';

    module.exports = ewfEnhancedInvoice;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EnhancedInvoiceController = _interopRequireDefault(_enhancedInvoiceController);

    _ewf2['default'].directive('ewfEnhancedInvoice', ewfEnhancedInvoice);

    function ewfEnhancedInvoice() {

        return {
            restrict: 'E',
            controller: _EnhancedInvoiceController['default'],
            controllerAs: 'enhancedInvoiceCtrl',
            link: {
                pre: function pre(scope, element, attributes, enhancedInvoiceCtrl) {
                    enhancedInvoiceCtrl.init();
                }
            }
        };
    }
});
//# sourceMappingURL=enhanced-invoice-directive.js.map
