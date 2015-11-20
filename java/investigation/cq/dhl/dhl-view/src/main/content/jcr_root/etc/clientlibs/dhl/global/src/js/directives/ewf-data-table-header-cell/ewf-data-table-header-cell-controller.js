import ewf from 'ewf';

ewf.controller('ewfDataTableHeaderCellController', EwfDataTableHeaderCellController);

EwfDataTableHeaderCellController.$inject = ['$scope'];

export default function EwfDataTableHeaderCellController($scope) {
    const vm = this;

    Object.assign(vm, {
        getClasses,
        handleClick
    });

    function getClasses() {
        const {property, direction} = ($scope.ewfDataTableCtrl.getSorting() || {});
        const current = $scope.property && (property === $scope.property);
        return {
            current,
            ascending: current && direction === 'asc',
            descending: current && direction === 'desc'
        };
    }

    function handleClick() {
        const {property, direction} = ($scope.ewfDataTableCtrl.getSorting() || {});
        $scope.ewfDataTableCtrl.setSorting({
            property: $scope.property,
            direction: $scope.property === property && direction === 'asc' ? 'desc' : 'asc'
        });
    }
}
