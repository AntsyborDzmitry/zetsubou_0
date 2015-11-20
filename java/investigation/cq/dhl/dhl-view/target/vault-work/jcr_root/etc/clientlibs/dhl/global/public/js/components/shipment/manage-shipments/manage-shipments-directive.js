define(['exports', 'ewf', './manage-shipments-controller'], function (exports, _ewf, _manageShipmentsController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ManageShipmentsController = _interopRequireDefault(_manageShipmentsController);

    _ewf2['default'].directive('ewfManageShipments', ewfManageShipments);

    function ewfManageShipments() {
        return {
            restrict: 'E',
            controller: _ManageShipmentsController['default'],
            controllerAs: 'manageShipmentsCtrl'
        };
    }
});
//# sourceMappingURL=manage-shipments-directive.js.map
