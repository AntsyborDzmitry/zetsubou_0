import ewf from 'ewf';

ewf.service('contactMailingListsService', ContactMailingListsService);

ContactMailingListsService.$inject = ['$http', '$q', 'logService'];

export default function ContactMailingListsService($http, $q, logService) {
    return {
        getTypeaheadMailingLists
    };

    function getTypeaheadMailingLists() {
        return $http.get('/api/addressbook/mailingList/list')
            .then((response) => response.data)
            .catch((response) => {
                logService.error('can not get columns configuration');
                return $q.reject(response.data);
            });
    }
}
