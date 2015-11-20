import ewf from 'ewf';
import './../../ewf-shipment-error-service';
import './../../../../services/config-service';

ewf.service('itarService', ItarService);

ItarService.$inject = ['$http', '$q', 'logService', 'configService', 'shipmentErrorService'];

export default function ItarService($http, $q, logService, configService, shipmentErrorService) {
    const publicAPI = {
        getItarDetails,
        getCriticalShipmentItem,
        getEnableItarValue
    };

    function getItarDetails(destinationCountry) {
        return $http.get(`/api/shipment/itar/details/${destinationCountry}`)
            .then((response) => response.data)
            .catch((response) => {
                logService.error(`Critical shipment item price failed with ${response.data}`);
                return shipmentErrorService.processErrorCode(response);
            });
    }

    function getCriticalShipmentItem(country) {
        return configService.getValue('Shipment Details.EEI.critical.shipment.item.value', country)
            .then((criticalShipmentItem) => criticalShipmentItem.data.value.replace(/\D+/g, ''));
    }

    function getEnableItarValue(country) {
        return configService.getBoolean('Shipment Details.EEI.enable.eei', country);
    }

    return publicAPI;
}
