define(['exports', 'module', 'ewf', './ewf-shipment-controller'], function (exports, module, _ewf, _ewfShipmentController) {
    'use strict';

    module.exports = ewfShipment;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfShipmentController = _interopRequireDefault(_ewfShipmentController);

    _ewf2['default'].directive('ewfShipment', ewfShipment);

    function ewfShipment() {
        return {
            restrict: 'E',
            controller: _EwfShipmentController['default'],
            controllerAs: 'shipmentCtrl',
            link: {
                post: function post($scope, element, attrs, shipmentCtrl) {
                    shipmentCtrl.init();
                }
            }
        };
    }
});
//# sourceMappingURL=ewf-shipment-directive.js.map
