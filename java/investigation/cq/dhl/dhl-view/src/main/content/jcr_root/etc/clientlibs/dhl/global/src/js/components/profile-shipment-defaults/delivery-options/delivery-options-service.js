import ewf from 'ewf';
import './../../../services/ewf-crud-service';

ewf.service('deliveryOptionsService', DeliveryOptionsService);

DeliveryOptionsService.$inject = ['$q', 'ewfCrudService'];

export default function DeliveryOptionsService($q, ewfCrudService) {
    const deliveryOptionsUrl = '/api/myprofile/shipment/defaults/delivery';
    const countryListUrl = '/api/location/list';

    Object.assign(this, {
        getData,
        saveOptions,
        getDeliveryOptions,
        getCountryList
    });

    function getData() {
        return $q.all([getDeliveryOptions(), getCountryList()])
            .then(([options, countryList]) => ({
                options,
                countryList
            }));
    }

    function getDeliveryOptions() {
        return ewfCrudService.getElementList(deliveryOptionsUrl);
    }

    function getCountryList() {
        return ewfCrudService.getElementList(countryListUrl);
    }

    function saveOptions(options) {
        return ewfCrudService.updateElement(deliveryOptionsUrl, options);
    }
}
