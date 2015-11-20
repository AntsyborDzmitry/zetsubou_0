define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ShipmentFlowService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    ShipmentFlowService.$inject = [];
    _ewf2['default'].service('shipmentFlowService', ShipmentFlowService);

    function ShipmentFlowService() {
        var publicAPI = {
            getStepsIncompleteData: function getStepsIncompleteData() {}
        };

        return publicAPI;
    }
});
//# sourceMappingURL=ewf-shipment-flow-service.js.map
