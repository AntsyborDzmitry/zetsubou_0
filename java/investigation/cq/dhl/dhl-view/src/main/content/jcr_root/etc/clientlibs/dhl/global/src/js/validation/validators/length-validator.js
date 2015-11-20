import BaseValidator from './base-validator';

export default class LengthValidator extends BaseValidator {
    constructor(options) {
        super(options);
        this.setCSSClass('ewf-length-validation');
        this.setMessage('errors.length_error_message');
    }

    validate(value) {
        if (typeof value === 'undefined') {
            return true;
        }

        if (typeof this.options.min === 'number' && value.length < this.options.min) {
            return false;
        }


        if (typeof this.options.max === 'number' && value.length > this.options.max) {
            return false;
        }

        return true;
    }
}
