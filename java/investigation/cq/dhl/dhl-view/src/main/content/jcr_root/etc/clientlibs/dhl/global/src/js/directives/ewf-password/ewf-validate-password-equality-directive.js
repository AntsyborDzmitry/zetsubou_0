import ewf from 'ewf';

ewf.directive('ewfValidatePasswordEquality', EwfValidatePasswordEquality);

export default function EwfValidatePasswordEquality() {
    return {
        restrict: 'A',
        require: ['ewfInput', 'ngModel'],
        link: {
            post: postLink
        }
    };

    function postLink(scope, element, attrs, controllers) {
        const [inputCtrl, ngModelCtrl] = controllers;

        const equalityInfo = scope.$eval(attrs.ewfValidatePasswordEquality);
        const passwordField = equalityInfo.passwordField;
        const operation = equalityInfo.operation || 'matches';
        const errorMessage = equalityInfo.errorMessage;

        const testEquality = operation === 'matches' ? testMatches : testDiffers;

        scope.$watch(() => {
            const evalResult = scope.$eval(passwordField);
            return [evalResult, ngModelCtrl.$viewValue];
        }, (values) => {
            const [passwordInputText, equalityPasswordInputText] = values;

            let equality = true;
            if (passwordInputText && equalityPasswordInputText) {
                equality = testEquality(passwordInputText, equalityPasswordInputText) ||
                    !!inputCtrl.addErrorMessage(errorMessage);
            }
            ngModelCtrl.$setValidity(operation, equality);
        }, true);
    }

    function testMatches(firstValue, secondValue) {
        return firstValue === secondValue;
    }

    function testDiffers(firstValue, secondValue) {
        return firstValue !== secondValue;
    }
}
