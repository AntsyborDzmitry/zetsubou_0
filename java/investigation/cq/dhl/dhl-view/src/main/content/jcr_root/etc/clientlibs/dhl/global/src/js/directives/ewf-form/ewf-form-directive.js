import ewf from 'ewf';
import './../ewf-field/ewf-field-directive';
import './../ewf-field-errors/ewf-field-errors-directive';
import './../ewf-input/ewf-input-directive';
import './../ewf-validate/ewf-validate-required-directive';
import './../ewf-validate/ewf-validate-pattern-directive';
import './../ewf-form-errors/ewf-form-errors-directive';
import FormController from './ewf-form-controller';

ewf.directive('ewfForm', EwfForm);

export default function EwfForm() {
    return {
        restrict: 'A',
        priority: 1,
        controller: FormController,
        controllerAs: 'ewfFormCtrl',
        require: ['ewfForm', '?form'],
        link: {pre}
    };

    function pre($scope, element, $attrs, [controller, ngFormCtrl]) {
        controller.init($attrs.ewfForm);

        if (ngFormCtrl) {
            const {ewfValidation, setErrorsFromResponse} = controller;

            Object.assign(ngFormCtrl, {
                validate: ewfValidation,
                setErrorsFromResponse
            });
        }
    }
}
