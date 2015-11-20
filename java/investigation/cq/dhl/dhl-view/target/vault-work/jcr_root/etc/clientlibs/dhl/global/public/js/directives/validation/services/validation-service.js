define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ValidationService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('validationService', ValidationService);

    ValidationService.inject = ['$http', 'logService'];

    /**
     * internal breaker is used to make sure if any validation fails - next validation will not be performed
     */

    function ValidationService($http, logService) {
        this.applyRulesValidators = applyRulesValidators;

        var breaker = {};
        var validators = {
            required: function requiredValidator(model) {
                return function (value) {
                    //if any validations were failed earlier, then we need to skip this one
                    if (value === breaker) {
                        //... and set validity to true to make sure only previously failed validation will be shown
                        model.$setValidity('required', true);

                        //... and also return breaker as we do not have possibility to interrupt queue.
                        return breaker;
                    }

                    var valid = !model.$isEmpty(value);

                    model.$setValidity('required', valid);

                    //returned breaker will notify next validators that this one were failed
                    return valid ? value : breaker;
                };
            },
            formatted: function formattedValidator(model) {
                return function (value) {
                    if (value === breaker) {
                        model.$setValidity('formatted', true);

                        return breaker;
                    }

                    var valid = isFormatValid(model, value);

                    model.$setValidity('formatted', valid);

                    return valid ? value : breaker;
                };
            },
            exist: function existValidator(model) {
                return function (value) {
                    if (value === breaker) {
                        model.$setValidity('exist', true);

                        return breaker;
                    }

                    $http.post('/api/user/validate/email', {
                        email: value
                    }).success(function (response) {
                        var valid = !response.exist;

                        model.$setValidity('exist', valid);

                        return value;
                    }).error(function (error) {
                        logService.error('There are some issues contacting server. ' + error);

                        model.$setValidity('exist', false);

                        return breaker;
                    });

                    return value;
                };
            },
            matches: function matchesValidator(model) {
                return function (value) {
                    if (value === breaker) {
                        model.$setValidity('matches', true);

                        return breaker;
                    }

                    var valid = value === '' ? true : value === model.matches.$viewValue;

                    model.$setValidity('matches', valid);

                    return valid ? value : breaker;
                };
            }
        };

        /**
         * Apply proper validation rules adding parsers
         * @param {Object} model Current directive model
         * @param {Array} rules Rules that model must be validated against
         */
        function applyRulesValidators(model, rules) {
            model.$parsers = rules.map(function (rule) {
                return validators[rule](model);
            }).concat(model.$parsers);
        }

        /**
         * Checks if value fits validation rules; first check light "max-length" rule, then check heavy "pattern" rule
         * @param {Object} model Current directive model
         * @param {String} value Entered value
         * @returns {Boolean} if value fits email regexp and max length
         */
        function isFormatValid(model, value) {
            return value.length <= model.maxLength && model.pattern.test(value);
        }
    }
});
//# sourceMappingURL=validation-service.js.map
