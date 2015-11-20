define(['exports', 'ewf', './form/form-directive', './result/result-directive', './verification/email-verification-directive', 'directives/ewf-form/ewf-form-directive', './registration-controller'], function (exports, _ewf, _formFormDirective, _resultResultDirective, _verificationEmailVerificationDirective, _directivesEwfFormEwfFormDirective, _registrationController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _RegistrationController = _interopRequireDefault(_registrationController);

    _ewf2['default'].directive('ewfRegistration', registrationDirective);

    function registrationDirective() {
        return {
            restrict: 'E',
            controller: _RegistrationController['default'],
            controllerAs: 'registration',
            template: '<div ng-switch=registration.currentStep><registration-form ng-switch-when=form ewf-form=registration></registration-form><registration-result ng-switch-when=result></registration-result><email-verification ng-switch-when=verification></email-verification></div>'
        };
    }
});
//# sourceMappingURL=registration-directive.js.map
