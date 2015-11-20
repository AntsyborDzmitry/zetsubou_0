import ewf from 'ewf';
import ProfilePasswordController from './profile-password-controller';
import './../../../directives/ewf-password/ewf-password-directive';
import './../../../directives/ewf-form/ewf-form-directive';
import './../../../directives/ewf-input/ewf-input-directive';

ewf.directive('profilePassword', ProfilePassword);

function ProfilePassword() {
    return {
        restrict: 'E',
        controller: ProfilePasswordController,
        controllerAs: 'profilePasswordCtrl',
        require: ['profilePassword', 'ewfForm'],
        link: postLink
    };
}


function postLink(scope, element, attrs, controllers) {
    const [profilePasswordCtrl, ewfFormCtrl] = controllers;
    profilePasswordCtrl.ewfFormCtrl = ewfFormCtrl;
}
