import ewf from 'ewf';

ewf.service('passwordService', passwordService);

passwordService.$inject = ['$http', '$q', 'logService'];

export default function passwordService($http, $q, logService) {
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
        const credentials = {
            captchaData,
            email
        };

        return $http.post('/api/user/password/reset/send', credentials)
            .then((response) => response.data)
            .catch((response) => {
                if (response.data && response.data.errors) {
                    const errCode = response.data.errors[0];
                    return $q.reject(errCode);
                }
                return $q.reject('common.service_currently_unavailable');
            });
    }

    // --- reset password

    function resetPassword(token, newPassword) {
        const credentials = {
            token,
            newPassword
        };

        return $http.post('/api/user/password/reset', credentials)
            .then((response) => response.data);
    }

    function validateResetToken(token) {
        return $http.post('/api/user/password/reset/token/validate', {token})
            .then((response) => response)
            .catch((err) => {
                logService.log(err);
                return $q.reject(err);
            });
    }

    function resendPasswordResetEmail(expiredToken) {
        return $http.post('/api/user/password/reset/token/renew', {token: expiredToken})
            .then((response) => response)
            .catch((err) => {
                logService.log(err);
                return $q.reject(err);
            });
    }

    // --- create password

    function createPassword(token, password) {
        const credentials = {
            token,
            password
        };

        return $http.post('/api/user/password/create', credentials)
            .then((response) => response.data);
    }

    function validateCreateToken(token) {
        return $http.post('/api/user/password/create/token/validate', {token})
            .then((response) => response)
            .catch((err) => {
                logService.log(err);
                return $q.reject(err);
            });
    }

    function resendPasswordCreateEmail(expiredToken) {
        return $http.post('/api/user/password/create/token/renew', {token: expiredToken})
            .then((response) => response)
            .catch((err) => {
                logService.log(err);
                return $q.reject(err);
            });
    }

    // --- change expired password

    function changeExpiredPassword(username, oldPassword, newPassword) {
        const credentials = {
            username,
            oldPassword,
            newPassword
        };

        return $http.post('/api/user/password/changeExpired', credentials)
            .then((response) => response.data)
            .catch((err) => {
                logService.log(err);
                return $q.reject(err);
            });
    }
}
