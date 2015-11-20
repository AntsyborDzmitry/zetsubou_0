import ewf from 'ewf';
import '../services/validation-config';
import '../services/validation-service';

/**
 * Validates email field
 */
ewf.directive('validatedEmail', function ValidatedEmail(validationConfig, validationService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: {
            post: (scope, element, attrs, ctrl) => {
                const validationRules = ['required', 'formatted'];

                ctrl.pattern = validationConfig.EMAIL_PATTERN;
                ctrl.maxLength = validationConfig.EMAIL_MAX_LENGTH;
                ctrl.errorsMessages = {
                    required: validationConfig.EMAIL_ADDRESS_INAPPROPRIATE_FORMAT,
                    formatted: validationConfig.EMAIL_ADDRESS_INAPPROPRIATE_FORMAT
                };

                if (attrs.validatedEmail === 'exist') {
                    validationRules.push('exist');

                    ctrl.errorsMessages.exist = validationConfig.EMAIL_EXIST;
                }

                validationService.applyRulesValidators(ctrl, validationRules);

                // trigger validation
                scope.$on('ValidateForm', () => ctrl.$setViewValue(element[0].value.trim()));

                element.on('blur', () => element.addClass('ng-dirty ng-blur'));
            }
        }
    };
});
