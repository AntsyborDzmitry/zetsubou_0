import ewf from 'ewf';
import LoginWelcomeController from './login-welcome-controller';

ewf.directive('ewfLoginWelcome', loginWelcomeDirective);

function loginWelcomeDirective() {
   return {
       restrict: 'E',
       controller: LoginWelcomeController,
       controllerAs: 'loginWelcomeCtrl',
       templateUrl: 'login-welcome-layout.html'
   };
}
