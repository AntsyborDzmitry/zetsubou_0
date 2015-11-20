import ewf from 'ewf';
import EwfPasswordController from './ewf-password-controller';
import './../ewf-input-password/ewf-input-password-directive';
import './ewf-validate-password-equality-directive';

ewf.directive('ewfPassword', function() {
    return {

        /**
         * Using "AE" here because of IE8. ewf-password directive is used
         * in another directive in a ng-if conditional block - in this case
         * we need to use directive as an attribute.
         */
        restrict: 'AE',
        require: ['ewfPassword', 'ngModel', '^form'],
        controller: EwfPasswordController,
        controllerAs: 'ewfPasswordCtrl',
        templateUrl: 'ewf-password-layout.html',
        link: {
            pre: preLink,
            post: postLink
        }
    };

    function preLink(scope, elm, attrs, ctrl) {
        const ewfPasswordCtrl = ctrl[0];
        ewfPasswordCtrl.formName = attrs.ewfFormName;
    }

    function postLink(scope, elm, attrs, ctrl) {
        const [ewfPasswordCtrl, modelCtrl, formCtrl] = ctrl;
        ewfPasswordCtrl.parentForm = formCtrl;

        scope.$watch(function() {
            return ewfPasswordCtrl.password;
        }, function(newValue) {
            modelCtrl.$setViewValue(newValue);
        });
    }
});
