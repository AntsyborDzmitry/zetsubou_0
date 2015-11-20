define(['exports', 'module', 'ewf', './assigning-shipments-controller'], function (exports, module, _ewf, _assigningShipmentsController) {
    'use strict';

    module.exports = AssigningShipments;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _AssigningShipmentsController = _interopRequireDefault(_assigningShipmentsController);

    _ewf2['default'].directive('assigningShipments', AssigningShipments);

    function AssigningShipments() {
        return {
            restrict: 'E',
            controller: _AssigningShipmentsController['default'],
            controllerAs: 'assigningShipmentsCtrl',
            link: {
                pre: preLink
            }
        };
    }

    function preLink(scope, element, attributes, assigningShipmentsCtrl) {
        assigningShipmentsCtrl.init();
    }
});
//# sourceMappingURL=assigning-shipments-directive.js.map
