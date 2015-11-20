import ewf from 'ewf';

ewf.directive('ewfShowValidationInfo', ewfShowValidationInfo);

export default function ewfShowValidationInfo() {
    return {
        restrict: 'A',
        link: {
            post: postLink
        }
    };

    function postLink(scope, element) {
        const ewfInputPasswordCtrl = scope.ewfInputPasswordCtrl;
        const vldInfo = scope.errorMessage;
        const validationMessages = ewfInputPasswordCtrl.validationErrorMessage[ewfInputPasswordCtrl.fieldName];

        vldInfo.isRuleValid = ewfInputPasswordCtrl.validateRule(
            vldInfo.viewValue,
            vldInfo.functionName,
            vldInfo.validateParams
        );

        if (vldInfo.isRuleValid) {
            element.addClass('ewf-complete-ver-info');
        } else {
            element.removeClass('ewf-complete-ver-info');
        }

        const rules = Object.keys(validationMessages);
        let validationFinished = false;
        for (let rule of rules) {
            for (let someItem of validationMessages[rule]) {
                ewfInputPasswordCtrl.validationIsVisible = !someItem.isRuleValid;
                if (ewfInputPasswordCtrl.validationIsVisible) {
                    validationFinished = true;
                    break;
                }
            }
            if (validationFinished) {
                break;
            }
        }
    }
}
