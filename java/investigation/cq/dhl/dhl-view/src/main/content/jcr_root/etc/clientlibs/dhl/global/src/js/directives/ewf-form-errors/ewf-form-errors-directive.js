import ewf from 'ewf';
import './ewf-form-errors-controller';

ewf.directive('ewfFormErrors', ewfFormErrors);

function ewfFormErrors() {
    return {
        restrict: 'A',
        priority: 1,
        scope: true,
        require: ['^ewfForm', 'ewfFormErrors'],
        controller: 'EwfFormErrorsController',
        controllerAs: 'ewfFormErrorsCtrl',
        templateUrl: 'ewf-form-errors-directive.html',
        link: function(scope, element, attrs, controllers) {
            const [formCtrl, errorsCtrl] = controllers;
            errorsCtrl.formCtrl = formCtrl;
        }
    };
}
