import ewf from 'ewf';

ewf.service('ewfSearchService', ewfSearchService);

ewfSearchService.$inject = ['$http', '$q', 'logService'];

export default function ewfSearchService($http, $q, logService) {

    return {
        plainSearch,
        typeAheadSearch
    };

    function plainSearch(query, category) {
        return $http.get(`/api/addressbook/contact/search/default/${category}?keyword=${query}`)
            .then((response) => {
                logService.log(query, category, response.data);
                return response.data;
            })
            .catch((response) => {
                logService.error('can not access to address book', response.data);
                return $q.reject(response.data);
            });
    }

    function typeAheadSearch(query, category, queryParams, searchType = 'default') {
         return $http.get(`/api/addressbook/contact/search/${searchType}/typeahead/${category}/${query}?${queryParams}`)
            .then((response) => {
                logService.log(response);
                return response.data;
            })
            .catch((response) => {
                logService.error('can not access to address book', response.data);
                return $q.reject(response.data);
            });
    }
}
