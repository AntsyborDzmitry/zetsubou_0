import ewf from 'ewf';
import EwfShipmentStepBaseController from './../ewf-shipment-step-base-controller';

EwfOptionalServicesController.prototype = new EwfShipmentStepBaseController('optional-services');
EwfOptionalServicesController.$inject = ['shipmentService'];

ewf.controller('EwfOptionalServicesController', EwfOptionalServicesController);

export default function EwfOptionalServicesController(shipmentService) {
    const vm = this;

    Object.assign(vm, {
        shipment: null,

        onInit,
        hasCustomsInvoice,
        isCustomsInvoiceOwn,
        getCountryCode
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
