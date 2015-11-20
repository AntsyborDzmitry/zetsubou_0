define(['exports', 'ewf', './reset-password-controller', '../../directives/ewf-password/ewf-password-directive', '../../directives/ewf-input/ewf-input-directive', '../../directives/ewf-form/ewf-form-directive', '../../directives/validation/validated-password/validated-password-directive'], function (exports, _ewf, _resetPasswordController, _directivesEwfPasswordEwfPasswordDirective, _directivesEwfInputEwfInputDirective, _directivesEwfFormEwfFormDirective, _directivesValidationValidatedPasswordValidatedPasswordDirective) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ResetPasswordController = _interopRequireDefault(_resetPasswordController);

    _ewf2['default'].directive('resetPassword', resetPasswordDirective);

    function resetPasswordDirective() {
        return {
            restrict: 'E',
            controller: _ResetPasswordController['default'],
            controllerAs: 'resetPasswordCtrl',
            template: '<div class=main><div class=container ewf-form=registration name=registration><div ng-if=ewfFormCtrl.rulesObtained><form name=resetPasswordForm ng-if=\"resetPasswordCtrl.isTokenValidAndNotExpired() || resetPasswordCtrl.scenario === \'change\'\" ng-submit=resetPasswordForm.$valid ng-class=\"{submited: resetPasswordCtrl.submitted}\"><div class=area ng-switch=resetPasswordCtrl.scenario><div ng-repeat=\"error in resetPasswordCtrl.errors\"><span nls={{error}}></span></div><div class=overlay-grey><div class=col-5 ng-if=resetPasswordCtrl.tokenValidation ng-switch-when=reset><h2 class=\"area-title h4\" nls=resetpassword.reset_password_title></h2><p nls=resetpassword.reset_password_process_description></p><ewf-password ewf-form-name=registration ng-model=resetPasswordCtrl.password></ewf-password><button class=\"btn btn_success\" type=submit nls=resetpassword.reset_password_action ng-click=\"resetPasswordCtrl.validateResetForm(resetPasswordForm) && resetPasswordCtrl.resetPassword()\"></button></div><div class=col-5 ng-if=resetPasswordCtrl.tokenValidation ng-switch-when=create><h2 class=\"area-title h4\" nls=resetpassword.create_password_title></h2><p nls=resetpassword.create_password_process_description></p><ewf-password ewf-form-name=registration ng-model=resetPasswordCtrl.password></ewf-password><button class=\"btn btn_success\" type=submit nls=resetpassword.create_password_action ng-click=\"resetPasswordCtrl.validateResetForm(resetPasswordForm) && resetPasswordCtrl.createPassword()\"></button></div><div class=col-5 ng-switch-when=change><h2 class=\"area-title h4\" nls=resetpassword.change_password_title></h2><p nls=resetpassword.change_password_process_description></p><ewf-password ewf-form-name=registration ng-model=resetPasswordCtrl.password></ewf-password><button class=\"btn btn_success\" type=submit nls=resetpassword.change_password_action ng-click=\"resetPasswordCtrl.validateResetForm(resetPasswordForm) && resetPasswordCtrl.changePassword()\"></button></div></div></div></form><div class=token-expired ng-if=\"resetPasswordCtrl.tokenExpired && resetPasswordCtrl.scenario === \'reset\'\"><div class=area><div class=overlay-grey><h2 class=\"area-title h4\" nls=resetpassword.reset_password_link_expired_title></h2><p nls=resetpassword.reset_password_link_expired_description></p><button class=\"btn btn_success\" ng-click=resetPasswordCtrl.resendPasswordResetEmail() nls=resetpassword.reset_password_link_expired_action></button></div></div></div><div class=token-expired ng-if=\"resetPasswordCtrl.tokenExpired && resetPasswordCtrl.scenario === \'create\'\"><div class=area><div class=overlay-grey><h2 class=\"area-title h4\" nls=resetpassword.create_password_link_expired_title></h2><p nls=resetpassword.create_password_link_expired_description></p><button class=\"btn btn_success\" ng-click=resetPasswordCtrl.resendPasswordCreateEmail() nls=resetpassword.create_password_link_expired_action></button></div></div></div></div></div></div>'
        };
    }
});
//# sourceMappingURL=reset-password-directive.js.map
