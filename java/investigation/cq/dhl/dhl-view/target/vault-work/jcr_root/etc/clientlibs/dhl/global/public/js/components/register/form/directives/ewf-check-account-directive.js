define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = EwfCheckAccount;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('ewfCheckAccount', EwfCheckAccount);

    EwfCheckAccount.$inject = ['$http', 'navigationService', 'countryCodeConverter'];

    function EwfCheckAccount($http, navigationService, countryCodeConverter) {
        return {
            restrict: 'A',
            require: 'ewfInput',
            link: function link(scope, element, attrs, ctrl) {
                postLink(element, attrs, ctrl, $http, navigationService, countryCodeConverter);
            }
        };
    }

    function postLink(element, attrs, ewfInputController, $http, navigationService, countryCodeConverter) {
        element.bind('input', validateAccountToEsb);

        function validateAccountToEsb() {
            var ngModelCtrl = ewfInputController.ngModelCtrl;

            if (ngModelCtrl.$error.ewfValid) {
                return;
            }

            var fieldId = attrs.ewfInput.split('.')[1];
            var validationErrorKey = fieldId + 'A';
            var countryId = navigationService.getCountryLang().countryId;

            var isImp = attrs.ewfCheckAccount === 'IMP';
            var countryCode = countryCodeConverter.fromThreeLetterToCatalystFormat(countryId);
            var accountNumber = element.val();

            ngModelCtrl.$setValidity(validationErrorKey, false);

            $http.post('/api/user/validate/account', {
                isImp: isImp,
                countryCode: countryCode,
                accountNumber: accountNumber
            }).then(function (response) {
                if (!response.length) {
                    // TODO: check that it real success
                    ngModelCtrl.$setValidity(validationErrorKey, true);

                    ewfInputController.cleanErrorMessages();

                    return ngModelCtrl.$viewValue;
                }
            })
            // TODO: handle HTTP error like 500
            ['catch'](function () {
                ngModelCtrl.$setValidity(validationErrorKey, false);

                ewfInputController.removeSpecificErrorMessage('errors.account_is_incorrect');
                ewfInputController.addErrorMessage('errors.account_is_incorrect');

                return ngModelCtrl.$viewValue;
            });
        }
    }
});
//# sourceMappingURL=ewf-check-account-directive.js.map
