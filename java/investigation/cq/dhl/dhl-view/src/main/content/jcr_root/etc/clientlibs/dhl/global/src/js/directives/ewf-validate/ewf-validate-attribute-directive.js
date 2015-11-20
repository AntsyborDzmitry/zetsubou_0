import ewf from 'ewf';
import './../../validation/validators-factory';

ewfValidateAttribute.$inject = ['validatorsFactory'];
ewf.directive('ewfValidateAttribute', ewfValidateAttribute);


export default function ewfValidateAttribute(validatorsFactory) {
    return {
        restrict: 'A',
        require: ['ewfInput'],
        scope: {
            valid: '=ewfValidateAttributeValid',
            msg: '@ewfValidateAttributeMessage'
        },
        link: {
            pre: function(scope, element, attrs, controllers) {
                const [inputCtrl] = controllers;
                scope.element = element;
                inputCtrl.addValidator(validatorsFactory.createValidator('attribute', scope));
            }
        }
    };
}
