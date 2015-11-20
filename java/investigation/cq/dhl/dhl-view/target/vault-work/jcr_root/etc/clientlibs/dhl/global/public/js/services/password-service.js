define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = passwordService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('passwordService', passwordService);

    passwordService.$inject = ['$http', '$q', 'logService'];

    function passwordService($http, $q, logService) {
        this.sendResetPassword = sendResetPassword;
        this.resetPassword = resetPassword;
        this.validateResetToken = validateResetToken;
        this.resendPasswordResetEmail = resendPasswordResetEmail;
        this.createPassword = createPassword;
        this.validateCreateToken = validateCreateToken;
        this.resendPasswordCreateEmail = resendPasswordCreateEmail;
        this.changeExpiredPassword = changeExpiredPassword;

        // --- forgot password

        function sendResetPassword(email, captchaData) {
            var credentials = {
                captchaData: captchaData,
                email: email
            };

            return $http.post('/api/user/password/reset/send', credentials).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                if (response.data && response.data.errors) {
                    var errCode = response.data.errors[0];
                    return $q.reject(errCode);
                }
                return $q.reject('common.service_currently_unavailable');
            });
        }

        // --- reset password

        function resetPassword(token, newPassword) {
            var credentials = {
                token: token,
                newPassword: newPassword
            };

            return $http.post('/api/user/password/reset', credentials).then(function (response) {
                return response.data;
            });
        }

        function validateResetToken(token) {
            return $http.post('/api/user/password/reset/token/validate', { token: token }).then(function (response) {
                return response;
            })['catch'](function (err) {
                logService.log(err);
                return $q.reject(err);
            });
        }

        function resendPasswordResetEmail(expiredToken) {
            return $http.post('/api/user/password/reset/token/renew', { token: expiredToken }).then(function (response) {
                return response;
            })['catch'](function (err) {
                logService.log(err);
                return $q.reject(err);
            });
        }

        // --- create password

        function createPassword(token, password) {
            var credentials = {
                token: token,
                password: password
            };

            return $http.post('/api/user/password/create', credentials).then(function (response) {
                return response.data;
            });
        }

        function validateCreateToken(token) {
            return $http.post('/api/user/password/create/token/validate', { token: token }).then(function (response) {
                return response;
            })['catch'](function (err) {
                logService.log(err);
                return $q.reject(err);
            });
        }

        function resendPasswordCreateEmail(expiredToken) {
            return $http.post('/api/user/password/create/token/renew', { token: expiredToken }).then(function (response) {
                return response;
            })['catch'](function (err) {
                logService.log(err);
                return $q.reject(err);
            });
        }

        // --- change expired password

        function changeExpiredPassword(username, oldPassword, newPassword) {
            var credentials = {
                username: username,
                oldPassword: oldPassword,
                newPassword: newPassword
            };

            return $http.post('/api/user/password/changeExpired', credentials).then(function (response) {
                return response.data;
            })['catch'](function (err) {
                logService.log(err);
                return $q.reject(err);
            });
        }
    }
});
//# sourceMappingURL=password-service.js.map
