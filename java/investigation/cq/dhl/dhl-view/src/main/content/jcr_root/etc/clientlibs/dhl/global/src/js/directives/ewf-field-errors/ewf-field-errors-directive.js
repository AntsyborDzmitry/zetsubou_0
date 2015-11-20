import ewf from 'ewf';
import './ewf-field-errors-controller';

ewf.directive('ewfFieldErrors', ewfFieldErrors);

function ewfFieldErrors() {
    return {
        restrict: 'A',
        priority: 1,
        replace: true,
        scope: true,
        require: ['^ewfForm', '^ewfField', 'ewfFieldErrors'],
        controller: 'EwfFieldErrorsController',
        controllerAs: 'ewfFieldErrorsCtrl',
        templateUrl: 'ewf-field-errors-directive.html',
        link: {pre}
    };

    function pre(scope, element, attrs, controllers) {
        const [ewfFormCtrl, fieldController, errorsCtrl] = controllers;
        const {name: fieldName} = fieldController;

        Object.assign(errorsCtrl, {ewfFormCtrl, fieldController, fieldName});

        if (scope.$parent.ewfInputCtrl) {
            // @todo: refactor this temporary hack and merge it with errorMessages
            errorsCtrl.validationMessages = scope.$parent.ewfInputCtrl.validationErrorMessage;
        }
    }
}
