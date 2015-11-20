import RequiredValidator from './required-validator';

describe('#RequiredValidator', () => {
    let sut;
    let options;

    beforeEach(() => {
        options = {
            value: /^1$/
        };
        sut = new RequiredValidator(options);
    });

    describe('#constructor', () => {
        it('should call setCSSClass and setMessage', () => {
            spyOn(RequiredValidator.prototype, 'setCSSClass');
            spyOn(RequiredValidator.prototype, 'setMessage');

            const validator = new RequiredValidator(options);

            expect(validator.setCSSClass).toHaveBeenCalledWith('ewf-required');
            expect(validator.setMessage).toHaveBeenCalledWith('errors.form_field_is_required');
        });
    });

    describe('#validate', () => {
        it('should return false if value is undefined', () => {
            expect(sut.validate(undefined)).toBe(false);
        });

        it('should return false if value is empty string', () => {
            expect(sut.validate('')).toBe(false);
        });

        it('should return false if value is null', () => {
            expect(sut.validate(null)).toBe(false);
        });

        it('should return true if value is not empty string or null and not undefined', () => {
            expect(sut.validate([])).toBe(true);
            expect(sut.validate('abrakadabra')).toBe(true);
        });
    });

});
