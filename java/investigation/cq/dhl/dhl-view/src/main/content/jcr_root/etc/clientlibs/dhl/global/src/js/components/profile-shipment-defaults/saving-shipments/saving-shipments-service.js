import ewf from 'ewf';

ewf.service('savingShipmentsService', savingShipmentsService);

savingShipmentsService.$inject = ['$http', '$q', 'logService'];

// TODO: add jsdoc
function savingShipmentsService($http, $q, logService) {
    this.getMyDhlAccountsSavingShipments = getMyDhlAccountsSavingShipments;
    this.updateMyDhlAccountSavingShipments = updateMyDhlAccountSavingShipments;

    function getMyDhlAccountsSavingShipments() {
        return $http.get('/api/myprofile/shipment/defaults/savings')
            .then((response) => {
                // TODO: check 'data' validity
                return response.data;
            })
            .catch((response) => {
                const data = response.data;
                logService.error('LangSelector failed to get langs! ' + data);
                return $q.reject(data);
            });
    }

    function updateMyDhlAccountSavingShipments(accountsDefaults) {
        return $http.post('/api/myprofile/shipment/defaults/savings', accountsDefaults)
            .then((response) => {
                // TODO: check 'data' validity
                return response.data;
            })
            .catch((response) => {
                const data = response.data;
                logService.error('LangSelector failed to get langs! ' + data);
                return $q.reject(data);
            });
    }
}
