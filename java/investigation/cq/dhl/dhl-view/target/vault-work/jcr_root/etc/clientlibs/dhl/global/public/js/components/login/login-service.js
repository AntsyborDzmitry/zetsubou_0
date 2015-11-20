define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = loginService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('loginService', loginService);

    loginService.$inject = ['localStorageService'];

    function loginService(localStorageService) {
        var nextFormTitleStorageKey = 'login.next_form_title';
        var loginActivationDaysLimit = 3;

        this.titles = {
            DEFAULT: 'login.form_title_default',
            LOGGED_OUT: 'login.form_title_logged_out',
            SESSION_TIMED_OUT: 'login.form_title_session_timed_out',
            ACTIVATION_EMAIL_SENT: 'login.activation_email_sent',
            ACTIVATION_EMAIL_EXPIRED: 'login.activation_email_expired'
        };

        this.errorKeys = {
            PASSWORD_EXPIRED: 'login.password_expired',
            PENDING_ACTIVATION: 'login.pending_activation',
            PENDING_ACTIVATION_EXPIRED: 'login.pending_activation_expired'
        };

        this.saveNextFormTitle = function (title) {
            localStorageService.set(nextFormTitleStorageKey, title);
        };

        this.getNextFormTitle = function () {
            var title = localStorageService.get(nextFormTitleStorageKey);
            localStorageService.remove(nextFormTitleStorageKey);
            return title;
        };

        this.resolveFormTitle = function () {
            return this.getNextFormTitle() || this.titles.DEFAULT;
        };

        this.isPasswordExpired = function (errors) {
            return errors.includes(this.errorKeys.PASSWORD_EXPIRED);
        };

        this.isUserInactive = function (errors) {
            return errors.includes(this.errorKeys.PENDING_ACTIVATION);
        };

        this.isUserInactiveAndActivationExpired = function (errors) {
            return errors.includes(this.errorKeys.PENDING_ACTIVATION_EXPIRED);
        };

        this.getLoginActivationDaysLimit = function () {
            return loginActivationDaysLimit;
        }; //TODO: replace hardcoded value to real BE call
    }
});
//# sourceMappingURL=login-service.js.map
