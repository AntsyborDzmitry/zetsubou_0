define(['exports', 'ewf', '../services/validation-config', '../services/validation-service'], function (exports, _ewf, _servicesValidationConfig, _servicesValidationService) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    /**
     * Validates email field
     */
    _ewf2['default'].directive('validatedEmail', function ValidatedEmail(validationConfig, validationService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: {
                post: function post(scope, element, attrs, ctrl) {
                    var validationRules = ['required', 'formatted'];

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
                    scope.$on('ValidateForm', function () {
                        return ctrl.$setViewValue(element[0].value.trim());
                    });

                    element.on('blur', function () {
                        return element.addClass('ng-dirty ng-blur');
                    });
                }
            }
        };
    });
});
//# sourceMappingURL=validated-email-directive.js.map
