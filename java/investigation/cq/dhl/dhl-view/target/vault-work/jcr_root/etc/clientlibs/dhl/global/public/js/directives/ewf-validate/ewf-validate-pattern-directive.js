define(['exports', 'module', 'ewf', './../../validation/validators-factory', './../../services/ewf-pattern-service'], function (exports, module, _ewf, _validationValidatorsFactory, _servicesEwfPatternService) {
    'use strict';

    module.exports = EwfValidatePattern;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('ewfValidatePattern', EwfValidatePattern);

    EwfValidatePattern.$inject = ['$parse', 'validatorsFactory', 'ewfPatternService'];

    function EwfValidatePattern($parse, validatorsFactory, ewfPatternService) {
        var defaultOptions = {
            inputAsVariable: false,
            patternModifier: false
        };

        var defaultMessage = '';

        return {
            restrict: 'A',
            require: 'ewfInput',
            link: {
                pre: function pre(scope, element, attrs, ewfInputController) {
                    var inputValidationOption = $parse(attrs.ewfValidatePatternOptions)();

                    var validationOptions = angular.extend({}, defaultOptions, inputValidationOption);

                    var patternKey = validationOptions.inputAsVariable ? $parse(attrs.ewfValidatePattern)() : attrs.ewfValidatePattern;

                    var validationPattern = ewfPatternService.getPattern(patternKey, validationOptions.patternModifier);

                    var validationMessage = attrs.ewfValidatePatternMessage || defaultMessage;

                    var validator = validatorsFactory.createValidator('pattern', {
                        value: validationPattern,
                        msg: validationMessage
                    });

                    ewfInputController.addValidator(validator);
                }
            }
        };
    }
});
//# sourceMappingURL=ewf-validate-pattern-directive.js.map
