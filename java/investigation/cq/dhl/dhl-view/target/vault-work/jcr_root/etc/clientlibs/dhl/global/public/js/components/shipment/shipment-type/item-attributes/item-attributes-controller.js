define(['exports', 'module', './item-attributes-service', './../../ewf-shipment-service', './../shipment-type-service', './../../../../services/nls-service'], function (exports, module, _itemAttributesService, _ewfShipmentService, _shipmentTypeService, _servicesNlsService) {
    'use strict';

    module.exports = ItemAttributesController;

    ItemAttributesController.$inject = ['nlsService', 'itemAttributesService', 'shipmentService'];

    function ItemAttributesController(nlsService, itemAttributesService, shipmentService) {
        var vm = this;

        Object.assign(vm, {
            shippingPurpose: '',
            shippingPurposeList: [],
            estimateDuties: false,

            init: init,
            onNextClick: onNextClick
        });

        function init() {
            var countryCode = shipmentService.getShipmentCountry();

            itemAttributesService.getShippingPurposeList(countryCode).then(function (response) {
                vm.shippingPurposeList = response;
                vm.shippingPurposeList.forEach(function (purpose) {
                    purpose.title = nlsService.getTranslationSync('shipment.' + purpose.localizationKey);
                });

                var defaultPurpose = vm.shippingPurposeList.find(function (purpose) {
                    return purpose.defaultPurpose;
                });
                if (defaultPurpose) {
                    vm.shippingPurpose = defaultPurpose;
                }
            });
        }

        function onNextClick() {
            shipmentService.setCustomsInvoicePurpose(vm.shippingPurpose);
        }
    }
});
//# sourceMappingURL=item-attributes-controller.js.map
