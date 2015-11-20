import ewf from 'ewf';

ewf.service('langselectorService', langselectorService);

langselectorService.$inject = ['$http', '$q', 'logService'];

export default function langselectorService($http, $q, logService) {
    this.loadAvailableLanguages = loadAvailableLanguages;

    function loadAvailableLanguages(pagePath, countryCode) {
        let resultPagePath = pagePath;
        if (pagePath.includes('.html')) {
            resultPagePath = pagePath.substring(0, pagePath.indexOf('.html'));
        }

        return $http.get(`/services/dhl/nls/pagelangs?pagepath=${resultPagePath}&country=${countryCode}`)
            // TODO: check 'data' validity
            .then((response) => response.data)
            .catch((response) => {
                const data = response.data;
                logService.error(`LangSelector failed to get langs! ${data}`);
                return $q.reject(data);
            });
    }
}
