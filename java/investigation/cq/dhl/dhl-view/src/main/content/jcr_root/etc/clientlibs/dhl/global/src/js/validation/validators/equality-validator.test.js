import EqualityValidator from './equality-validator';

describe('#EqualityValidator', () => {
    let sut;
    let options;

    beforeEach(() => {
        options = {
            valueToEqual: true
        };
        sut = new EqualityValidator(options);
    });

    describe('#constructor', () => {
        it('should call setCSSClass and setMessage', () => {
            spyOn(EqualityValidator.prototype, 'setCSSClass');
            spyOn(EqualityValidator.prototype, 'setMessage');

            const validator = new EqualityValidator(options);

            expect(validator.setCSSClass).toHaveBeenCalledWith('ewf-required');
            expect(validator.setMessage).toHaveBeenCalledWith('errors.form_field_is_required');
        });
    });

    describe('#validate', () => {
        it('should return false if values are not equal', () => {
            expect(sut.validate(false)).toBe(false);
        });

        it('should return true if value are equal', () => {
            expect(sut.validate(true)).toBe(true);
        });
    });

});
