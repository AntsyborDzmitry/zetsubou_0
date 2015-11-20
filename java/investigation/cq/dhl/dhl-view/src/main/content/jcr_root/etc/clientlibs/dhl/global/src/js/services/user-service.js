import ewf from 'ewf';

ewf.service('userService', userService);

userService.$inject = ['$http', '$q', 'logService', 'localStorageService'];

export default function userService($http, $q, logService, localStorageService) {
    const publicAPI = {
        logIn,
        logOut,
        setUsername,
        getUsername,
        getPassword,
        setPassword,
        resendActivationEmail,
        clearStoredCredentials,
        whoAmI,
        isAuthorized,
        getUserCountry
    };

    let whoAmIPromise;
    let userInfo;

    const storageKey = {
        username: 'dhlUsername',
        password: 'dhlPassword'
    };

    function logIn(username, password) {
        const credentials = {
            username,
            password
        };

        return $http.post('/api/auth/login', credentials)
            .then((response) => response.data)
            .catch((response) => {
                const data = response.data || {};
                const errors = data.errors || ['login.server_temporary_unavailable'];
                const errorMsg = 'ERROR: userService#logIn: '
                    + response.status + ' - '
                    + errors.join(',');
                logService.error(errorMsg);
                return $q.reject({errors});
            });
    }

    function logOut() {
        return $http.post('/api/auth/logout')
            .catch((error) => {
                logService.error('logoutRequest in userService failed' + error);
                return $q.reject(error.data);
            });
    }

    function resendActivationEmail(email) {
        return $http.post('/api/user/activationEmail/send', {username: email})
            .then((response) => response.data)
            .catch((response) => {
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
            whoAmIPromise = $http.get('/api/auth/whoami')
                .then((response) => {
                    userInfo = response.data;
                    return response.data;
                })
                .catch((response) => {
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
