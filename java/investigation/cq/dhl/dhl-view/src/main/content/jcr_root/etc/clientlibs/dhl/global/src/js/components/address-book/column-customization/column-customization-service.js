import ewf from 'ewf';

ewf.service('columnCustomizationService', ColumnCustomizationService);

ColumnCustomizationService.$inject = ['$http', '$q', 'logService'];

export default function ColumnCustomizationService($http, $q, logService) {
    return {
        getColumnsInfo,
        updateColumnsInfo
    };

    function getColumnsInfo() {
        return $http.get('/api/addressbook/configure/columns')
            .then((response) => response.data)
            .catch((response) => {
                logService.error('can not get columns configuration');
                return $q.reject(response.data);
            });
    }

    function updateColumnsInfo(selectedColumns) {
        return $http.post('/api/addressbook/configure/columns', selectedColumns)
            .then((response) => response.data)
            .catch((response) => {
                logService.error('columns configuration was not updated', response.data);
                return $q.reject(response.data);
            });
    }
}
