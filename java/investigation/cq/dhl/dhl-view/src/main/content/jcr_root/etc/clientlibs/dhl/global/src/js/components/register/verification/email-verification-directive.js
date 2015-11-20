import ewf from 'ewf';
import EmailVerificationController from './verification-controller';

ewf.directive('emailVerification', EmailVerification);

export default function EmailVerification() {
    return {
        restrict: 'E',
        controller: EmailVerificationController,
        controllerAs: 'verificationController',
        require: ['^ewfRegistration', 'emailVerification'],
        templateUrl: 'email-verification-directive.html',
        link: {
            pre: preLink
        }
    };
}

function preLink(scope, element, attrs, controllers) {
    const [registrationController, verificationController] = controllers;
    verificationController.setRegistrationController(registrationController);
}
