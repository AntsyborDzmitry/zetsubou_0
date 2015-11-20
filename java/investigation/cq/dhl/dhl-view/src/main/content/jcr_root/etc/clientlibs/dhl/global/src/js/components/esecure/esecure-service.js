import ewf from 'ewf';

ewf.service('eSecureService', eSecureService);

eSecureService.$inject = ['$http', '$q', 'logService'];

export default function eSecureService($http, $q, logService) {

    this.getToken = getToken;

    function getToken() {
        return $http.get('/api/auth/esecure')
            .then((response) => response.data)
            .catch((response) => {
                logService.error('Could not get esecure token');
                return $q.reject(response.data);
            });
    }
}

