import 'services/rule-service';

EwfFormController.$inject = ['$scope', 'logService', 'ruleService'];

export default function EwfFormController($scope, logService, ruleService) {
    const vm = this;

    Object.assign(vm, {
        init,
        ewfValidation,
        setErrorsFromResponse,
        cleanFormErrors,
        cleanFieldErrors,
        cleanAllFieldErrors,
        addFieldError,
        removeFieldError,
        reloadRules,

        hideRules: {},
        rulesObtained: false,
        errorHappened: false,
        formErrors: [],
        fieldErrors: {},
        formName: ''
    });

    function init(name) {
        vm.formName = name;
        initializeRules();
    }

    function reloadRules(countryId) {
        initializeRules(countryId);
    }

    /**
     * Init rules and store them in view model
     * Never work with DOM in this method cause it called form preLink
     */
    function initializeRules(countryId) {
        ruleService.acquireRulesForFormFields(vm.formName, countryId)
            .then(function(formRules) {
                applyVisibilityRules(formRules);
                vm.rulesObtained = true;
            })
            .catch(function(error) {
                vm.errorHappened = true;
                logService.error(`Unable to read rules for form: "${vm.formName}". Error: ${error}`);
            });
    }

    function ewfValidation() {
        $scope.$broadcast('ValidateForm');
        return true;
    }

    // We could NOT move this function. This place may not be the most perfect one.
    // Yet we have to apply visibility rules before showing form,
    // and only in ewf-form we know when rules has been obtained and applied
    function applyVisibilityRules(formRules) {
        Object.keys(formRules).forEach((fieldName) => {
            const field = formRules[fieldName];
            if (field.props) {
                const visible = field.props.visible;
                const hidden = visible === false || visible === 'false';
                vm.hideRules[fieldName] = hidden;
            }
        });
    }

    function setErrorsFromResponse(response) {
        vm.formErrors = response.errors || [];
        vm.fieldErrors = response.fieldErrors || {};
    }

    function cleanFormErrors() {
        vm.formErrors = [];
    }

    function cleanFieldErrors(name) {
        vm.fieldErrors[name] = [];
    }

    function cleanAllFieldErrors() {
        vm.fieldErrors = {};
    }

    function addFieldError(name, error) {
        const fieldErrors = vm.fieldErrors[name] = vm.fieldErrors[name] || [];

        if (!fieldErrors.includes(error)) {
            fieldErrors.push(error);
        }
    }

    function removeFieldError(name, message) {
        const fieldErrors = vm.fieldErrors[name];

        if (fieldErrors && fieldErrors.includes(message)) {
            fieldErrors.splice(fieldErrors.indexOf(message), 1);
        }
    }
}
