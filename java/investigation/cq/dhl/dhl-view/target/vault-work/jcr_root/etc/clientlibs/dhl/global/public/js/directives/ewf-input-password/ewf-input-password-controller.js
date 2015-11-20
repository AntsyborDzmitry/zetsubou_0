define(['exports', 'module', 'services/rule-service', './../validation/services/validation-service'], function (exports, module, _servicesRuleService, _validationServicesValidationService) {
    'use strict';

    module.exports = InputPasswordController;

    InputPasswordController.$inject = ['$scope', '$q', 'logService', 'ruleService', 'nlsService', 'validatorsFactory'];

    function InputPasswordController($scope, $q, logService, ruleService, nlsService, validatorsFactory) {
        var vm = this;
        var rules = {};
        // properties
        vm.validationErrorMessage = {};
        vm.validationIsVisible = false;

        vm.fieldName = null;
        vm.ngModelCtrl = null;
        vm.ewfFormCtrl = null;
        vm.validateFieldEx = validateFieldEx;

        //methods
        vm.init = init;
        vm.validateRule = validateRule;

        function init(fieldId, ngModelController) {
            vm.fieldId = fieldId;
            vm.fieldName = fieldId.split('.')[1];
            vm.ngModelController = ngModelController;

            initializeRules();
        }

        function initializeRules() {
            var formOptions = vm.ewfFormCtrl.options;
            var countryId = formOptions ? formOptions.countryId : null;

            // ruleService is async, but we get rule synchronously
            var formFields = ruleService.getFieldRules(vm.fieldId, countryId);
            if (formFields) {
                rules = formFields;
            }
        }

        /**
         * Validate an input field
         * @returns new model Value
         */
        function validateFieldEx() {
            if (!rules.validators) {
                return vm.ngModelController.$modelValue;
            }

            vm.validationErrorMessage[vm.fieldName] = {};
            var validationErrorMessages = vm.validationErrorMessage[vm.fieldName];
            var allRulesPassed = true;

            var validationErrorPromises = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = rules.validators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var rule = _step.value;

                    var functionName = rule.type;
                    var viewValue = vm.ngModelController.$viewValue;

                    var ruleValid = validateRule(viewValue, functionName, rule.params);
                    var resObject = {
                        translation: rule.msg,
                        functionName: functionName,
                        viewValue: viewValue || '',
                        validateParams: rule.params,
                        isRuleValid: ruleValid
                    };

                    if (!validationErrorMessages.hasOwnProperty(functionName)) {
                        validationErrorMessages[functionName] = [];
                    }

                    var ruleIndex = validationErrorMessages[functionName].push(resObject) - 1;
                    validationErrorPromises.push(populateValidationErrorObject(validationErrorMessages, functionName, ruleIndex));

                    if (!ruleValid && allRulesPassed) {
                        allRulesPassed = false;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            vm.ngModelController.$setValidity(vm.fieldName, allRulesPassed);
            $q.all(validationErrorPromises).then(broadcastValidationCompleteEvent, broadcastValidationCompleteEvent);

            return vm.ngModelController.$modelValue;
        }

        function broadcastValidationCompleteEvent() {
            $scope.$emit('ValidationComplete', vm.validationErrorMessage[vm.fieldName]);
        }

        function validateRule(viewValue, functionName, param) {
            var validateFunction = validatorsFactory.createValidator(functionName, param);
            var valid = true;
            if (validateFunction) {
                try {
                    valid = validateFunction.validate(viewValue, param);
                } catch (error) {
                    logService.error('During validation of field "' + vm.fieldName + '" validator ' + functionName + ' threw error' + error);
                }
            }

            return valid;
        }

        // TODO: Unite with rule approach ( after injecting errorDisplayService)
        function populateValidationErrorObject(validationErrorMessages, functionName, ruleIndex) {
            var validationItem = validationErrorMessages[functionName][ruleIndex];
            return nlsService.getTranslation(validationItem.translation).then(function (translation) {
                if (translation) {
                    validationItem.translation = translation;
                } else {
                    logService.error('There is no message for label: ' + validationItem.translation);
                }
            })['catch'](function (message) {
                logService.error('There is no message for label:' + validationItem.translation + ', because ' + message);
                return $q.reject();
            });
        }
    }
});
//# sourceMappingURL=ewf-input-password-controller.js.map
