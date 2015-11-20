import './../../../services/config-service';

EwfcValueController.$inject = ['$q', 'configService'];

export default function EwfcValueController($q, configService) {
    const vm = this;

    vm.setRenderFunction = setRenderFunction;
    vm.setValue = setValue;

    let renderFunction;

    function setRenderFunction(newRenderFunction) {
        renderFunction = newRenderFunction;
    }

    function setValue(key) {
        configService.getValue(key).then((value) => {
            renderFunction(value);
        });
    }
}
