import ewf from 'ewf';
import RegistrationSuccessController from './result-controller';

ewf.directive('registrationResult', RegistrationResult);

export default function RegistrationResult() {
    return {
        restrict: 'E',
        controller: RegistrationSuccessController,
        controllerAs: 'regSuccess',
        require: ['^ewfRegistration', 'registrationResult'],
        templateUrl: 'result-directive.html',
        link: {
            pre: preLink
        }
    };
}

function preLink(scope, element, attrs, controllers) {
    const [registrationController, resultController] = controllers;
    resultController.setRegistrationController(registrationController);
}
