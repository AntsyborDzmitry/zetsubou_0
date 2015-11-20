import ewf from 'ewf';
import './../../directives/ewf-validate/ewf-validate-required-directive';
import './../../directives/ewf-input/ewf-input-directive';
import './../../directives/ewf-input-password/ewf-input-password-directive';

import InputController from './ewf-input-controller';

ewf.directive('ewfInput', ewfInput);

export default function ewfInput() {
    return {
        restrict: 'A',
        priority: 3,
        controller: InputController,
        controllerAs: 'ewfInputCtrl',
        require: ['ngModel', 'ewfInput', '^ewfForm'],
        link: {
            pre: preLink,
            post: postLink
        }
    };

    function preLink(scope, element, attrs, controllers) {
        const [modelCtrl, inputCtrl, formCtrl] = controllers;
        inputCtrl.fieldName = attrs.ewfInput;
        inputCtrl.ewfFormCtrl = formCtrl;
        inputCtrl.ngModelCtrl = modelCtrl;
        inputCtrl.setupValidation();
    }

    function postLink(scope, element, attrs, controllers) {
        const [ngModelController, inputController] = controllers;
        const fieldId = attrs.ewfInput;

        inputController.init(fieldId, element, attrs, ngModelController);

        element.on('blur', function() {
            element.addClass('ng-dirty ng-blur');
        });

        scope.$on('ValidateForm', function() {
            element.addClass('ng-dirty ng-blur');
        });
    }
}
