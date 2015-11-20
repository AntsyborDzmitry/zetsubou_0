import ewf from 'ewf';

ewf.controller('EwfFieldController', EwfFieldController);

export default function EwfFieldController() {
    const vm = this;

    //properties
    vm.name = null;
    vm.ewfFormCtrl = null;
}
