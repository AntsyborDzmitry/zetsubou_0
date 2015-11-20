import 'services/rule-service';
import './../../validation/validators-factory';
import 'services/log-service';
import './../../services/nls-service';

/* @todo: START - Code to eliminate after refactoring  */

const PROPS = {
    defaultValue: function(value, attrs, ngModelController) {
        ngModelController.$setViewValue(value);
        ngModelController.$render();
    },

    //TODO: implement
    options: function(/*params, attrs*/) {

    },

    // TODO: Implement
    hint: function(/*value, fieldName*/) {
    }
};

/* @todo: END - Code to eliminate after refactoring  */

InputController.$inject = ['$scope', '$q', 'logService', 'ruleService', 'nlsService', 'validatorsFactory'];

export default function InputController($scope, $q, logService, ruleService, nlsService, validatorsFactory) {
    const vm = this;

    let rules = {};
    const elementDefer = $q.defer();

    Object.assign(vm, {
        init,
        applyRules,
        setupValidation,
        validationCallback,
        addValidator,
        validate,
        addErrorMessage,
        cleanErrorMessages,
        removeSpecificErrorMessage,
        initializeRules,
        addValidatorsFromRules,
        triggerValidation,

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
        const formFields = ruleService.getFieldRules(vm.fieldId);
        if (formFields) {
            rules = formFields;
        }
    }

    function applyRules(attrs) {
        if (!rules.props) {
            return;
        }

        const fieldProps = rules.props;
        Object.keys(fieldProps).forEach((propName) => {
            const propValue = fieldProps[propName];
            const handler = PROPS[propName];

            try {
                handler(propValue, attrs, vm.ngModelController);
            } catch (error) {
                logService.error('error while applying prop handler "' + propName +
                                    '" to field "' + rules.props.fieldId + '" : ' + error);
            }
        });
    }

    function addValidatorsFromRules() {
        vm.cleanErrorMessages();
        if (!rules.validators) {
            return;
        }

        for (let rule of rules.validators) {
            const functionName = rule.type;
            const validator = validatorsFactory.createValidator(functionName, rule.params);
            if (validator) {
                addValidator(validator);
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

        elementDefer.promise.then((element) => {
            element.addClass(validator.getCSSClass());
        });
    }

    function validate(value) {
        let valid = true;
        vm.cleanErrorMessages();
        for (let validator of vm.validators) {
            const validatorResponse = validator.validate(value);
            if (validatorResponse === false) {
                vm.addErrorMessage(validator.getMessage());
                valid = false;
                break;
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
        const ngModel = vm.ngModelCtrl;
        ngModel.$setViewValue(ngModel.$viewValue);
    }
}
