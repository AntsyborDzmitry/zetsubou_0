define(['exports', 'ewf', '../services/validation-config', '../services/validation-service'], function (exports, _ewf, _servicesValidationConfig, _servicesValidationService) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    /**
     * Validates password field
     */
    _ewf2['default'].directive('validatedPassword', ValidatedPassword);

    ValidatedPassword.$inject = ['validationConfig', 'validationService'];

    function ValidatedPassword(validationConfig, validationService) {
        return {
            restrict: 'A',
            require: ['ngModel', '^form'],
            link: {
                post: function post(scope, elm, attrs, ctrls) {
                    var _ctrls = _slicedToArray(ctrls, 2);

                    var ctrl = _ctrls[0];
                    var form = _ctrls[1];

                    var validationRules = ['required', 'formatted'];

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
                    scope.$on('ValidateForm', function () {
                        return ctrl.$setViewValue(elm[0].value);
                    });

                    elm.on('blur', function () {
                        return elm.addClass('ng-dirty ng-blur');
                    });
                }
            }
        };
    }
});
//# sourceMappingURL=validated-password-directive.js.map
