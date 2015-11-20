define(['exports', 'module', './../../services/pagination-service'], function (exports, module, _servicesPaginationService) {
    'use strict';

    module.exports = EwfGridPaginationController;

    EwfGridPaginationController.$inject = ['$scope', '$attrs', 'attrsService', 'paginationService'];

    function EwfGridPaginationController($scope, $attrs, attrsService, paginationService) {
        var vm = this;

        Object.assign(vm, {
            attributes: {
                paginationSettings: {
                    data: [],
                    window: [],
                    rowMin: 0, rowMax: 0,
                    pageSize: 10, pageIndex: 0, pageCount: 0
                }
            },
            pages: [10, 25, 50, 100],

            moveToPage: moveToPage,
            moveToPageIfExists: moveToPageIfExists

        });

        attrsService.track($scope, $attrs, 'gridData', vm.attributes);
        attrsService.track($scope, $attrs, 'paginationSettings', vm.attributes);
        attrsService.track($scope, $attrs, 'hidePageRange', vm.attributes);
        attrsService.track($scope, $attrs, 'hidePaginationSpan', vm.attributes);
        attrsService.track($scope, $attrs, 'paginationSize', vm.attributes, function () {
            if (vm.attributes.paginationSize) {
                vm.attributes.paginationSettings.pageSize = vm.attributes.paginationSize;
            }
        });

        function moveToPage(pageIndex) {
            vm.attributes.paginationSettings.pageSize = +vm.attributes.paginationSettings.pageSize;
            vm.attributes.paginationSettings = paginationService.paginate(vm.attributes.gridData, pageIndex, vm.attributes.paginationSettings.pageSize);
            attrsService.trigger($scope, $attrs, 'onPaginationUpdate', { pagination: vm.attributes.paginationSettings });
            return vm.attributes.paginationSettings;
        }

        function moveToPageIfExists(pageIndex) {
            if (pageIndex !== undefined && pageIndex !== null && pageIndex >= 0 && vm.attributes.paginationSettings.pageCount > pageIndex) {
                moveToPage(pageIndex);
            } else if (pageIndex < 0) {
                vm.attributes.paginationSettings.pageIndex = 0;
            } else if (vm.attributes.paginationSettings.pageCount < vm.attributes.paginationSettings.pageIndex + 1) {
                vm.attributes.paginationSettings.pageIndex = vm.attributes.paginationSettings.pageCount;
            }
        }
    }
});
//# sourceMappingURL=ewf-grid-pagination-controller.js.map
