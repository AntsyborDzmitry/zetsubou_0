import ExternalValidator from './validators/external-validator';
import LengthValidator from './validators/length-validator';
import MaxValidator from './validators/max-validator';
import PatternValidator from './validators/pattern-validator';
import RequiredValidator from './validators/required-validator';
import EmailValidator from './validators/email-validator';
import EqualityValidator from './validators/equality-validator';
import ewf from 'ewf';

ewf.service('validatorsFactory', ValidatorsFactory);

export default function ValidatorsFactory() {
    const validatorsMapping = {
        required: RequiredValidator,
        length: LengthValidator,
        pattern: PatternValidator,
        //TODO: rename this parameters and remove rule disabling
        'account_numbers_required': RequiredValidator, //eslint-disable-line quote-props
        'account_numbers_pattern': PatternValidator, //eslint-disable-line quote-props
        password: PatternValidator,
        max: MaxValidator,
        attribute: ExternalValidator,
        email: EmailValidator,
        equality: EqualityValidator
    };

    this.createValidator = (type, options) => {
        const Validator = validatorsMapping[type];

        if (Validator) {
            return new Validator(options);
        }

        return null;
    };
}
