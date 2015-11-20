import ewf from 'ewf';

ewf.service('manageShipmentsService', ManageShipmentsService);

ManageShipmentsService.$inject = ['$http', '$q', 'logService'];

export default function ManageShipmentsService($http, $q, logService) {
    Object.assign(this, {
        getShipments
    });

    function getShipments() {
        return $http.get('/api/shipment')
            .then((response) => response.data)
            .catch((response) => {
                logService.error(response);
                return $q.reject(response);
            });
    }
}
