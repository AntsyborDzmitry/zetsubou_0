import PatternValidator from './pattern-validator';

export default class EmailValidator extends PatternValidator {
    constructor(options) {
        super(options);
        this.setMessage('errors.email_error_message');
        this.setCSSClass('ewf-email-validation');
    }
}
