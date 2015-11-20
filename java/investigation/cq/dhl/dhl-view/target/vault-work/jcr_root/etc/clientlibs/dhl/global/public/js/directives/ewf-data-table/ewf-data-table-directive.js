define(['exports', 'module', 'ewf', './ewf-data-table-controller'], function (exports, module, _ewf, _ewfDataTableController) {
    'use strict';

    module.exports = ewfDataTable;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfDataTableController = _interopRequireDefault(_ewfDataTableController);

    _ewf2['default'].directive('ewfDataTable', ewfDataTable);

    function ewfDataTable() {
        return {
            restrict: 'A',
            controller: _EwfDataTableController['default'],
            controllerAs: 'ewfDataTableCtrl',
            scope: {
                data: '=dtData',
                sorting: '=dtSorting'
            }
        };
    }
});
//# sourceMappingURL=ewf-data-table-directive.js.map
