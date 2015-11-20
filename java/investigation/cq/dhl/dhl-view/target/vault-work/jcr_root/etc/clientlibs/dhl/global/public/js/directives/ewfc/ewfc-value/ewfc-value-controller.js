define(['exports', 'module', './../../../services/config-service'], function (exports, module, _servicesConfigService) {
    'use strict';

    module.exports = EwfcValueController;

    EwfcValueController.$inject = ['$q', 'configService'];

    function EwfcValueController($q, configService) {
        var vm = this;

        vm.setRenderFunction = setRenderFunction;
        vm.setValue = setValue;

        var renderFunction = undefined;

        function setRenderFunction(newRenderFunction) {
            renderFunction = newRenderFunction;
        }

        function setValue(key) {
            configService.getValue(key).then(function (value) {
                renderFunction(value);
            });
        }
    }
});
//# sourceMappingURL=ewfc-value-controller.js.map
