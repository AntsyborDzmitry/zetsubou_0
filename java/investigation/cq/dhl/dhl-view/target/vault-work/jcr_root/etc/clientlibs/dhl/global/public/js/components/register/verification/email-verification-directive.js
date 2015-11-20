define(['exports', 'module', 'ewf', './verification-controller'], function (exports, module, _ewf, _verificationController) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = EmailVerification;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EmailVerificationController = _interopRequireDefault(_verificationController);

    _ewf2['default'].directive('emailVerification', EmailVerification);

    function EmailVerification() {
        return {
            restrict: 'E',
            controller: _EmailVerificationController['default'],
            controllerAs: 'verificationController',
            require: ['^ewfRegistration', 'emailVerification'],
            template: '<div class=container><div class=area><div ng-if=verificationController.verified><h1 nls=registration.email_address_verification_title></h1><div><p nls=registration.email_address_verification_success_msg></p></div></div><div ng-if=verificationController.invalid><h1 nls-bind nls={{verificationController.failMessageTranslationKey}}></h1><div ng-if=verificationController.expired><p nls=registration.email_address_verification_expired_msg_first_line></p><p nls=registration.email_address_verification_expired_msg_second_line></p><button class=\"btn btn_success\" ng-click=verificationController.renewExpiredActivationLink() nls=registration.email_address_verification_expired_renew_btn></button></div></div></div></div>',
            link: {
                pre: preLink
            }
        };
    }

    function preLink(scope, element, attrs, controllers) {
        var _controllers = _slicedToArray(controllers, 2);

        var registrationController = _controllers[0];
        var verificationController = _controllers[1];

        verificationController.setRegistrationController(registrationController);
    }
});
//# sourceMappingURL=email-verification-directive.js.map
