define(['exports', 'module', './../../../services/config-service'], function (exports, module, _servicesConfigService) {
    'use strict';

    module.exports = EwfcIfController;

    EwfcIfController.$inject = ['$q', 'configService'];

    function EwfcIfController($q, configService) {
        var vm = this;

        vm.setRenderFunction = setRenderFunction;
        vm.setValue = setValue;

        var renderFunction = undefined;

        function setRenderFunction(newRenderFunction) {
            renderFunction = newRenderFunction;
        }

        function setValue(key) {
            configService.getBoolean(key).then(function (response) {
                renderFunction(response);
            });
        }
    }
});
//# sourceMappingURL=ewfc-if-controller.js.map
