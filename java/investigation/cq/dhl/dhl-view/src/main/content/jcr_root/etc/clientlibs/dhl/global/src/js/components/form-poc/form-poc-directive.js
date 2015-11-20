import ewf from 'ewf';
//import './form/form-directive';
//import './result/result-directive';
//import './verification/email-verification-directive';
//import 'directives/ewf-form/ewf-form-directive';

import FormPocController from './form-poc-controller';

ewf.directive('ewfFormPoc', formPocDirective);

function formPocDirective() {
   return {
       restrict: 'E',
       templateUrl: 'form-poc-directive.html',
       controller: FormPocController,
       controllerAs: 'formPocCtrl',
       link: function(scope, elem, attrs, formPocCtrl) {
           formPocCtrl.fieldsToHide = attrs.hideAmount;
           formPocCtrl.initFormConfig();
       }
   };
}
