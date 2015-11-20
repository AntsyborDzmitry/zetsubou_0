import LengthValidator from './length-validator';

describe('LengthValidator', () => {
    let sut;
    let options;
    const MAX = 10;
    const MIN = 5;

    function generateString(length) {
        return new Array(length + 1).join('a');
    }

    beforeEach(() => {
        options = {
            msg: 'some_message_here',
            min: MIN,
            max: MAX
        };
        sut = new LengthValidator(options);
    });

    describe('#constructor', () => {
        it('should call setCSSClass and setMessage', () => {
            spyOn(LengthValidator.prototype, 'setCSSClass');
            spyOn(LengthValidator.prototype, 'setMessage');

            const validator = new LengthValidator(options);

            expect(validator.setCSSClass).toHaveBeenCalledWith('ewf-length-validation');
            expect(validator.setMessage).toHaveBeenCalledWith('errors.length_error_message');
        });
    });

    describe('#validate', () => {
        it('should return true if value is undefined', () => {
            expect(sut.validate(undefined)).toBe(true);
        });

        it('should return false if value.length is greater than options.max', () => {
            const value = generateString(MAX + 1);

            expect(sut.validate(value)).toBe(false);
        });

        it('should return false if value.length is less than options.min', () => {
            const value = generateString(MIN - 1);

            expect(sut.validate(value)).toBe(false);
        });

        it('should return true if value.length is between options.min and options.max', () => {
            const value = generateString(MIN + 1);

            expect(sut.validate(value)).toBe(true);
        });

        it('should return true if options.max is NOT number', () => {
            sut.options.max = String(MAX);

            const value = generateString(MAX + 1);

            expect(sut.validate(value)).toBe(true);
        });

        it('should return true if options.min is NOT number', () => {
            sut.options.min = String(MIN);

            const value = generateString(MIN - 1);

            expect(sut.validate(value)).toBe(true);
        });
    });
});
