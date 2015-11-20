export default function EwfPasswordController() {
    const vm = this;

    Object.assign(vm, {
        formName: '',
        password: '',

        showErrorIfPasswordIsEmpty
    });

    function showErrorIfPasswordIsEmpty(ewfInputPasswordCtrl) {
        return !ewfInputPasswordCtrl.validationIsVisible && vm.parentForm.pswd.$dirty && vm.password === '';
    }
}
