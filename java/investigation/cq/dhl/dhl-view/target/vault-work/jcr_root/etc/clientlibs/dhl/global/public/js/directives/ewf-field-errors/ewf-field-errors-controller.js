define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = EwfFieldErrorsController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].controller('EwfFieldErrorsController', EwfFieldErrorsController);

    EwfFieldErrorsController.$inject = ['$scope', 'logService'];

    function EwfFieldErrorsController($scope, logService) {
        var vm = this;
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
                var tempFName = vm.fieldName;
                try {
                    if (vm.fieldName.includes('accountNumber') && !vm.fieldName.includes('-')) {
                        var fieldValue = vm.fieldController.getModelValue();
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
});
//# sourceMappingURL=ewf-field-errors-controller.js.map
