define(['exports', 'module', 'ewf', './shipment-insurance-controller', './../../../directives/ewf-form/ewf-form-directive'], function (exports, module, _ewf, _shipmentInsuranceController, _directivesEwfFormEwfFormDirective) {
    'use strict';

    module.exports = shipmentInsurance;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ShipmentInsuranceController = _interopRequireDefault(_shipmentInsuranceController);

    _ewf2['default'].directive('shipmentInsurance', shipmentInsurance);

    function shipmentInsurance() {
        return {
            restrict: 'AE',
            controller: _ShipmentInsuranceController['default'],
            controllerAs: 'shipmentInsuranceCtrl',
            link: {
                pre: preLink
            }
        };

        function preLink(scope, elem, attrs, controller) {
            controller.preloadSectionFromUrl();
        }
    }
});
//# sourceMappingURL=shipment-insurance-directive.js.map
