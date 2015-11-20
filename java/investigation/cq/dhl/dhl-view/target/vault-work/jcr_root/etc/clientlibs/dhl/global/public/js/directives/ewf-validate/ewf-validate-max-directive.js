define(['exports', 'module', 'ewf', './../../validation/validators-factory'], function (exports, module, _ewf, _validationValidatorsFactory) {
    'use strict';

    module.exports = ewfValidateMax;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    ewfValidateMax.$inject = ['validatorsFactory'];
    _ewf2['default'].directive('ewfValidateMax', ewfValidateMax);

    function ewfValidateMax(validatorsFactory) {
        return {
            restrict: 'A',
            require: 'ewfInput',
            link: {
                pre: function pre(scope, element, attrs, inputCtrl) {
                    var validationMessage = attrs.ewfValidateMaxMessage || '';
                    var validator = validatorsFactory.createValidator('max', {
                        max: attrs.ewfValidateMax,
                        msg: validationMessage
                    });
                    inputCtrl.addValidator(validator);

                    attrs.$observe('ewfValidateMax', function (value) {
                        validator.setOptions({
                            max: value,
                            msg: validationMessage
                        });
                        inputCtrl.triggerValidation();
                    });
                }
            }
        };
    }
});
//# sourceMappingURL=ewf-validate-max-directive.js.map
