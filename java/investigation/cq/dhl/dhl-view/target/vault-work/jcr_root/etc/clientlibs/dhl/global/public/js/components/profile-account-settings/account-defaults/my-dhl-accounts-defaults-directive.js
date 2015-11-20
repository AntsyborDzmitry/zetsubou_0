define(['exports', 'ewf', './../../register/form/directives/ewf-check-account-directive', './../../../directives/ewf-form/ewf-form-directive', './../../../directives/ewf-validate/ewf-validate-dhl-account', './my-dhl-accounts-defaults-controller'], function (exports, _ewf, _registerFormDirectivesEwfCheckAccountDirective, _directivesEwfFormEwfFormDirective, _directivesEwfValidateEwfValidateDhlAccount, _myDhlAccountsDefaultsController) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _MyDhlAccountsDefaultsController = _interopRequireDefault(_myDhlAccountsDefaultsController);

    _ewf2['default'].directive('myDhlAccountsDefaults', function () {
        return {
            restrict: 'AE',
            controller: _MyDhlAccountsDefaultsController['default'],
            controllerAs: 'paymentDefaultsController'
        };
    });
});
//# sourceMappingURL=my-dhl-accounts-defaults-directive.js.map
