define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = EwfDataTableHeaderCellController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].controller('ewfDataTableHeaderCellController', EwfDataTableHeaderCellController);

    EwfDataTableHeaderCellController.$inject = ['$scope'];

    function EwfDataTableHeaderCellController($scope) {
        var vm = this;

        Object.assign(vm, {
            getClasses: getClasses,
            handleClick: handleClick
        });

        function getClasses() {
            var _ref = $scope.ewfDataTableCtrl.getSorting() || {};

            var property = _ref.property;
            var direction = _ref.direction;

            var current = $scope.property && property === $scope.property;
            return {
                current: current,
                ascending: current && direction === 'asc',
                descending: current && direction === 'desc'
            };
        }

        function handleClick() {
            var _ref2 = $scope.ewfDataTableCtrl.getSorting() || {};

            var property = _ref2.property;
            var direction = _ref2.direction;

            $scope.ewfDataTableCtrl.setSorting({
                property: $scope.property,
                direction: $scope.property === property && direction === 'asc' ? 'desc' : 'asc'
            });
        }
    }
});
//# sourceMappingURL=ewf-data-table-header-cell-controller.js.map
