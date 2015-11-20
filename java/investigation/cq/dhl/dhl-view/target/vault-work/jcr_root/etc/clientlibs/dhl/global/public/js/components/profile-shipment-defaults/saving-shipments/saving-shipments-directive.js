define(['exports', 'module', 'ewf', './saving-shipments-controller'], function (exports, module, _ewf, _savingShipmentsController) {
    'use strict';

    module.exports = SavingShipments;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _SavingShipmentsController = _interopRequireDefault(_savingShipmentsController);

    _ewf2['default'].directive('savingShipments', SavingShipments);

    function SavingShipments() {
        return {
            restrict: 'AE',
            controller: _SavingShipmentsController['default'],
            controllerAs: 'savingShipmentsController',
            link: {
                pre: preLink
            }
        };

        function preLink($scope, elem, attrs, controller) {
            controller.preloadDefaultSavingShipment();
            controller.preloadSectionFromUrl();
        }
    }
});
//# sourceMappingURL=saving-shipments-directive.js.map
