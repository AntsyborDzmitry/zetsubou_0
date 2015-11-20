import ewf from 'ewf';

ewf.service('saveAsFavoriteService', SaveAsFavoriteService);

SaveAsFavoriteService.$inject = ['$http', '$q', 'logService'];

export default function SaveAsFavoriteService($http, $q, logService) {
    this.saveAsFavorite = saveAsFavorite;

    function saveAsFavorite(shipmentId, shipmentName) {
        return $http.put(`/api/shipment/${shipmentId}/favorite`, {shipmentName})
            .catch((response) => {
                logService.error(response);
                return $q.reject(response.data);
            });
    }
}
