define(['exports', 'module', 'ewf', './ewf-data-table-header-cell-controller'], function (exports, module, _ewf, _ewfDataTableHeaderCellController) {
    'use strict';

    module.exports = ewfDataTableHeaderCell;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfDataTableHeaderCellController = _interopRequireDefault(_ewfDataTableHeaderCellController);

    _ewf2['default'].directive('ewfDataTableHeaderCell', ewfDataTableHeaderCell);

    function ewfDataTableHeaderCell() {
        return {
            restrict: 'A',
            controller: _EwfDataTableHeaderCellController['default'],
            controllerAs: 'ewfDataTableHeaderCellCtrl',
            template: '<a class=data-table__sort ng-if=sortable ng-class=ewfDataTableHeaderCellCtrl.getClasses(); ng-click=ewfDataTableHeaderCellCtrl.handleClick();><span ng-if=caption ng-bind=caption></span> <span ng-if=nlsCaption nls={{nlsCaption}}></span> <i class=\"data-table__sort-arrow dhlicon-arrow-up\"></i> <i class=\"data-table__sort-arrow dhlicon-arrow-down\"></i></a> <span ng-if=!sortable><span ng-if=caption ng-bind=caption></span> <span ng-if=nlsCaption nls={{nlsCaption}}></span></span>',
            require: '^ewfDataTable',
            scope: {
                property: '@dtProperty',
                caption: '@dtCaption',
                nlsCaption: '@dtNlsCaption',
                sortable: '=dtSortable'
            },
            link: {
                pre: preLink
            }
        };

        function preLink(scope, element, attrs, ewfDataTableCtrl) {
            Object.assign(scope, {
                ewfDataTableCtrl: ewfDataTableCtrl
            });
        }
    }
});
//# sourceMappingURL=ewf-data-table-header-cell-directive.js.map
