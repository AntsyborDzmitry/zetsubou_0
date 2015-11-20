import ewf from 'ewf';
import './../../validation/validators-factory';
import './../../services/ewf-pattern-service';

ewf.directive('ewfValidatePattern', EwfValidatePattern);

EwfValidatePattern.$inject = ['$parse', 'validatorsFactory', 'ewfPatternService'];

export default function EwfValidatePattern($parse, validatorsFactory, ewfPatternService) {
    const defaultOptions = {
        inputAsVariable: false,
        patternModifier: false
    };

    const defaultMessage = '';

    return {
        restrict: 'A',
        require: 'ewfInput',
        link: {
            pre: function(scope, element, attrs, ewfInputController) {
                const inputValidationOption = $parse(attrs.ewfValidatePatternOptions)();

                const validationOptions = angular.extend({}, defaultOptions, inputValidationOption);

                const patternKey = validationOptions.inputAsVariable ?
                    $parse(attrs.ewfValidatePattern)() :
                    attrs.ewfValidatePattern;

                const validationPattern = ewfPatternService.getPattern(patternKey, validationOptions.patternModifier);

                const validationMessage = attrs.ewfValidatePatternMessage || defaultMessage;

                const validator = validatorsFactory.createValidator('pattern', {
                    value: validationPattern,
                    msg: validationMessage
                });

                ewfInputController.addValidator(validator);
            }
        }
    };
}
