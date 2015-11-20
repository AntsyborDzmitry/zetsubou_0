import './item-attributes-service';
import './../../ewf-shipment-service';
import './../shipment-type-service';
import './../../../../services/nls-service';

ItemAttributesController.$inject = ['nlsService', 'itemAttributesService', 'shipmentService'];

export default function ItemAttributesController(nlsService, itemAttributesService, shipmentService) {
    const vm = this;

    Object.assign(vm, {
        shippingPurpose: '',
        shippingPurposeList: [],
        estimateDuties: false,

        init,
        onNextClick
    });

    function init() {
        const countryCode = shipmentService.getShipmentCountry();

        itemAttributesService.getShippingPurposeList(countryCode)
            .then((response) => {
                vm.shippingPurposeList = response;
                vm.shippingPurposeList.forEach((purpose) => {
                    purpose.title = nlsService.getTranslationSync(`shipment.${purpose.localizationKey}`);
                });

                const defaultPurpose = vm.shippingPurposeList.find((purpose) => purpose.defaultPurpose);
                if (defaultPurpose) {
                    vm.shippingPurpose = defaultPurpose;
                }
            });
    }

    function onNextClick() {
        shipmentService.setCustomsInvoicePurpose(vm.shippingPurpose);
    }
}
