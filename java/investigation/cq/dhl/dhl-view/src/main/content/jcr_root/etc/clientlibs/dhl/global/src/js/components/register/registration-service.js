import ewf from 'ewf';

ewf.service('registrationService', RegistrationService);

RegistrationService.inject = ['$http', '$q', 'logService'];

export default function RegistrationService($http, $q, logService) {
    const publicAPI = {
        verifyEmail,
        registerNewUser,
        renewExpiredActivationLink
    };

    //temporary method to work around true e-mail activation
    function verifyEmail(activationId) {
        return $http.get(`/api/user/activate/${activationId}`)
            .then((data) => {
                // TODO: check data
                logService.log('email verification done');
                return data;
            })
            .catch((error) => {
                // TODO: handle error codes from services differently
                logService.log('e-mail verification failed: ' + error);
                return $q.reject(error);
            });
    }

    function registerNewUser(newUser) {
        const user = Object.assign({}, newUser);
        user.userName = user.email;

        return $http.post('/api/user/signup', user)
            .then((response) => {
                // TODO: check that 'data' is valid
                logService.log('new user registered successfully');
                return response.data;
            })
            .catch((response) => {
                // TODO: handle error codes from services different
                logService.log('New user\'s registration failed! ' + response.data);
                return $q.reject(response.data);
            });
    }

    function renewExpiredActivationLink(expiredLink) {
        return $http.get(`/api/user/activationEmail/renewExpired/${expiredLink}`)
            .then((response) => response.data)
            .catch((response) => $q.reject(response));
    }

    return publicAPI;
}
