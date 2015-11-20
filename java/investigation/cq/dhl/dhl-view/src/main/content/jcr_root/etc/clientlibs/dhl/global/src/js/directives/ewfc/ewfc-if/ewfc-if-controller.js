import './../../../services/config-service';

EwfcIfController.$inject = ['$q', 'configService'];

export default function EwfcIfController($q, configService) {
    const vm = this;

    vm.setRenderFunction = setRenderFunction;
    vm.setValue = setValue;

    let renderFunction;

    function setRenderFunction(newRenderFunction) {
        renderFunction = newRenderFunction;
    }

    function setValue(key) {
        configService.getBoolean(key).then((response) => {
            renderFunction(response);
        });
    }
}
