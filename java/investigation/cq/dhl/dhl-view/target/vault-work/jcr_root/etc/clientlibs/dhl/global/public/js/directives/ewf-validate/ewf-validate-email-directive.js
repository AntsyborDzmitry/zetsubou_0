define(['exports', 'module', 'ewf', './../../validation/validators-factory'], function (exports, module, _ewf, _validationValidatorsFactory) {
    'use strict';

    module.exports = ewfValidateEmail;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    ewfValidateEmail.$inject = ['validatorsFactory'];
    _ewf2['default'].directive('ewfValidateEmail', ewfValidateEmail);

    var optionalEmailRegExp = '^(([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-zA-Z]{2,6}(?:\\.[a-zA-Z]{2})?))?$';

    function ewfValidateEmail(validatorsFactory) {
        return {
            restrict: 'A',
            require: 'ewfInput',
            link: {
                pre: function pre(scope, element, attrs, inputCtrl) {
                    var validationMessage = attrs.ewfValidateEmailMessage || '';

                    inputCtrl.addValidator(validatorsFactory.createValidator('email', {
                        value: optionalEmailRegExp,
                        msg: validationMessage
                    }));
                }
            }
        };
    }
});
//# sourceMappingURL=ewf-validate-email-directive.js.map
