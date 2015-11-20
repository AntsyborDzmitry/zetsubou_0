import ewf from 'ewf';
import './../ewf-shipment-error-service';

ewf.service('shipmentTypeService', ShipmentTypeService);

ShipmentTypeService.$inject = ['$http', '$q', 'logService', 'shipmentErrorService'];

export default function ShipmentTypeService($http, $q, logService, shipmentErrorService) {
    const publicAPI = {
        getReferencesDetails,
        getReferenceBehavior,
        getShipmentParameters
    };

    function getReferencesDetails(fromContactId, toContactId) {
        return $http.get(`/api/shipment/reference/details/${fromContactId}/${toContactId}`)
            .then((response) => response.data)
            .catch((response) => {
                logService.error(`References list failed with ${response.data}`);
                return shipmentErrorService.processErrorCode(response);
            });
    }

    function getReferenceBehavior(countryCode) {
        return $http.get(`/api/shipment/reference/guest/behavior/${countryCode}`)
            .then((response) => response.data)
            .catch((response) => {
                logService.error(`Reference behavior failed with ${response.data}`);
                return shipmentErrorService.processErrorCode(response);
            });
    }

    function getShipmentParameters(fromCountry, toCountry) {
        return $http.get(`/api/shipment/parameters/${fromCountry}/${toCountry}`)
            .then((response) => response.data)
            .catch((response) => {
                logService.error(`response error ${response}`);
                return $q.reject(response);
            });
    }

    return publicAPI;
}
