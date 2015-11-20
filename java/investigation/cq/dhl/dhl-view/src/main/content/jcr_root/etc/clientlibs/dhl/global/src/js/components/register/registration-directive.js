import ewf from 'ewf';
import './form/form-directive';
import './result/result-directive';
import './verification/email-verification-directive';
import 'directives/ewf-form/ewf-form-directive';

import RegistrationController from './registration-controller';

ewf.directive('ewfRegistration', registrationDirective);

function registrationDirective() {
   return {
       restrict: 'E',
       controller: RegistrationController,
       controllerAs: 'registration',
       templateUrl: 'registration-directive.html'
   };
}
