import ewf from 'ewf';

ewf.controller('EwfDataTableController', EwfDataTableController);

EwfDataTableController.$inject = ['$scope'];

export default function EwfDataTableController($scope) {
    const vm = this;

    Object.assign(vm, {
        setData,
        getSorting,
        setSorting,
        getSelectedData,
        hasSelectedData,
        changeSelection,
        getViewData
    });

    $scope.$parent.ewfDataTableCtrl = vm;

    let data = [];
    $scope.$watchCollection('data', (value) => {
        setData(value);
    });

    function setData(value) {
        data = value || [];
        applySorting();
    }

    let sorting;
    $scope.$watch('sorting', (value) => {
        setSorting(value);
    }, true);

    function getSorting() {
        return sorting;
    }

    function setSorting(value) {
        sorting = value;
        applySorting();
    }

    let viewData;

    function isSortingNeeded() {
        return sorting && sorting.property && sorting.direction && data.length;
    }

    function applySorting() {
        if (!isSortingNeeded()) {
            viewData = data;
            return;
        }
        const {property, direction} = sorting;
        const order = direction === 'asc' ? 1 : -1;
        viewData = data.sort((itemA, itemB) => {
            const itemAPropValue = itemA[property], itemBPropValue = itemB[property];
            if (angular.isUndefined(itemAPropValue) || (itemAPropValue === null) || (itemAPropValue > itemBPropValue)) {
                return order;
            }
            if (angular.isUndefined(itemBPropValue) || (itemBPropValue === null) || (itemBPropValue > itemAPropValue)) {
                return -order;
            }
            return 0;
        });
    }

    function getSelectedData() {
        return data.filter((item) => item.dataTableSelected);
    }

    function hasSelectedData() {
        return data.some((item) => item.dataTableSelected);
    }

    function changeSelection(value) {
        data.forEach((item) => {
            item.dataTableSelected = !!value;
        });
    }

    function getViewData() {
        return viewData;
    }
}
