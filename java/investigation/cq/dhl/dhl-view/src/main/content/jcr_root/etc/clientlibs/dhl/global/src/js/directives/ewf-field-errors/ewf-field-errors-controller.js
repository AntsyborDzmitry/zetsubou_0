import ewf from 'ewf';

ewf.controller('EwfFieldErrorsController', EwfFieldErrorsController);

EwfFieldErrorsController.$inject = ['$scope', 'logService'];

export default function EwfFieldErrorsController($scope, logService) {
    const vm = this;
    //properties
    vm.fieldController = null;
    vm.fieldName = null;
    vm.errorMessages = [];
    vm.ewfFormCtrl = null;
    // @todo: refactor this temporary hack and merge it with errorMessages
    vm.validationMessages = [];
    // methods
    vm.onDisplayServerErrors = onDisplayServerErrors;
    vm.getErrorMessages = getErrorMessages;

    $scope.$on('ewfForm.displayServerErrors', vm.onDisplayServerErrors);

    function onDisplayServerErrors(event, errors) {
        if (errors.fieldErrors) {
            const tempFName = vm.fieldName;
            try {
                if (vm.fieldName.includes('accountNumber') && !vm.fieldName.includes('-')) {
                    const fieldValue = vm.fieldController.getModelValue();
                    vm.fieldName = vm.fieldName + '-' + fieldValue;
                }
            } catch (err) {
                logService.error(err);
            }

            vm.errorMessages = errors.fieldErrors[vm.fieldName];
            if (vm.errorMessages) {
                if (vm.errorMessages.length > 0) {
                    vm.fieldController.invalidateModel(tempFName);
                }
            }
        }
    }

    function getErrorMessages() {
        return vm.ewfFormCtrl.fieldErrors[vm.fieldName] || [];
    }
}
