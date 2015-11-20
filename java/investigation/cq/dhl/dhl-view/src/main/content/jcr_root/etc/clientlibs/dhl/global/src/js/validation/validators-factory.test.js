
import ValidatorsFactory from './validators-factory';
import ExternalValidator from './validators/external-validator';
import LengthValidator from './validators/length-validator';
import MaxValidator from './validators/max-validator';
import PatternValidator from './validators/pattern-validator';
import RequiredValidator from './validators/required-validator';
import EmailValidator from './validators/email-validator';

describe('ValidatorsFactory', () => {
    let sut;

    beforeEach(() => {
        sut = new ValidatorsFactory();
    });

    describe('#createValidator', () => {
        it('should return LengthValidator if passed type is length', () => {
            expect(sut.createValidator('length').constructor).toBe(LengthValidator);
        });

        it('should return PatternValidator if passed type is pattern', () => {
            expect(sut.createValidator('pattern').constructor).toBe(PatternValidator);

        });

        it('should return RequiredValidator if passed type is account_numbers_required', () => {
            expect(sut.createValidator('account_numbers_required').constructor).toBe(RequiredValidator);

        });

        it('should return PatternValidator if passed type is account_numbers_pattern', () => {
            expect(sut.createValidator('account_numbers_pattern').constructor).toBe(PatternValidator);

        });

        it('should return PatternValidator if passed type is password', () => {
            expect(sut.createValidator('password').constructor).toBe(PatternValidator);

        });

        it('should return MaxValidator if passed type is max', () => {
            expect(sut.createValidator('max').constructor).toBe(MaxValidator);

        });

        it('should return ExternalValidator if passed type is attribute', () => {
            expect(sut.createValidator('attribute').constructor).toBe(ExternalValidator);

        });

        it('should return EmailValidator if passed type is attribute', () => {
            expect(sut.createValidator('email').constructor).toBe(EmailValidator);
        });

        it('should return null if validator name not recognized', () => {
            const validator = sut.createValidator('not_exisiting_validator_name');
            expect(validator).toBe(null);
        });
    });
});
