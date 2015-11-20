define(['exports', 'module', 'ewf', './../ewf-shipment-step-base-controller'], function (exports, module, _ewf, _ewfShipmentStepBaseController) {
    'use strict';

    module.exports = EwfOptionalServicesController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfShipmentStepBaseController = _interopRequireDefault(_ewfShipmentStepBaseController);

    EwfOptionalServicesController.prototype = new _EwfShipmentStepBaseController['default']('optional-services');
    EwfOptionalServicesController.$inject = ['shipmentService'];

    _ewf2['default'].controller('EwfOptionalServicesController', EwfOptionalServicesController);

    function EwfOptionalServicesController(shipmentService) {
        var vm = this;

        Object.assign(vm, {
            shipment: null,

            onInit: onInit,
            hasCustomsInvoice: hasCustomsInvoice,
            isCustomsInvoiceOwn: isCustomsInvoiceOwn,
            getCountryCode: getCountryCode
        });

        function onInit() {
            vm.shipment = shipmentService.getShipmentData();
        }

        function hasCustomsInvoice() {
            return shipmentService.isPackage();
        }

        function isCustomsInvoiceOwn() {
            return vm.hasCustomsInvoice() && !shipmentService.getCustomsInvoice();
        }

        function getCountryCode() {
            return shipmentService.getShipmentCountry();
        }
    }
});
//# sourceMappingURL=ewf-optional-services-controller.js.map
