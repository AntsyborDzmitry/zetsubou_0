define(['exports', 'ewf', './form-poc-controller'], function (exports, _ewf, _formPocController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    //import './form/form-directive';
    //import './result/result-directive';
    //import './verification/email-verification-directive';
    //import 'directives/ewf-form/ewf-form-directive';

    var _FormPocController = _interopRequireDefault(_formPocController);

    _ewf2['default'].directive('ewfFormPoc', formPocDirective);

    function formPocDirective() {
        return {
            restrict: 'E',
            template: '<div><h1>Form Performance PoC - Directive</h1><div ng-if=!formPocCtrl.isConfig><h2>Loading...</h2></div><div ng-if=formPocCtrl.isConfig ng-include=\"\'form-poc-fields.html\'\"></div></div>',
            controller: _FormPocController['default'],
            controllerAs: 'formPocCtrl',
            link: function link(scope, elem, attrs, formPocCtrl) {
                formPocCtrl.fieldsToHide = attrs.hideAmount;
                formPocCtrl.initFormConfig();
            }
        };
    }
});
//# sourceMappingURL=form-poc-directive.js.map
