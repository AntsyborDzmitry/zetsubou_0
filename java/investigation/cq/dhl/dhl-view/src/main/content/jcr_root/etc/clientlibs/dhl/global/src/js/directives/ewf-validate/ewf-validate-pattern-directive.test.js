import EwfValidateRequired from './ewf-validate-pattern-directive';
import ValidatorsFactory from './../../validation/validators-factory';
import EwfPatternService from './../../services/ewf-pattern-service';
import 'angularMocks';

describe('ewfValidatePattern', () => {
    let sut;
    let scopeMock;
    let elementMock;
    let attributesMock;
    let ewfInputControllerMock;
    let validatorsFactoryMock;
    let ewfPatternServiceMock;
    let parseMock;
    let parseGetterResultMock;

    function createSut(parseGetterResult) {
        parseGetterResultMock = parseGetterResult;

        const getterMock = jasmine.createSpy('getter').and.returnValue(parseGetterResultMock);

        parseMock = jasmine.createSpy('$parse').and.returnValue(getterMock);

        sut = new EwfValidateRequired(parseMock, validatorsFactoryMock, ewfPatternServiceMock);

        sut.link.pre(scopeMock, elementMock, attributesMock, ewfInputControllerMock);
    }

    beforeEach(() => {
        scopeMock = {};
        elementMock = {};

        ewfInputControllerMock = jasmine.createSpyObj('ewfInputCtrl', ['addValidator']);

        validatorsFactoryMock = jasmine.mockComponent(new ValidatorsFactory());

        ewfPatternServiceMock = jasmine.mockComponent(new EwfPatternService());
    });

    describe('#preLink', () => {
        it('should try to parse validation options', () => {
            const ewfValidatePatternOptions = 'some_options';

            attributesMock = {
                ewfValidatePatternOptions
            };

            createSut();

            expect(parseMock).toHaveBeenCalledWith(ewfValidatePatternOptions);
        });

        it('should try to extend default options with provided ones', () => {
            const parseGetterResult = '$parse getter result';
            const ewfValidatePatternOptions = 'some_options';

            attributesMock = {
                ewfValidatePatternOptions
            };

            spyOn(angular, 'extend').and.callThrough();

            createSut(parseGetterResult);

            expect(angular.extend).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Object), parseGetterResult);
        });

        it('should try to evaluate validation pattern if extended options contain "inputAsVariable: true"', () => {
            const parseGetterResult = {
                inputAsVariable: true
            };
            const ewfValidatePattern = 'some_pattern';
            const ewfValidatePatternOptions = 'some_options';

            attributesMock = {
                ewfValidatePattern,
                ewfValidatePatternOptions
            };

            spyOn(angular, 'extend').and.callThrough();

            createSut(parseGetterResult);

            expect(parseMock.calls.argsFor(0)[0]).toEqual(ewfValidatePatternOptions);
            expect(parseMock.calls.argsFor(1)[0]).toEqual(ewfValidatePattern);
            expect(parseMock.calls.count()).toEqual(2);
        });

        it('should not try to evaluate pattern if extended options contain "inputAsVariable: false" ', () => {
            const parseGetterResult = null;
            const ewfValidatePattern = 'some_pattern';
            const ewfValidatePatternOptions = 'some_options';

            attributesMock = {
                ewfValidatePattern,
                ewfValidatePatternOptions
            };

            spyOn(angular, 'extend').and.callThrough();

            createSut(parseGetterResult);

            expect(parseMock.calls.count()).toEqual(1);
        });

        it('should call "getPattern" function of ewfPatternService', () => {
            const patternModifier = 'some_modifier';
            const parseGetterResult = {
                patternModifier
            };
            const ewfValidatePattern = 'some_pattern';
            const ewfValidatePatternOptions = 'some_options';

            attributesMock = {
                ewfValidatePattern,
                ewfValidatePatternOptions
            };

            createSut(parseGetterResult);

            expect(ewfPatternServiceMock.getPattern).toHaveBeenCalledWith(ewfValidatePattern, patternModifier);
        });

        it('should create validator with message and pattern', () => {
            const ewfValidatePatternMessage = 'some_message';
            const validationPattern = 'some_pattern';

            attributesMock = {
                ewfValidatePatternMessage
            };

            ewfPatternServiceMock.getPattern.and.returnValue(validationPattern);

            createSut();

            expect(validatorsFactoryMock.createValidator).toHaveBeenCalledWith('pattern', {
                value: validationPattern,
                msg: ewfValidatePatternMessage
            });
        });

        it('should add pattern validator to the input controller', () => {
            const requiredValidator = jasmine.createSpyObj('patternValidator', ['validate', 'getMessage']);

            validatorsFactoryMock.createValidator.and.returnValue(requiredValidator);

            createSut();

            expect(ewfInputControllerMock.addValidator).toHaveBeenCalledWith(requiredValidator);
        });
    });
});
