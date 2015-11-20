import BaseValidator from './base-validator';

export default class ExternalValidator extends BaseValidator {
    validate() {
        return this.options.valid;
    }
}
