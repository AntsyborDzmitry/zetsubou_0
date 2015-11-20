import ewf from 'ewf';
import ForgotPasswordController from './forgot-password-controller';
import '../../directives/validation/validated-email/validated-email-directive';
import '../../directives/ewf-click/ewf-click-directive';

ewf.directive('forgotPassword', forgotPasswordDirective);

function forgotPasswordDirective() {
   return {
       restrict: 'E',
       controller: ForgotPasswordController,
       controllerAs: 'forgotPasswordCtrl',
       templateUrl: 'forgot-password-layout.html'
   };
}
