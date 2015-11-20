import 'services/rule-service';
import './../validation/services/validation-service';


InputPasswordController.$inject = ['$scope', '$q', 'logService', 'ruleService', 'nlsService', 'validatorsFactory'];

export default function InputPasswordController($scope, $q, logService, ruleService, nlsService, validatorsFactory) {
    const vm = this;
    let rules = {};
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
        const formOptions = vm.ewfFormCtrl.options;
        const countryId = formOptions ? formOptions.countryId : null;

        // ruleService is async, but we get rule synchronously
        const formFields = ruleService.getFieldRules(vm.fieldId, countryId);
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
        const validationErrorMessages = vm.validationErrorMessage[vm.fieldName];
        let allRulesPassed = true;

        const validationErrorPromises = [];
        for (let rule of rules.validators) {
            const functionName = rule.type;
            const viewValue = vm.ngModelController.$viewValue;

            const ruleValid = validateRule(viewValue, functionName, rule.params);
            const resObject = {
                translation: rule.msg,
                functionName,
                viewValue: viewValue || '',
                validateParams: rule.params,
                isRuleValid: ruleValid
            };

            if (!validationErrorMessages.hasOwnProperty(functionName)) {
                validationErrorMessages[functionName] = [];
            }

            const ruleIndex = validationErrorMessages[functionName].push(resObject) - 1;
            validationErrorPromises.push(
                populateValidationErrorObject(validationErrorMessages, functionName, ruleIndex)
            );

            if (!ruleValid && allRulesPassed) {
                allRulesPassed = false;
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
        const validateFunction = validatorsFactory.createValidator(functionName, param);
        let valid = true;
        if (validateFunction) {
            try {
                valid = validateFunction.validate(viewValue, param);
            } catch (error) {
                logService.error('During validation of field "' + vm.fieldName +
                                        '" validator ' + functionName + ' threw error' + error);
            }
        }

        return valid;
    }

    // TODO: Unite with rule approach ( after injecting errorDisplayService)
    function populateValidationErrorObject(validationErrorMessages, functionName, ruleIndex) {
        const validationItem = validationErrorMessages[functionName][ruleIndex];
        return nlsService.getTranslation(validationItem.translation)
            .then((translation) => {
                if (translation) {
                    validationItem.translation = translation;
                } else {
                    logService.error('There is no message for label: ' + validationItem.translation);
                }
            })
            .catch((message) => {
                logService.error('There is no message for label:' + validationItem.translation +
                                        ', because ' + message);
                return $q.reject();
            });
    }
}
