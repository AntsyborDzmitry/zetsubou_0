define(['exports', 'module', 'ewf', './../../validation/validators-factory'], function (exports, module, _ewf, _validationValidatorsFactory) {
    'use strict';

    module.exports = ewfValidateEquality;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    ewfValidateEquality.$inject = ['validatorsFactory'];
    _ewf2['default'].directive('ewfValidateEquality', ewfValidateEquality);

    function ewfValidateEquality(validatorsFactory) {
        return {
            restrict: 'A',
            require: 'ewfInput',
            scope: {
                valueToEqual: '=ewfValidateEquality',
                msg: '@ewfValidateEqualityMessage'
            },
            link: {
                pre: function pre(scope, element, attrs, ctrl) {
                    var inputCtrl = ctrl;
                    scope.element = element;
                    inputCtrl.addValidator(validatorsFactory.createValidator('equality', scope));
                }
            }
        };
    }
});
//# sourceMappingURL=ewf-validate-equality-directive.js.map
