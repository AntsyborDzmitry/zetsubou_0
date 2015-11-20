import ewf from 'ewf';

import '../services/validation-config';
import '../services/validation-service';

/**
 * Validates password field
 */
ewf.directive('validatedPassword', ValidatedPassword);

ValidatedPassword.$inject = ['validationConfig', 'validationService'];

function ValidatedPassword(validationConfig, validationService) {
    return {
        restrict: 'A',
        require: ['ngModel', '^form'],
        link: {
            post: (scope, elm, attrs, ctrls) => {
                const [ctrl, form] = ctrls;
                const validationRules = ['required', 'formatted'];

                ctrl.pattern = validationConfig.PASSWORD_PATTERN;
                ctrl.maxLength = validationConfig.PASSWORD_MAX_LENGTH;
                ctrl.errorsMessages = {
                    required: validationConfig.PASSWORD_REQUIRED_ERROR,
                    formatted: validationConfig.PASSWORD_INAPPROPRIATE_FORMAT
                };

                if (attrs.matches) {
                    validationRules.push('matches');

                    ctrl.matches = form[attrs.matches];
                    ctrl.errorsMessages.matches = 'registration.validation_password_match';
                }

                validationService.applyRulesValidators(ctrl, validationRules);

                // trigger validation
                scope.$on('ValidateForm', () => ctrl.$setViewValue(elm[0].value));

                elm.on('blur', () => elm.addClass('ng-dirty ng-blur'));
            }
        }
    };
}
