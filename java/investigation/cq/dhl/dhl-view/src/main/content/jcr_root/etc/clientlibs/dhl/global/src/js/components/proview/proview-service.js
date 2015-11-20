import ewf from 'ewf';

ewf.service('proviewService', proviewService);

proviewService.$inject = ['$http', '$q', 'logService'];

export default function proviewService($http, $q, logService) {

    this.getUrl = getUrl;

    function getUrl() {
        return $http.get('/api/auth/proview')
            .then((response) => {
                return response.data;
            })
            .catch((response) => {
                logService.error('Could not get proview access URL');
                return $q.reject(response.data);
            });
    }
}

