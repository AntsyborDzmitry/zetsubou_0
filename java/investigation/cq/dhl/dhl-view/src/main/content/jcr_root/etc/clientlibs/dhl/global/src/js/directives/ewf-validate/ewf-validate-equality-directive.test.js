import ewfValidateEquality from './ewf-validate-required-directive';
import ValidatorsFactory from './../../validation/validators-factory';
import 'angularMocks';

describe('ewfValidateEquality', () => {
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

        sut = new ewfValidateEquality(validatorsFactory);
    });

    describe('#preLink', () => {
        it('should add equality validator to the input controller', () => {
            const equalityValidator = jasmine.createSpyObj('equalityValidator', ['validate', 'getMessage']);
            validatorsFactory.createValidator.and.returnValue(equalityValidator);

            callSutPreLink();

            expect(ewfInputCtrl.addValidator).toHaveBeenCalledWith(equalityValidator);
        });
    });
});
