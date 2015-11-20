import ewf from 'ewf';
import LoginController from './login-controller';
import '../../directives/validation/validated-email/validated-email-directive';
import '../../directives/ewf-click/ewf-click-directive';
import '../../directives/validation/validated-password/validated-password-directive';
import '../../directives/ewf-form/ewf-form-directive';

ewf.directive('ewfLogin', loginDirective);

function loginDirective() {
   return {
       restrict: 'E',
       controller: LoginController,
       controllerAs: 'loginCtrl',
       require: ['ewfLogin', 'ewfForm'],
       templateUrl: 'login-layout.html',
       link: {
           post: function(scope, element, attrs, controllers) {
               const [loginCtrl, ewfFormCtrl] = controllers;
               loginCtrl.ewfFormCtrl = ewfFormCtrl;
               loginCtrl.formTitle = attrs.loginTitle;
           }
       }
   };
}
