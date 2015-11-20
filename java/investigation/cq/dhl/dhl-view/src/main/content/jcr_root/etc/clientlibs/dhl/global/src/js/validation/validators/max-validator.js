import BaseValidator from './base-validator';

export default class MaxValidator extends BaseValidator {
    constructor(options) {
        super(options);
        this.setMessage('errors.max_value_error_message');
        this.setCSSClass('ewf-max-validation');
    }

    validate(value) {
        let valid = true;
        if (!isNaN(+value) && this.options.max !== '') {
            valid = +value <= this.options.max;
        }
        return valid;
    }
}
