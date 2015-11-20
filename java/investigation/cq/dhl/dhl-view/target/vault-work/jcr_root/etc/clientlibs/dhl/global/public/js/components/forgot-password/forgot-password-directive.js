define(['exports', 'ewf', './forgot-password-controller', '../../directives/validation/validated-email/validated-email-directive', '../../directives/ewf-click/ewf-click-directive'], function (exports, _ewf, _forgotPasswordController, _directivesValidationValidatedEmailValidatedEmailDirective, _directivesEwfClickEwfClickDirective) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _ForgotPasswordController = _interopRequireDefault(_forgotPasswordController);

    _ewf2['default'].directive('forgotPassword', forgotPasswordDirective);

    function forgotPasswordDirective() {
        return {
            restrict: 'E',
            controller: _ForgotPasswordController['default'],
            controllerAs: 'forgotPasswordCtrl',
            template: '<div class=main><div class=area__background></div><div class=container><div class=\"col-8 darker\"><form class=forgot-password name=forgotPasswordForm ng-submit=forgotPasswordForm.$valid novalidate><div ng-if=!forgotPasswordCtrl.isOnWay><h1 class=forgot-password_title nls=forgotpassword.title></h1><div class=msg-error ng-if=forgotPasswordCtrl.error nls={{forgotPasswordCtrl.error}} nls-bind></div><div class=form-row><div class=field-wrapper><div class=col-8><label class=label for=emailAddress><span nls=forgotpassword.email_address_title></span></label> <input class=\"input input_width_full required\" id=emailAddress name=emailAddress ng-model-options=\"{ updateOn: \'blur\'}\" ng-model=forgotPasswordCtrl.email type=email validated-email> <span class=validation-mark></span><div ng-repeat=\"(key, value) in forgotPasswordForm.emailAddress.errorsMessages\"><span class=label-error ng-if=forgotPasswordForm.emailAddress.$error[key] nls={{value}}></span></div></div></div></div><div class=form-row><div class=field-wrapper><div ewf-field=captcha><div captcha id=forgotpassword-captcha options=forgotPasswordCtrl.captchaOptions></div><div ewf-field-errors></div></div></div></div><div class=form-row><div class=field-wrapper><button class=\"btn btn_success btn_regular\" ewf-click=forgotPasswordCtrl.sendResetPassword(forgotPasswordForm.emailAddress.$error)><span nls=forgotpassword.submit_button></span></button> <a href=# class=btn ng-click=forgotPasswordCtrl.redirectToLoginPage()><span nls=forgotpassword.cancel_button></span></a></div></div></div><div ng-if=forgotPasswordCtrl.isOnWay><h5 nls=forgotpassword.email_on_its_way_title></h5><div nls=forgotpassword.email_on_its_way_text></div><div nls=forgotpassword.email_on_its_way_instructions></div><button ng-value=Submit class=\"btn btn_small right\" ng-click=forgotPasswordCtrl.redirectToLoginPage()><span nls=forgotpassword.email_on_its_way_continue_button></span></button></div></form></div></div></div>'
        };
    }
});
//# sourceMappingURL=forgot-password-directive.js.map
