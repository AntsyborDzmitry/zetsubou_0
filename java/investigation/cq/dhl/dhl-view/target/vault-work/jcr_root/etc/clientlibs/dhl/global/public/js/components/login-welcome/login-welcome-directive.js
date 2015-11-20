define(['exports', 'ewf', './login-welcome-controller'], function (exports, _ewf, _loginWelcomeController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _LoginWelcomeController = _interopRequireDefault(_loginWelcomeController);

    _ewf2['default'].directive('ewfLoginWelcome', loginWelcomeDirective);

    function loginWelcomeDirective() {
        return {
            restrict: 'E',
            controller: _LoginWelcomeController['default'],
            controllerAs: 'loginWelcomeCtrl',
            template: '<div class=\"darker log__welcome\"><h1 class=log__header nls=login.welcome_message></h1><span class=log__label nls=login.dhl_description_message></span><div class=\"row log__help\"><div class=log__item><span nls=login.not_registered_question></span> <a href=# class=help__link nls=login.register_now_link ng-click=loginWelcomeCtrl.goToRegistration()></a> <a href=# class=help__link ng-click=loginWelcomeCtrl.openRegistrationBenefitsPopup() nls=login.learn_more_message></a> <span nls=login.or></span> <a href=# class=help__link nls=login.continue_as_guest_message></a></div></div></div>'
        };
    }
});
//# sourceMappingURL=login-welcome-directive.js.map
