import ExternalValidator from './external-validator';

describe('ExternalValidator', () => {
    let sut;

    beforeEach(() => {
        sut = new ExternalValidator();
    });

    describe('#validate', () => {
        beforeEach(() => {
            sut.options = {
                valid: false
            };
        });

        it('should return true if options.valid is true', () => {
            sut.options.valid = true;

            expect(sut.validate()).toBe(true);
        });

        it('should return false if options.valid is false', () => {
            sut.options.valid = false;

            expect(sut.validate()).toBe(false);
        });
    });
});
