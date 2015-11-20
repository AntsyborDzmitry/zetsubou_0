import PatternValidator from './pattern-validator';

describe('#PatternValidator', () => {
    let sut;
    let options;

    beforeEach(() => {
        options = {
            value: /^1$/
        };
        sut = new PatternValidator(options);
    });

    describe('#constructor', () => {
        it('should call setCSSClass and setMessage', () => {
            spyOn(PatternValidator.prototype, 'setCSSClass');
            spyOn(PatternValidator.prototype, 'setMessage');

            const validator = new PatternValidator(options);

            expect(validator.setCSSClass).toHaveBeenCalledWith('ewf-pattern-validation');
            expect(validator.setMessage).toHaveBeenCalledWith('errors.pattern_error_message');
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

        it('should call wrapRegexp', () => {
            spyOn(sut, 'wrapRegexp');
            sut.wrapRegexp.and.returnValue(/a/);

            sut.validate('a');

            expect(sut.wrapRegexp).toHaveBeenCalledWith(options.value);
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
