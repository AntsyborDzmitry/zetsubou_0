import ewf from 'ewf';

ewf.service('wantToShareService', wantToShareService);

wantToShareService.$inject = ['$http', '$q', 'logService'];

export default function wantToShareService($http, $q, logService) {

    this.getShipmentShareDefaults = getShipmentShareDefaults;
    this.getShareFields = getShareFields;
    this.shareDetails = shareDetails;

    function getShipmentShareDefaults(shipmentId) {
        return $http.get(`/api/shipment/${shipmentId}/share/settings`)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                logService.error(err);
                return err;
            });
    }

    function shareDetails(shipmentId, sharingInfo, sharingDefaults) {
        const shareObject = angular.copy(sharingInfo);
        shareObject.details = angular.copy(sharingDefaults);

        shareObject.toAddresses = sharingInfo.toAddresses.split(',').map((item) => item.trim());

        return $http.post(`/api/shipment/${shipmentId}/share`, shareObject)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                logService.error(err);
                return err;
            });
    }

    function getShareFields(shipmentId) {
        return $http.get(`/api/shipment/${shipmentId}/share/fields`)
            .then((response) => {
                return response.data;
            })
            .catch((err) => {
                logService.error(err);
                return err;
            });
    }

}
