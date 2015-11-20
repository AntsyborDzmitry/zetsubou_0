import ewf from 'ewf';

ewf.directive('ewfCheckAccount', EwfCheckAccount);

EwfCheckAccount.$inject = ['$http', 'navigationService', 'countryCodeConverter'];

export default function EwfCheckAccount($http, navigationService, countryCodeConverter) {
    return {
        restrict: 'A',
        require: 'ewfInput',
        link: (scope, element, attrs, ctrl) => {
            postLink(element, attrs, ctrl, $http, navigationService, countryCodeConverter);
        }
    };
}

function postLink(element, attrs, ewfInputController, $http, navigationService, countryCodeConverter) {
    element.bind('input', validateAccountToEsb);

    function validateAccountToEsb() {
        const ngModelCtrl = ewfInputController.ngModelCtrl;

        if (ngModelCtrl.$error.ewfValid) {
            return;
        }

        const fieldId = attrs.ewfInput.split('.')[1];
        const validationErrorKey = `${fieldId}A`;
        const countryId = navigationService.getCountryLang().countryId;

        const isImp = attrs.ewfCheckAccount === 'IMP';
        const countryCode = countryCodeConverter.fromThreeLetterToCatalystFormat(countryId);
        const accountNumber = element.val();

        ngModelCtrl.$setValidity(validationErrorKey, false);

        $http.post('/api/user/validate/account', {
            isImp,
            countryCode,
            accountNumber
        })
        .then((response) => {
            if (!response.length) {
                // TODO: check that it real success
                ngModelCtrl.$setValidity(validationErrorKey, true);

                ewfInputController.cleanErrorMessages();

                return ngModelCtrl.$viewValue;
            }
        })
        // TODO: handle HTTP error like 500
        .catch(() => {
            ngModelCtrl.$setValidity(validationErrorKey, false);

            ewfInputController.removeSpecificErrorMessage('errors.account_is_incorrect');
            ewfInputController.addErrorMessage('errors.account_is_incorrect');

            return ngModelCtrl.$viewValue;
        });
    }
}
