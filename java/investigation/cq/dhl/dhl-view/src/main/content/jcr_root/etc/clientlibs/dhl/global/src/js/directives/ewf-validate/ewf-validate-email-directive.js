import ewf from 'ewf';
import './../../validation/validators-factory';

ewfValidateEmail.$inject = ['validatorsFactory'];
ewf.directive('ewfValidateEmail', ewfValidateEmail);

const optionalEmailRegExp =
    '^(([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-zA-Z]{2,6}(?:\\.[a-zA-Z]{2})?))?$';

export default function ewfValidateEmail(validatorsFactory) {
    return {
        restrict: 'A',
        require: 'ewfInput',
        link: {
            pre: function(scope, element, attrs, inputCtrl) {
                const validationMessage = attrs.ewfValidateEmailMessage || '';

                inputCtrl.addValidator(validatorsFactory.createValidator('email', {
                    value: optionalEmailRegExp,
                    msg: validationMessage
                }));
            }
        }
    };
}
