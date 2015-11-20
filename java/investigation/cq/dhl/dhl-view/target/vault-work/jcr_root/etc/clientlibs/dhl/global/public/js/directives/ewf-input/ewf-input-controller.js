define(['exports', 'module', 'services/rule-service', './../../validation/validators-factory', 'services/log-service', './../../services/nls-service'], function (exports, module, _servicesRuleService, _validationValidatorsFactory, _servicesLogService, _servicesNlsService) {
    'use strict';

    module.exports = InputController;

    /* @todo: START - Code to eliminate after refactoring  */

    var PROPS = {
        defaultValue: function defaultValue(value, attrs, ngModelController) {
            ngModelController.$setViewValue(value);
            ngModelController.$render();
        },

        //TODO: implement
        options: function options() /*params, attrs*/{},

        // TODO: Implement
        hint: function hint() /*value, fieldName*/{}
    };

    /* @todo: END - Code to eliminate after refactoring  */

    InputController.$inject = ['$scope', '$q', 'logService', 'ruleService', 'nlsService', 'validatorsFactory'];

    function InputController($scope, $q, logService, ruleService, nlsService, validatorsFactory) {
        var vm = this;

        var rules = {};
        var elementDefer = $q.defer();

        Object.assign(vm, {
            init: init,
            applyRules: applyRules,
            setupValidation: setupValidation,
            validationCallback: validationCallback,
            addValidator: addValidator,
            validate: validate,
            addErrorMessage: addErrorMessage,
            cleanErrorMessages: cleanErrorMessages,
            removeSpecificErrorMessage: removeSpecificErrorMessage,
            initializeRules: initializeRules,
            addValidatorsFromRules: addValidatorsFromRules,
            triggerValidation: triggerValidation,

            validationErrorMessage: {},
            validationIsVisible: false,
            fieldName: null,
            validators: [],
            ngModelCtrl: null,
            ewfFormCtrl: null
        });

        function init(fieldId, element, attrs, ngModelController) {
            vm.fieldId = fieldId;
            vm.fieldName = fieldId.split('.')[1];
            vm.ngModelController = ngModelController;

            elementDefer.resolve(element);
            vm.initializeRules();
            vm.applyRules(attrs);
            vm.addValidatorsFromRules();
        }

        function initializeRules() {
            // ruleService is async, but we get rule synchronously
            var formFields = ruleService.getFieldRules(vm.fieldId);
            if (formFields) {
                rules = formFields;
            }
        }

        function applyRules(attrs) {
            if (!rules.props) {
                return;
            }

            var fieldProps = rules.props;
            Object.keys(fieldProps).forEach(function (propName) {
                var propValue = fieldProps[propName];
                var handler = PROPS[propName];

                try {
                    handler(propValue, attrs, vm.ngModelController);
                } catch (error) {
                    logService.error('error while applying prop handler "' + propName + '" to field "' + rules.props.fieldId + '" : ' + error);
                }
            });
        }

        function addValidatorsFromRules() {
            vm.cleanErrorMessages();
            if (!rules.validators) {
                return;
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = rules.validators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var rule = _step.value;

                    var functionName = rule.type;
                    var validator = validatorsFactory.createValidator(functionName, rule.params);
                    if (validator) {
                        addValidator(validator);
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
        }

        function setupValidation() {
            vm.ngModelCtrl.$parsers.push(vm.validationCallback);
            vm.ngModelCtrl.$formatters.push(vm.validationCallback);
        }

        function validationCallback(value) {
            vm.ngModelCtrl.$setValidity('ewfValid', vm.validate(value));
            return value;
        }

        function addValidator(validator) {
            vm.validators.push(validator);

            elementDefer.promise.then(function (element) {
                element.addClass(validator.getCSSClass());
            });
        }

        function validate(value) {
            var valid = true;
            vm.cleanErrorMessages();
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = vm.validators[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var validator = _step2.value;

                    var validatorResponse = validator.validate(value);
                    if (validatorResponse === false) {
                        vm.addErrorMessage(validator.getMessage());
                        valid = false;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                        _iterator2['return']();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return valid;
        }

        function addErrorMessage(message) {
            vm.ewfFormCtrl.addFieldError(vm.fieldName, message);
        }

        function cleanErrorMessages() {
            vm.ewfFormCtrl.cleanFieldErrors(vm.fieldName);
        }

        function removeSpecificErrorMessage(message) {
            vm.ewfFormCtrl.removeFieldError(vm.fieldName, message);
        }

        function triggerValidation() {
            var ngModel = vm.ngModelCtrl;
            ngModel.$setViewValue(ngModel.$viewValue);
        }
    }
});
//# sourceMappingURL=ewf-input-controller.js.map
