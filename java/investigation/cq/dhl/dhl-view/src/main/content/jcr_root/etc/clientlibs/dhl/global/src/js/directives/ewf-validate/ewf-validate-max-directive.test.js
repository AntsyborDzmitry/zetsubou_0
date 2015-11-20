import EwfValidateMax from './ewf-validate-max-directive';
import ValidatorsFactory from './../../validation/validators-factory';
import BaseValidator from './../../validation/validators/base-validator';
import EwfInputController from './.././ewf-input/ewf-input-controller';
import 'angularMocks';

describe('ewfValidateMax', () => {
    const scope = {};
    const elem = {};
    let sut,
        validationFactory,
        attrs,
        ctrl,
        validator;

    function callPreLink() {
        sut.link.pre(scope, elem, attrs, ctrl);
    }

    beforeEach(inject((_$q_, _$rootScope_) => {
        validator = jasmine.mockComponent(new BaseValidator());

        attrs = {ewfValidateMaxMessage: 'message', ewfValidateMax: '10', $observe: jasmine.createSpy('$observe')};

        ctrl = jasmine.mockComponent(new EwfInputController(_$rootScope_.$new(), _$q_));

        validationFactory = jasmine.mockComponent(new ValidatorsFactory());
        validationFactory.createValidator.and.returnValue(validator);

        sut = new EwfValidateMax(validationFactory);
    }));

    describe('#preLink', () => {
        it('should create validator for directive', () => {
            callPreLink();
            expect(validationFactory.createValidator).toHaveBeenCalledWith('max', {
                max: attrs.ewfValidateMax,
                msg: attrs.ewfValidateMaxMessage
            });
        });

        it('should create validator for directive with empty message if it is not in attributes', () => {
            attrs.ewfValidateMaxMessage = null;
            callPreLink();
            expect(validationFactory.createValidator).toHaveBeenCalledWith('max', {
                max: attrs.ewfValidateMax,
                msg: ''
            });
        });

        it('should add validator to input controller', () => {
            callPreLink();
            expect(ctrl.addValidator).toHaveBeenCalledWith(validator);
        });

        it('observes ewfValidateMax attribute for change', () => {
            callPreLink();
            const observableAttribute = attrs.$observe.calls.mostRecent().args[0];
            expect(observableAttribute).toEqual('ewfValidateMax');
        });

        it('updates validator options', () => {
            const max = 10;
            callPreLink();
            const observeHandler = attrs.$observe.calls.mostRecent().args[1];
            observeHandler(max);

            expect(validator.setOptions).toHaveBeenCalledWith({
                max,
                msg: attrs.ewfValidateMaxMessage
            });
        });

        it('triggers validation cycle', () => {
            callPreLink();
            const observeHandler = attrs.$observe.calls.mostRecent().args[1];
            observeHandler();

            expect(ctrl.triggerValidation).toHaveBeenCalled();
        });
    });
});
