import ewf from 'ewf';

ewf.service('profileSettingsService', ProfileSettingsService);

ProfileSettingsService.$inject = [
    '$http',
    '$q',
    'logService'];

export default function ProfileSettingsService(
    $http,
    $q,
    logService) {

    const QUICK_LINKS_ENDPOINT = '/api/myprofile/links';
    const WHO_AM_I_ENDPOINT = '/api/auth/whoami';
    const CHANGE_PASSWORD_ENDPOINT = '/api/myprofile/password/change';
    const publicApi = {
        getAuthenticationDetails,
        updateProfilePassword,
        getQuickLinks
    };

    function getAuthenticationDetails() {
        return $http.get(WHO_AM_I_ENDPOINT)
            .then((response) => response.data)
            .catch((response) => {
                logService.error(`can not access to endpoint: ${WHO_AM_I_ENDPOINT}`);
                return $q.reject(response.data);
            });
    }

    function updateProfilePassword(password) {
        return $http.post(CHANGE_PASSWORD_ENDPOINT, password)
            .then((response) => {
                logService.log('password updated successfully');
                return response.data;
            })
            .catch((response) => {
                logService.log(`password was not updated ${response.data}`);
                return $q.reject(response.data);
            });
    }

    function getQuickLinks() {
        return $http.get(QUICK_LINKS_ENDPOINT)
            .then((response) => response.data)
            .catch((response) => {
                logService.error(`can not access to endpoint: ${QUICK_LINKS_ENDPOINT}`);
                return $q.reject(response.data);
            });
    }

    return publicApi;
}
