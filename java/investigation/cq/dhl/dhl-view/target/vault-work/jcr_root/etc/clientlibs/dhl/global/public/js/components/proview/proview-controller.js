define(['exports', 'module', './proview-service'], function (exports, module, _proviewService) {
    'use strict';

    module.exports = ProviewController;

    ProviewController.$inject = ['logService', '$sce', 'proviewService'];

    function ProviewController(logService, $sce, proviewService) {
        var vm = this;

        proviewService.getUrl().then(function (response) {
            vm.proviewAccessUrl = $sce.trustAsResourceUrl(response);
        })['catch'](function (error) {
            logService.warn('Error getting Proview url ' + error);
        });
    }
});
//# sourceMappingURL=proview-controller.js.map
