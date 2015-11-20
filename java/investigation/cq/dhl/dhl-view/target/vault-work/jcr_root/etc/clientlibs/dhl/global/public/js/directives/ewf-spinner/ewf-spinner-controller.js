define(['exports', 'module', './../../services/ewf-spinner-service'], function (exports, module, _servicesEwfSpinnerService) {
    'use strict';

    module.exports = EwfSpinnerController;

    EwfSpinnerController.$inject = ['ewfSpinnerService'];

    function EwfSpinnerController(ewfSpinnerService) {
        var vm = this;

        vm.isSpinnerVisible = isSpinnerVisible;

        function isSpinnerVisible() {
            return ewfSpinnerService.isSpinnerActive();
        }
    }
});
//# sourceMappingURL=ewf-spinner-controller.js.map
