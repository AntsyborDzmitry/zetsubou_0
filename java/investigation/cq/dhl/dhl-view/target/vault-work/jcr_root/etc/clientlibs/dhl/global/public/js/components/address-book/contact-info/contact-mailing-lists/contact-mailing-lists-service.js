define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ContactMailingListsService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('contactMailingListsService', ContactMailingListsService);

    ContactMailingListsService.$inject = ['$http', '$q', 'logService'];

    function ContactMailingListsService($http, $q, logService) {
        return {
            getTypeaheadMailingLists: getTypeaheadMailingLists
        };

        function getTypeaheadMailingLists() {
            return $http.get('/api/addressbook/mailingList/list').then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('can not get columns configuration');
                return $q.reject(response.data);
            });
        }
    }
});
//# sourceMappingURL=contact-mailing-lists-service.js.map
