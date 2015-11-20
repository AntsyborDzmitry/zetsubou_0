import BaseValidator from './base-validator';

export default class EqualityValidator extends BaseValidator {
    constructor(options) {
        super(options);
        this.setCSSClass('ewf-required');
        this.setMessage('errors.form_field_is_required');
    }

    validate(value) {
        return value === this.options.valueToEqual;
    }
}
