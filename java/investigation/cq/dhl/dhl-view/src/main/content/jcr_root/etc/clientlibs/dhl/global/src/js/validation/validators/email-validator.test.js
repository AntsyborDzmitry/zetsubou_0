import EmailValidator from './email-validator';

describe('#EmailValidator', () => {
    let sut;
    let options;

    beforeEach(() => {
        options = {
            value: /^1$/
        };
        sut = new EmailValidator(options);
    });

    describe('#constructor', () => {
        it('should call setCSSClass and setMessage', () => {
            spyOn(EmailValidator.prototype, 'setCSSClass');
            spyOn(EmailValidator.prototype, 'setMessage');

            const validator = new EmailValidator(options);

            expect(validator.setCSSClass).toHaveBeenCalledWith('ewf-email-validation');
            expect(validator.setMessage).toHaveBeenCalledWith('errors.email_error_message');
        });
    });

    describe('#validate', () => {
        it('should return true if value matches pattern from options', () => {
            expect(sut.validate('1')).toBe(true);
        });

        it('should return false if value does not match pattern from options', () => {
            expect(sut.validate('2')).toBe(false);
            expect(sut.validate('12')).toBe(false);
            expect(sut.validate('')).toBe(false);
        });

        it('should return true if value is undefined', () => {
           expect(sut.validate()).toBe(true);
        });
    });

    describe('#wrapRegexp', () => {
        it('should passed regexp without changes', () => {
            const regexp = /a/;
            expect(sut.wrapRegexp(regexp)).toBe(regexp);
        });

        it('should convert passed string to regexp', () => {
            const regexpStr = 'a';
            expect(sut.wrapRegexp(regexpStr).source).toBe(regexpStr);
        });
    });
});
