import ewf from 'ewf';

ewf.service('printerSettingsService', printerSettingsService);

printerSettingsService.$inject = ['$http', '$q', 'logService'];

// TODO: add jsdoc
export default function printerSettingsService($http, $q, logService) {
    this.getPrinterSettings = getPrinterSettings;
    this.updatePrinterSettings = updatePrinterSettings;

    function getPrinterSettings() {
        return $http.get('/api/myprofile/shipment/settings/printer')
            .then((response) => {
                // TODO: check 'data' validity
                return response.data;
            })
            .catch((response) => {
                const data = response.data;
                logService.error('Failed to load printer settings ' + data);
                return $q.reject(data);
            });
    }

    function updatePrinterSettings(printerObject) {
        return $http.post('/api/myprofile/shipment/settings/printer', printerObject)
            .then((response) => {
                // TODO: check 'data' validity
                return response.data;
            })
            .catch((response) => {
                const data = response.data;
                logService.error('Error to update printer settings ' + data);
                return $q.reject(data);
            });
    }
}
