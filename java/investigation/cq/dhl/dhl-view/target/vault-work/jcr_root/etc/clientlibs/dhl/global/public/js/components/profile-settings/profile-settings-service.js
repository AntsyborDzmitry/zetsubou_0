define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ProfileSettingsService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('profileSettingsService', ProfileSettingsService);

    ProfileSettingsService.$inject = ['$http', '$q', 'logService'];

    function ProfileSettingsService($http, $q, logService) {

        var QUICK_LINKS_ENDPOINT = '/api/myprofile/links';
        var WHO_AM_I_ENDPOINT = '/api/auth/whoami';
        var CHANGE_PASSWORD_ENDPOINT = '/api/myprofile/password/change';
        var publicApi = {
            getAuthenticationDetails: getAuthenticationDetails,
            updateProfilePassword: updateProfilePassword,
            getQuickLinks: getQuickLinks
        };

        function getAuthenticationDetails() {
            return $http.get(WHO_AM_I_ENDPOINT).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('can not access to endpoint: ' + WHO_AM_I_ENDPOINT);
                return $q.reject(response.data);
            });
        }

        function updateProfilePassword(password) {
            return $http.post(CHANGE_PASSWORD_ENDPOINT, password).then(function (response) {
                logService.log('password updated successfully');
                return response.data;
            })['catch'](function (response) {
                logService.log('password was not updated ' + response.data);
                return $q.reject(response.data);
            });
        }

        function getQuickLinks() {
            return $http.get(QUICK_LINKS_ENDPOINT).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('can not access to endpoint: ' + QUICK_LINKS_ENDPOINT);
                return $q.reject(response.data);
            });
        }

        return publicApi;
    }
});
//# sourceMappingURL=profile-settings-service.js.map
