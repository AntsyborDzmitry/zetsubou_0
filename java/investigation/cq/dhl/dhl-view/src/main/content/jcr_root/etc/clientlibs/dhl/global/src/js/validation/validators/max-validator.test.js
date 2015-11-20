import MaxValidator from './max-validator';

describe('#MaxValidator', () => {
    const MAX = 5;
    let sut;
    const options = {
        max: 5
    };

    beforeEach(() => {
        sut = new MaxValidator(options);
    });

    describe('#constructor', () => {
        it('should call setCSSClass and setMessage', () => {
            spyOn(MaxValidator.prototype, 'setCSSClass');
            spyOn(MaxValidator.prototype, 'setMessage');

            const validator = new MaxValidator(options);

            expect(validator.setCSSClass).toHaveBeenCalledWith('ewf-max-validation');
            expect(validator.setMessage).toHaveBeenCalledWith('errors.max_value_error_message');
        });
    });

    describe('#validate', () => {
        it('should return true if value is less or equal to max', () => {
            const value = MAX - 1;

            expect(sut.validate(value)).toBe(true);
            expect(sut.validate(value + 'a')).toBe(true);
        });

        it('should return true if value less or equal to max', () => {
            const value = MAX + 1;

            expect(sut.validate(value)).toBe(false);
        });

        it('should return true if value is not number', () => {
            expect(sut.validate('asdf')).toBe(true);
        });

        it('should return true if options.max is empty string', () => {
            options.max = '';
            expect(sut.validate(MAX + 1)).toBe(true);
        });
    });
});
