import ewf from 'ewf';

ewf.controller('EwfFormErrorsController', EwfFormErrorsController);

export default function EwfFormErrorsController() {
    const vm = this;
    vm.errorMessages = [];
    vm.formCtrl = null;
}
