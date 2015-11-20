import ewfValidateRequired from './ewf-validate-required-directive';
import ValidatorsFactory from './../../validation/validators-factory';
import 'angularMocks';

describe('ewfValidateRequired', () => {
    let sut;
    let scope;
    let element;
    let attrs;
    let ewfInputCtrl;
    let validatorsFactory;

    function callSutPreLink() {
        sut.link.pre(scope, element, attrs, [ewfInputCtrl]);
    }

    beforeEach(() => {
        scope = {};
        element = {};
        attrs = {};
        ewfInputCtrl = jasmine.createSpyObj('ewfInputCtrl', ['addValidator']);
        validatorsFactory = jasmine.mockComponent(new ValidatorsFactory());

        sut = new ewfValidateRequired(validatorsFactory);
    });

    describe('#preLink', () => {
        it('should add required validator to the input controller', () => {
            const requiredValidator = jasmine.createSpyObj('requiredValidator', ['validate', 'getMessage']);
            validatorsFactory.createValidator.and.returnValue(requiredValidator);

            callSutPreLink();

            expect(ewfInputCtrl.addValidator).toHaveBeenCalledWith(requiredValidator);
        });
    });
});
