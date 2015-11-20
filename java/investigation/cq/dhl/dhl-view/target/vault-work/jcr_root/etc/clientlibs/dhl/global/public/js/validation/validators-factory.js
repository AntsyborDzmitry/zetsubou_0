define(['exports', 'module', './validators/external-validator', './validators/length-validator', './validators/max-validator', './validators/pattern-validator', './validators/required-validator', './validators/email-validator', './validators/equality-validator', 'ewf'], function (exports, module, _validatorsExternalValidator, _validatorsLengthValidator, _validatorsMaxValidator, _validatorsPatternValidator, _validatorsRequiredValidator, _validatorsEmailValidator, _validatorsEqualityValidator, _ewf) {
    'use strict';

    module.exports = ValidatorsFactory;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ExternalValidator = _interopRequireDefault(_validatorsExternalValidator);

    var _LengthValidator = _interopRequireDefault(_validatorsLengthValidator);

    var _MaxValidator = _interopRequireDefault(_validatorsMaxValidator);

    var _PatternValidator = _interopRequireDefault(_validatorsPatternValidator);

    var _RequiredValidator = _interopRequireDefault(_validatorsRequiredValidator);

    var _EmailValidator = _interopRequireDefault(_validatorsEmailValidator);

    var _EqualityValidator = _interopRequireDefault(_validatorsEqualityValidator);

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('validatorsFactory', ValidatorsFactory);

    function ValidatorsFactory() {
        var validatorsMapping = {
            required: _RequiredValidator['default'],
            length: _LengthValidator['default'],
            pattern: _PatternValidator['default'],
            //TODO: rename this parameters and remove rule disabling
            'account_numbers_required': _RequiredValidator['default'], //eslint-disable-line quote-props
            'account_numbers_pattern': _PatternValidator['default'], //eslint-disable-line quote-props
            password: _PatternValidator['default'],
            max: _MaxValidator['default'],
            attribute: _ExternalValidator['default'],
            email: _EmailValidator['default'],
            equality: _EqualityValidator['default']
        };

        this.createValidator = function (type, options) {
            var Validator = validatorsMapping[type];

            if (Validator) {
                return new Validator(options);
            }

            return null;
        };
    }
});
//# sourceMappingURL=validators-factory.js.map
