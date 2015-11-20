import BaseValidator from './base-validator';

export default class RequiredValidator extends BaseValidator {
    constructor(options) {
        super(options);
        this.setCSSClass('ewf-required');
        this.setMessage('errors.form_field_is_required');
    }

    validate(value) {
        return !angular.isUndefined(value) && value !== '' && value !== null;
    }
}
