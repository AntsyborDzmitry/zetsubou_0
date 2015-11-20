define(['exports', 'module', 'ewf', './shipment-status-controller'], function (exports, module, _ewf, _shipmentStatusController) {
    'use strict';

    module.exports = ShipmentStatus;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ShipmentStatusController = _interopRequireDefault(_shipmentStatusController);

    _ewf2['default'].directive('ewfShipmentStatus', ShipmentStatus);

    function ShipmentStatus() {
        return {
            restrict: 'E',
            controller: _ShipmentStatusController['default'],
            controllerAs: 'shipmentStatusCtrl'
        };
    }
});
//# sourceMappingURL=shipment-status-directive.js.map
