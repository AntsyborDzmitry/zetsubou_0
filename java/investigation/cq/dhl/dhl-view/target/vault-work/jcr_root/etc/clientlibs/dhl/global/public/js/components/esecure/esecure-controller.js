define(['exports', 'module', './esecure-service'], function (exports, module, _esecureService) {
    'use strict';

    module.exports = ESecureController;

    ESecureController.$inject = ['logService', 'eSecureService'];

    function ESecureController(logService, eSecureService) {
        var vm = this;
        vm.eSecureToken = '';

        eSecureService.getToken().then(function (response) {
            vm.eSecureToken = response;
        })['catch'](function (error) {
            logService.warn('From eSecure controller ' + error);
        });
    }
});
//# sourceMappingURL=esecure-controller.js.map
