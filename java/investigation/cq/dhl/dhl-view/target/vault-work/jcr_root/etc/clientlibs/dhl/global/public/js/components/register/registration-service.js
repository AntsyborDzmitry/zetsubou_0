define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = RegistrationService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('registrationService', RegistrationService);

    RegistrationService.inject = ['$http', '$q', 'logService'];

    function RegistrationService($http, $q, logService) {
        var publicAPI = {
            verifyEmail: verifyEmail,
            registerNewUser: registerNewUser,
            renewExpiredActivationLink: renewExpiredActivationLink
        };

        //temporary method to work around true e-mail activation
        function verifyEmail(activationId) {
            return $http.get('/api/user/activate/' + activationId).then(function (data) {
                // TODO: check data
                logService.log('email verification done');
                return data;
            })['catch'](function (error) {
                // TODO: handle error codes from services differently
                logService.log('e-mail verification failed: ' + error);
                return $q.reject(error);
            });
        }

        function registerNewUser(newUser) {
            var user = Object.assign({}, newUser);
            user.userName = user.email;

            return $http.post('/api/user/signup', user).then(function (response) {
                // TODO: check that 'data' is valid
                logService.log('new user registered successfully');
                return response.data;
            })['catch'](function (response) {
                // TODO: handle error codes from services different
                logService.log('New user\'s registration failed! ' + response.data);
                return $q.reject(response.data);
            });
        }

        function renewExpiredActivationLink(expiredLink) {
            return $http.get('/api/user/activationEmail/renewExpired/' + expiredLink).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                return $q.reject(response);
            });
        }

        return publicAPI;
    }
});
//# sourceMappingURL=registration-service.js.map
