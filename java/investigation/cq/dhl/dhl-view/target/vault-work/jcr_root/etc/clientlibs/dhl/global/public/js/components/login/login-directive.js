define(['exports', 'ewf', './login-controller', '../../directives/validation/validated-email/validated-email-directive', '../../directives/ewf-click/ewf-click-directive', '../../directives/validation/validated-password/validated-password-directive', '../../directives/ewf-form/ewf-form-directive'], function (exports, _ewf, _loginController, _directivesValidationValidatedEmailValidatedEmailDirective, _directivesEwfClickEwfClickDirective, _directivesValidationValidatedPasswordValidatedPasswordDirective, _directivesEwfFormEwfFormDirective) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _LoginController = _interopRequireDefault(_loginController);

    _ewf2['default'].directive('ewfLogin', loginDirective);

    function loginDirective() {
        return {
            restrict: 'E',
            controller: _LoginController['default'],
            controllerAs: 'loginCtrl',
            require: ['ewfLogin', 'ewfForm'],
            template: '<form class=login id=home-login-form name=loginForm novalidate><div class=loginContainer_title><h5 nls={{loginCtrl.formTitle}} nls-bind></h5></div><div ewf-form-errors></div><div class=field-wrapper><a href=# class=help__link nls=login.send_new_activation_email ng-if=loginCtrl.userInactive ng-click=loginCtrl.resendActivationEmail()></a></div><div class=\"loginForm_emailContainer field-wrapper\"><label class=label for=lform_username><span nls=login.email_address_text_box_label></span> <a class=\"help after right\"><b nls=login.help_tooltip_title></b><div nls=login.help_tooltip_message></div></a></label> <input class=\"input input_width_full required\" id=lform_username name=lform_username type=email tabindex=1 ng-model=loginCtrl.username ng-model-options=\"{ updateOn: \'blur\'}\" validated-email> <span class=validation-mark></span><div ng-repeat=\"(key, value) in loginForm.lform_username.errorsMessages\"><span class=label-error ng-if=loginForm.lform_username.$error[key] nls={{value}}></span></div></div><div class=\"loginForm_passwordContainer field-wrapper\"><label class=label for=lform_password><span nls=login.password_text_box_label></span> <a href=forgot-password.html class=\"right fgtPswd\" nls=login.forgot_password_label></a></label> <input class=\"input input_width_full required\" id=lform_password name=lform_password type=password tabindex=2 ng-model=loginCtrl.password ng-model-options=\"{ updateOn: \'blur\'}\" validated-password> <span class=validation-mark></span><div ng-repeat=\"(key, value) in loginForm.lform_password.errorsMessages\"><span class=label-error ng-if=loginForm.lform_password.$error[key] nls={{value}}></span></div></div><div class=field-wrapper><label class=\"login__remember checkbox checkbox_small left\"><input id=remember_me_checkbox type=checkbox value=checkbox class=checkbox__input data-aqa-id=remember_me_checkbox ng-model=loginCtrl.rememberMe> <span class=label><span nls=login.remember_me_checkbox_label></span> <a class=info><div nls=login.remember_me_tooltip_message></div></a></span></label> <button class=\"btn btn_small right\" tabindex=3 ng-value=Submit ewf-click=loginCtrl.logIn(loginForm)><span nls=login.submit_button_label></span></button></div></form>',
            link: {
                post: function post(scope, element, attrs, controllers) {
                    var _controllers = _slicedToArray(controllers, 2);

                    var loginCtrl = _controllers[0];
                    var ewfFormCtrl = _controllers[1];

                    loginCtrl.ewfFormCtrl = ewfFormCtrl;
                    loginCtrl.formTitle = attrs.loginTitle;
                }
            }
        };
    }
});
//# sourceMappingURL=login-directive.js.map
