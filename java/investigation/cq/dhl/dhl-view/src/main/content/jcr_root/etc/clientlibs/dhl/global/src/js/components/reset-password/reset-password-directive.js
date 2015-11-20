import ewf from 'ewf';
import ResetPasswordController from './reset-password-controller';
import '../../directives/ewf-password/ewf-password-directive';
import '../../directives/ewf-input/ewf-input-directive';
import '../../directives/ewf-form/ewf-form-directive';
import '../../directives/validation/validated-password/validated-password-directive';

ewf.directive('resetPassword', resetPasswordDirective);

function resetPasswordDirective() {
    return {
        restrict: 'E',
        controller: ResetPasswordController,
        controllerAs: 'resetPasswordCtrl',
        templateUrl: 'reset-password-layout.html'
    };
}
