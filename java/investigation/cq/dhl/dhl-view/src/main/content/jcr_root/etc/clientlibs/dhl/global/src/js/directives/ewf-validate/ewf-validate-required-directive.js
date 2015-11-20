import ewf from 'ewf';
import './../../validation/validators-factory';

ewfValidateRequired.$inject = ['validatorsFactory'];
ewf.directive('ewfValidateRequired', ewfValidateRequired);


export default function ewfValidateRequired(validatorsFactory) {
    return {
        restrict: 'A',
        require: ['ewfInput'],
        link: {
            pre: function(scope, element, attrs, controllers) {
                const [inputCtrl] = controllers;
                inputCtrl.addValidator(validatorsFactory.createValidator('required'));
            }
        }
    };
}
