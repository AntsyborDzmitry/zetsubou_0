import ewf from 'ewf';
import './../../../directives/ewf-form/ewf-form-directive';
import './../../../directives/ewf-input/ewf-input-directive';
import './../../../directives/ewf-validate/ewf-validate-required-directive';
import './../../../directives/ewf-validate/ewf-validate-pattern-directive';
import RegistrationFormController from './form-controller';
import './directives/ewf-check-account-directive';
import './directives/ewf-email-existance-directive';
import './directives/ewf-type-ahead-directive';
import './../../../directives/validation/validated-email/validated-email-directive';
import './../../../directives/validation/validated-password/validated-password-directive';
import './../../../directives/ewf-modal/ewf-modal-directive';

ewf.directive('registrationForm', registrationForm);

function registrationForm() {
    return {
        priority: -110,
        restrict: 'E',
        controller: RegistrationFormController,
        controllerAs: 'regCtrl',
        require: ['^ewfRegistration', 'registrationForm', 'ewfForm'],
        templateUrl: 'form-directive.html',
        link: {
            pre: preLink
        }
    };
}

function preLink(scope, element, attrs, controllers) {
    const [regCtrl, regFormCtrl, ewfFormCtrl] = controllers;
    regFormCtrl.setRegistrationController(regCtrl);
    regFormCtrl.ewfFormCtrl = ewfFormCtrl;
}
