import ewf from 'ewf';
import './../../validation/validators-factory';

ewfValidateEquality.$inject = ['validatorsFactory'];
ewf.directive('ewfValidateEquality', ewfValidateEquality);


export default function ewfValidateEquality(validatorsFactory) {
    return {
        restrict: 'A',
        require: 'ewfInput',
        scope: {
            valueToEqual: '=ewfValidateEquality',
            msg: '@ewfValidateEqualityMessage'
        },
        link: {
            pre: function(scope, element, attrs, ctrl) {
                const inputCtrl = ctrl;
                scope.element = element;
                inputCtrl.addValidator(validatorsFactory.createValidator('equality', scope));
            }
        }
    };
}
