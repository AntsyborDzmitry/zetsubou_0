import BaseValidator from './base-validator';

export default class PatternValidator extends BaseValidator {
    constructor(options) {
        super(options);
        this.setMessage('errors.pattern_error_message');
        this.setCSSClass('ewf-pattern-validation');
    }

    validate(value) {
        if (angular.isDefined(value) && value !== null) {
            return this.wrapRegexp(this.options.value).test(value);
        }

        return true;
    }

    wrapRegexp(regex) {
        return regex instanceof RegExp
            ? regex
            : new RegExp(regex);
    }
}
