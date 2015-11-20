import ewfValidateRequired from './ewf-validate-email-directive';
import ValidatorsFactory from './../../validation/validators-factory';
import 'angularMocks';

describe('ewfValidateEmail', () => {
    let sut;
    let scope;
    let element;
    let attrs;
    let ewfInputCtrl;
    let validatorsFactory;

    const emailRegexp =
        '^(([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-zA-Z]{2,6}(?:\\.[a-zA-Z]{2})?))?$';

    function callSutPreLink() {
        sut.link.pre(scope, element, attrs, ewfInputCtrl);
    }

    beforeEach(inject(($rootScope) => {
        scope = $rootScope.$new();
        element = {};
        attrs = {
            ewfValidatePattern: 'fake_pattern'
        };
        ewfInputCtrl = jasmine.createSpyObj('ewfInputCtrl', ['addValidator']);
        validatorsFactory = jasmine.mockComponent(new ValidatorsFactory());

        sut = new ewfValidateRequired(validatorsFactory);
    }));

    describe('#preLink', () => {
        it('should add pattern validator to the input controller', () => {
            const requiredValidator = jasmine.createSpyObj('patternValidator', ['validate', 'getMessage']);
            validatorsFactory.createValidator.and.returnValue(requiredValidator);

            callSutPreLink();

            expect(ewfInputCtrl.addValidator).toHaveBeenCalledWith(requiredValidator);
        });

        it('should call createValidator with correct params', () => {
            const pattern = {
                value: emailRegexp,
                msg: ''
            };

            callSutPreLink();
            expect(validatorsFactory.createValidator).toHaveBeenCalledWith('email', pattern);
        });

        it('should call createValidator with custom message parameter correct params', () => {
            attrs = {ewfValidateEmailMessage: 'fake_custom_message'};
            callSutPreLink();
            expect(validatorsFactory.createValidator)
                .toHaveBeenCalledWith('email', {value: emailRegexp, msg: 'fake_custom_message'});
        });
    });
});
