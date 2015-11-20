define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = userService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('userService', userService);

    userService.$inject = ['$http', '$q', 'logService', 'localStorageService'];

    function userService($http, $q, logService, localStorageService) {
        var publicAPI = {
            logIn: logIn,
            logOut: logOut,
            setUsername: setUsername,
            getUsername: getUsername,
            getPassword: getPassword,
            setPassword: setPassword,
            resendActivationEmail: resendActivationEmail,
            clearStoredCredentials: clearStoredCredentials,
            whoAmI: whoAmI,
            isAuthorized: isAuthorized,
            getUserCountry: getUserCountry
        };

        var whoAmIPromise = undefined;
        var userInfo = undefined;

        var storageKey = {
            username: 'dhlUsername',
            password: 'dhlPassword'
        };

        function logIn(username, password) {
            var credentials = {
                username: username,
                password: password
            };

            return $http.post('/api/auth/login', credentials).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                var data = response.data || {};
                var errors = data.errors || ['login.server_temporary_unavailable'];
                var errorMsg = 'ERROR: userService#logIn: ' + response.status + ' - ' + errors.join(',');
                logService.error(errorMsg);
                return $q.reject({ errors: errors });
            });
        }

        function logOut() {
            return $http.post('/api/auth/logout')['catch'](function (error) {
                logService.error('logoutRequest in userService failed' + error);
                return $q.reject(error.data);
            });
        }

        function resendActivationEmail(email) {
            return $http.post('/api/user/activationEmail/send', { username: email }).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                return $q.reject(response);
            });
        }

        function setUsername(username) {
            localStorageService.set(storageKey.username, username);
        }

        function getUsername() {
            return localStorageService.get(storageKey.username);
        }

        function setPassword(password) {
            localStorageService.set(storageKey.password, password);
        }

        function getPassword() {
            return localStorageService.get(storageKey.password);
        }

        function clearStoredCredentials() {
            localStorageService.remove(storageKey.password);
            localStorageService.remove(storageKey.username);
        }

        function whoAmI() {
            if (!whoAmIPromise) {
                whoAmIPromise = $http.get('/api/auth/whoami').then(function (response) {
                    userInfo = response.data;
                    return response.data;
                })['catch'](function (response) {
                    logService(response.data);
                    return $q.reject(response.data);
                });
            }
            return whoAmIPromise;
        }

        /**
         * Be careful, method 'isAuthorized' is synchronous
         * if you not sure in your code, please use whoAmI method
         */
        function isAuthorized() {
            if (userInfo) {
                return !userInfo.groups.includes('guest');
            }
            return false;
        }

        function getUserCountry() {
            if (userInfo) {
                return userInfo.countryCode2;
            }
            return 'US';
        }

        return publicAPI;
    }
});
//# sourceMappingURL=user-service.js.map
