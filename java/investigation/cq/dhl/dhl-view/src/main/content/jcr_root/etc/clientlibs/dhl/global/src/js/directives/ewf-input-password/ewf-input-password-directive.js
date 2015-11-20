import ewf from 'ewf';
import './ewf-show-validation-info-directive';

import InputPasswordController from './ewf-input-password-controller';

ewf.directive('ewfInputPassword', ewfInputPasswordD);

export default function ewfInputPasswordD() {
    return {
        restrict: 'A',
        priority: 3,
        controller: InputPasswordController,
        controllerAs: 'ewfInputPasswordCtrl',
        require: ['ngModel', 'ewfInputPassword', '^ewfForm'],
        link: {
            pre: preLink,
            post: postLink
        }
    };
}

function preLink(scope, element, attrs, controllers) {
    const [modelCtrl, inputCtrl, formCtrl] = controllers;
    inputCtrl.fieldName = attrs.ewfInputPassword;
    inputCtrl.ewfFormCtrl = formCtrl;
    inputCtrl.ngModelCtrl = modelCtrl;
}

function postLink(scope, element, attrs, controllers) {
    const [ngModelController, ewfInputPassword, ewfFieldController] = controllers;
    ewfFieldController.ngModelCtrl = ngModelController;
    const fieldId = attrs.ewfInputPassword;
    ewfInputPassword.init(fieldId, ngModelController);

    element.on('blur', () => {
        element.addClass('ng-dirty ng-blur');
        scope.$apply(() => {
            ewfInputPassword.validationIsVisible = false;
        });
    });

    scope.$on('ValidateForm', () => {
        element.addClass('ng-dirty');
        ewfInputPassword.validationIsVisible = true;
        ewfInputPassword.validateFieldEx();
    });

    element.on('keyup', () => {
        scope.$apply(() => {
            ewfInputPassword.validationIsVisible = true;
            ewfInputPassword.validateFieldEx();
        });
    });

}
