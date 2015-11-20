import ewf from 'ewf';

ewf.service('addressDetailsService', addressDetailsService);

addressDetailsService.$inject = ['$http', '$q', 'logService'];

//TODO: if needed not only in address details, move to /services
export default function addressDetailsService($http, $q, logService) {
    this.checkUserCanImport = function(fromCountryCode, toCountryCode, importAccountNumber) {
        return $http.get(`/api/account/can_import/${fromCountryCode}/${toCountryCode}/${importAccountNumber}`)
            .then((response) => response.data)
            .catch((response) => $q.reject(response));
    };

    this.saveAccountNumber = function(importAccountNumber) {
        return $http.post('/api/myprofile/addAccountNumber/', {accountNumber: importAccountNumber})
            .then((response) => {
                logService.log(response);
                return response.data;
            })
            .catch((response) => {
                logService.error(response.data);
                return $q.reject(response.data);
            });
    };
}
