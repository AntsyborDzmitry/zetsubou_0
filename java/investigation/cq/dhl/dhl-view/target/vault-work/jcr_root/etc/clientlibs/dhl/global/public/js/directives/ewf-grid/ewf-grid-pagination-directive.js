define(['exports', 'module', 'ewf', './ewf-grid-pagination-controller', './ewf-grid-directive'], function (exports, module, _ewf, _ewfGridPaginationController, _ewfGridDirective) {
    'use strict';

    module.exports = EwfGridPagination;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfGridPaginationController = _interopRequireDefault(_ewfGridPaginationController);

    _ewf2['default'].directive('ewfGridPagination', EwfGridPagination);

    function EwfGridPagination() {
        return {
            restrict: 'AE',
            controller: _EwfGridPaginationController['default'],
            controllerAs: 'ewfGridPaginationCtrl',
            template: '<div class=row><div class=\"col-6 single-line\" ng-if=!ewfGridPaginationCtrl.attributes.hidePageRange>{{ ewfGridPaginationCtrl.attributes.paginationSettings.rowMin }} -{{ ewfGridPaginationCtrl.attributes.paginationSettings.rowMax }} of {{ ewfGridPaginationCtrl.attributes.gridData.length }}</div><div class=\"a-right unselectable\" ng-class=\"{ \'col-6\': !ewfGridPaginationCtrl.attributes.hidePageRange }\"><div class=\"a-right right\"><span class=page-buttons ng-click=\"ewfGridPaginationCtrl.moveToPageIfExists(ewfGridPaginationCtrl.attributes.paginationSettings.pageIndex - 1)\"><a ng-class=\"{ disabled: ewfGridPaginationCtrl.attributes.paginationSettings.pageIndex < 1 }\"><i class=dhlicon-carat-left></i></a></span> <span class=page-buttons ng-repeat=\"page in ewfGridPaginationCtrl.attributes.paginationSettings.window\" ng-click=ewfGridPaginationCtrl.moveToPageIfExists(page.index)><a ng-show=\"page.index !== null\" ng-class=\"{ on: ewfGridPaginationCtrl.attributes.paginationSettings.pageIndex === page.index, off: page.index !== null && ewfGridPaginationCtrl.attributes.paginationSettings.pageIndex !== page.index }\">{{ page.display }}</a> <span ng-show=\"page.index === null\">{{ page.display }}</span></span> <span class=page-buttons ng-click=\"ewfGridPaginationCtrl.moveToPageIfExists(ewfGridPaginationCtrl.attributes.paginationSettings.pageIndex + 1)\"><a ng-class=\"{ disabled: ewfGridPaginationCtrl.attributes.paginationSettings.pageCount <= ewfGridPaginationCtrl.attributes.paginationSettings.pageIndex + 1 }\"><i class=dhlicon-carat-right></i></a></span></div><div class=\"col-4 a-right right\" ng-if=!ewfGridPaginationCtrl.attributes.hidePaginationSpan><span nls=address-book.number_of_items_filter_text></span> <span class=\"select select_small\"><select ng-model=ewfGridCtrl.pagination.pageSize ng-change=ewfGridCtrl.moveToPageIfExists(ewfGridCtrl.firstPage) ng-options=\"page for page in ewfGridCtrl.pages\"></select></span></div></div></div>',
            require: ['ewfGrid', 'ewfGridPagination', '?^ewfContainer'],
            scope: true
        };
    }
});
//# sourceMappingURL=ewf-grid-pagination-directive.js.map
