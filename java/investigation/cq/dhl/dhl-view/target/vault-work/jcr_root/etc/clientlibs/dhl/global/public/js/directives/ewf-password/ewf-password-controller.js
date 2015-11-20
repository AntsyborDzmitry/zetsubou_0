define(['exports', 'module'], function (exports, module) {
    'use strict';

    module.exports = EwfPasswordController;

    function EwfPasswordController() {
        var vm = this;

        Object.assign(vm, {
            formName: '',
            password: '',

            showErrorIfPasswordIsEmpty: showErrorIfPasswordIsEmpty
        });

        function showErrorIfPasswordIsEmpty(ewfInputPasswordCtrl) {
            return !ewfInputPasswordCtrl.validationIsVisible && vm.parentForm.pswd.$dirty && vm.password === '';
        }
    }
});
//# sourceMappingURL=ewf-password-controller.js.map
