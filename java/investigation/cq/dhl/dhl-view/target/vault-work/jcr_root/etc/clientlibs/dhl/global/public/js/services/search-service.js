define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ewfSearchService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('ewfSearchService', ewfSearchService);

    ewfSearchService.$inject = ['$http', '$q', 'logService'];

    function ewfSearchService($http, $q, logService) {

        return {
            plainSearch: plainSearch,
            typeAheadSearch: typeAheadSearch
        };

        function plainSearch(query, category) {
            return $http.get('/api/addressbook/contact/search/default/' + category + '?keyword=' + query).then(function (response) {
                logService.log(query, category, response.data);
                return response.data;
            })['catch'](function (response) {
                logService.error('can not access to address book', response.data);
                return $q.reject(response.data);
            });
        }

        function typeAheadSearch(query, category, queryParams) {
            var searchType = arguments.length <= 3 || arguments[3] === undefined ? 'default' : arguments[3];

            return $http.get('/api/addressbook/contact/search/' + searchType + '/typeahead/' + category + '/' + query + '?' + queryParams).then(function (response) {
                logService.log(response);
                return response.data;
            })['catch'](function (response) {
                logService.error('can not access to address book', response.data);
                return $q.reject(response.data);
            });
        }
    }
});
//# sourceMappingURL=search-service.js.map
