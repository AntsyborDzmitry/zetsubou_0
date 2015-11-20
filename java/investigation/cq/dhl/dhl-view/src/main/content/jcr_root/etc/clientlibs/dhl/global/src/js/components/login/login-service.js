import ewf from 'ewf';

ewf.service('loginService', loginService);

loginService.$inject = ['localStorageService'];

export default function loginService(localStorageService) {
    const nextFormTitleStorageKey = 'login.next_form_title';
    const loginActivationDaysLimit = 3;

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

    this.saveNextFormTitle = function(title) {
        localStorageService.set(nextFormTitleStorageKey, title);
    };

    this.getNextFormTitle = function() {
        const title = localStorageService.get(nextFormTitleStorageKey);
        localStorageService.remove(nextFormTitleStorageKey);
        return title;
    };

    this.resolveFormTitle = function() {
        return this.getNextFormTitle() || this.titles.DEFAULT;
    };

    this.isPasswordExpired = function(errors) {
        return errors.includes(this.errorKeys.PASSWORD_EXPIRED);
    };

    this.isUserInactive = function(errors) {
        return errors.includes(this.errorKeys.PENDING_ACTIVATION);
    };

    this.isUserInactiveAndActivationExpired = function(errors) {
        return errors.includes(this.errorKeys.PENDING_ACTIVATION_EXPIRED);
    };

    this.getLoginActivationDaysLimit = () => loginActivationDaysLimit; //TODO: replace hardcoded value to real BE call
}
