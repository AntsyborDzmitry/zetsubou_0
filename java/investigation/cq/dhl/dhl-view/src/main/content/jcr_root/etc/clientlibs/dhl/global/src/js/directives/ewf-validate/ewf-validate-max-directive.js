import ewf from 'ewf';
import './../../validation/validators-factory';

ewfValidateMax.$inject = ['validatorsFactory'];
ewf.directive('ewfValidateMax', ewfValidateMax);

export default function ewfValidateMax(validatorsFactory) {
    return {
        restrict: 'A',
        require: 'ewfInput',
        link: {
            pre: function(scope, element, attrs, inputCtrl) {
                const validationMessage = attrs.ewfValidateMaxMessage || '';
                const validator = validatorsFactory.createValidator('max', {
                    max: attrs.ewfValidateMax,
                    msg: validationMessage
                });
                inputCtrl.addValidator(validator);

                attrs.$observe('ewfValidateMax', function(value) {
                    validator.setOptions({
                        max: value,
                        msg: validationMessage
                    });
                    inputCtrl.triggerValidation();
                });
            }
        }
    };
}

