import ewf from 'ewf';
import './../../../../directives/ewf-form/ewf-form-directive';

ewf.directive('reApplyRules', reApplyRules);

function reApplyRules() {
    return {
        restrict: 'A',
        require: ['^ewfForm', 'ngModel'],
        link: function(scope, element, attributes, ctrls) {
            const [ewfFormController, ngModelCtrl] = ctrls;

            function reApplyRulesCallBack(countryCode) {
                if (countryCode) {
                    const codeValue = countryCode.value;
                    if (codeValue !== undefined && codeValue !== '') {
                        ewfFormController.reApplyVisibilityRules(codeValue);
                        return countryCode;
                    }
                }
            }

            ngModelCtrl.$parsers.push(reApplyRulesCallBack);

            ngModelCtrl.$formatters.push(reApplyRulesCallBack);
        }
    };
}
