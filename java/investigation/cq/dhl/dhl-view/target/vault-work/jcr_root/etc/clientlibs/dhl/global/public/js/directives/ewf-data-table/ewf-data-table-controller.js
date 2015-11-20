define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = EwfDataTableController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].controller('EwfDataTableController', EwfDataTableController);

    EwfDataTableController.$inject = ['$scope'];

    function EwfDataTableController($scope) {
        var vm = this;

        Object.assign(vm, {
            setData: setData,
            getSorting: getSorting,
            setSorting: setSorting,
            getSelectedData: getSelectedData,
            hasSelectedData: hasSelectedData,
            changeSelection: changeSelection,
            getViewData: getViewData
        });

        $scope.$parent.ewfDataTableCtrl = vm;

        var data = [];
        $scope.$watchCollection('data', function (value) {
            setData(value);
        });

        function setData(value) {
            data = value || [];
            applySorting();
        }

        var sorting = undefined;
        $scope.$watch('sorting', function (value) {
            setSorting(value);
        }, true);

        function getSorting() {
            return sorting;
        }

        function setSorting(value) {
            sorting = value;
            applySorting();
        }

        var viewData = undefined;

        function isSortingNeeded() {
            return sorting && sorting.property && sorting.direction && data.length;
        }

        function applySorting() {
            if (!isSortingNeeded()) {
                viewData = data;
                return;
            }
            var _sorting = sorting;
            var property = _sorting.property;
            var direction = _sorting.direction;

            var order = direction === 'asc' ? 1 : -1;
            viewData = data.sort(function (itemA, itemB) {
                var itemAPropValue = itemA[property],
                    itemBPropValue = itemB[property];
                if (angular.isUndefined(itemAPropValue) || itemAPropValue === null || itemAPropValue > itemBPropValue) {
                    return order;
                }
                if (angular.isUndefined(itemBPropValue) || itemBPropValue === null || itemBPropValue > itemAPropValue) {
                    return -order;
                }
                return 0;
            });
        }

        function getSelectedData() {
            return data.filter(function (item) {
                return item.dataTableSelected;
            });
        }

        function hasSelectedData() {
            return data.some(function (item) {
                return item.dataTableSelected;
            });
        }

        function changeSelection(value) {
            data.forEach(function (item) {
                item.dataTableSelected = !!value;
            });
        }

        function getViewData() {
            return viewData;
        }
    }
});
//# sourceMappingURL=ewf-data-table-controller.js.map
