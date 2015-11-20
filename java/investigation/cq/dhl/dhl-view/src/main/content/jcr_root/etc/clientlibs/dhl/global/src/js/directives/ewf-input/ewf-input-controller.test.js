import 'angularMocks';
import EwfInputController from './ewf-input-controller';
import BaseValidator from './../../validation/validators/base-validator';
import EwfFormController from './../ewf-form/ewf-form-controller';
import ValidatorsFactory from './../../validation/validators-factory';
import RuleService from 'services/rule-service';
import LogService from 'services/log-service';

describe('ewfInputController', () => {
    let sut;
    let $scope;
    let $q;
    let $timeout;
    let ruleService;
    let logService;
    let nlsService;
    let ngModelCtrl;
    let ewfFormCtrl;
    let fakeValidator;
    let element;
    let validatorsFactory;
    const fieldId = 'first.second';

    beforeEach(inject((_$rootScope_, _$q_, _$timeout_, _$window_) => {
        $scope = _$rootScope_.$new();
        $q = _$q_;
        $timeout = _$timeout_;

        logService = jasmine.mockComponent(new LogService(_$window_));
        ruleService = jasmine.mockComponent(new RuleService());
        validatorsFactory = jasmine.mockComponent(new ValidatorsFactory());
        nlsService = {};
        element = jasmine.createSpyObj('element', ['addClass']);

        ngModelCtrl = {
            $parsers: [],
            $formatters: [],
            $setValidity: jasmine.createSpy('$setValidity'),
            $setViewValue: jasmine.createSpy('$setViewValue')
        };

        fakeValidator = jasmine.mockComponent(new BaseValidator());
        ewfFormCtrl = jasmine.mockComponent(new EwfFormController());

        sut = new EwfInputController($scope, $q, logService, ruleService, nlsService, validatorsFactory);
        sut.fieldName = 'testField';
        sut.ngModelCtrl = ngModelCtrl;
        sut.ewfFormCtrl = ewfFormCtrl;
    }));

    describe('#init', () => {
        let attrs,
            ngModelController;

        beforeEach(() => {
            attrs = {};
            ngModelController = {};

            spyOn(sut, 'initializeRules');
            spyOn(sut, 'addValidatorsFromRules');
            spyOn(sut, 'applyRules');
        });

        it('should set fieldId, fieldName, ngModelController', () => {
            sut.init(fieldId, element, attrs, ngModelController);

            expect(sut.fieldId).toBe(fieldId);
            expect(sut.ngModelController).toBe(ngModelController);
            expect(sut.fieldName).toEqual('second');
        });

        it('should initialize rules and add validators from rules and apply rules', () => {
            sut.init(fieldId, element, attrs, ngModelController);

            expect(sut.initializeRules).toHaveBeenCalled();
            expect(sut.applyRules).toHaveBeenCalledWith(attrs);
            expect(sut.addValidatorsFromRules).toHaveBeenCalled();
        });

        it(`should apply css classes from validators (added with addValidator) to passed element
                if validators were called before init`, () => {
            const cssClass = 'some_css_class';
            fakeValidator.getCSSClass.and.returnValue(cssClass);

            sut = new EwfInputController($scope, $q, logService, ruleService, nlsService);
            sut.fieldName = 'testField';
            sut.ngModelCtrl = ngModelCtrl;
            sut.ewfFormCtrl = ewfFormCtrl;

            sut.addValidator(fakeValidator);

            sut.init(fieldId, element, attrs, ngModelController);
            $timeout.flush();

            expect(element.addClass).toHaveBeenCalledWith(cssClass);
        });
    });

    describe('#setupValidation', () => {
        let pasersPushSpy;
        let formattersPushSpy;

        beforeEach(() => {
            pasersPushSpy = spyOn(sut.ngModelCtrl.$parsers, 'push');
            formattersPushSpy = spyOn(sut.ngModelCtrl.$formatters, 'push');
        });

        it('should add own validation for "ngModel -> DOM" validation', () => {
            sut.setupValidation();
            expect(pasersPushSpy).toHaveBeenCalledWith(sut.validationCallback);
        });

        it('should add own validation for "DOM -> ngModel" validation', () => {
            sut.setupValidation();
            expect(formattersPushSpy).toHaveBeenCalledWith(sut.validationCallback);
        });
    });

    describe('#validationCallback', () => {
        it('should return given value to implement validation pipeline', () => {
            const testValue = 'some_value';
            const result = sut.validationCallback(testValue);
            expect(result).toBe(testValue);
        });

        it('should run validation and set validity to ngModel', () => {
            spyOn(sut, 'validate').and.returnValue(true);
            const testValue = 'some_value';

            sut.validationCallback(testValue);

            expect(sut.validate).toHaveBeenCalledWith(testValue);
            expect(ngModelCtrl.$setValidity).toHaveBeenCalledWith('ewfValid', true);
        });
    });

    describe('#addValidator', () => {
        beforeEach(() => {
            spyOn(sut.validators, 'push').and.callThrough();
        });

        it('should add a validator to the list', () => {
            sut.addValidator(fakeValidator);
            expect(sut.validators.push).toHaveBeenCalledWith(fakeValidator);
        });

        it(`should apply css classes from added validators to element passed to init function
                if validators were called after init`, () => {
            const cssClass = 'some_css_class';
            const fakeValidatorFirst = jasmine.mockComponent(new BaseValidator());
            const fakeValidatorSecond = jasmine.mockComponent(new BaseValidator());
            fakeValidatorFirst.getCSSClass.and.returnValue(cssClass);
            fakeValidatorSecond.getCSSClass.and.returnValue(cssClass);

            sut = new EwfInputController($scope, $q, logService, ruleService, nlsService);
            sut.fieldName = 'testField';
            sut.ngModelCtrl = ngModelCtrl;
            sut.ewfFormCtrl = ewfFormCtrl;

            sut.init(fieldId, element, {}, ngModelCtrl);

            sut.addValidator(fakeValidatorFirst);
            sut.addValidator(fakeValidatorSecond);
            $timeout.flush();

            expect(element.addClass).toHaveBeenCalledWith(cssClass);
            expect(element.addClass.calls.count()).toBe(2);
        });
    });

    describe('#validate', () => {
        it('should run all validators with provided value', () => {
            const testValue = 'some_test_value';
            sut.addValidator(fakeValidator);
            sut.validate(testValue);

            expect(fakeValidator.validate).toHaveBeenCalledWith(testValue);
        });

        it('should return true if all validators passed', () => {
            fakeValidator.validate.and.returnValue(true);
            sut.addValidator(fakeValidator);

            const result = sut.validate('something');

            expect(result).toBeTruthy();
        });

        it('should return false and add error message if validation not passed', () => {
            const validationMessage = 'fake_validation_message';
            fakeValidator.getMessage.and.returnValue(validationMessage);
            fakeValidator.validate.and.returnValue(false);

            spyOn(sut, 'addErrorMessage');

            sut.addValidator(fakeValidator);
            const isValid = sut.validate('something');

            expect(isValid).toBeFalsy();
            expect(sut.addErrorMessage).toHaveBeenCalledWith(validationMessage);
        });

        it('should clean field error messages before validation', () => {
            spyOn(sut, 'cleanErrorMessages');
            spyOn(sut, 'addErrorMessage');

            sut.validate('something');

            expect(sut.cleanErrorMessages).toHaveBeenCalled();
            expect(sut.addErrorMessage).not.toHaveBeenCalled();
        });

        it('should stop validation on first failed validator', () => {
            const fakeValidatorFirst = jasmine.mockComponent(new BaseValidator());
            const fakeValidatorSecond = jasmine.mockComponent(new BaseValidator());
            fakeValidatorFirst.validate.and.returnValue(false);
            sut.addValidator(fakeValidatorFirst);
            sut.addValidator(fakeValidatorSecond);

            sut.validate('something');

            expect(fakeValidatorFirst.validate).toHaveBeenCalled();
            expect(fakeValidatorSecond.validate).not.toHaveBeenCalled();
        });
    });

    describe('#addErrorMessage', () => {
        it('should add field error message to form controller', () => {
            const errorMessage = 'some_error_message';
            sut.addErrorMessage(errorMessage);
            expect(ewfFormCtrl.addFieldError).toHaveBeenCalledWith(sut.fieldName, errorMessage);
        });
    });

    describe('#cleanErrorMessages', () => {
        it('should clean field error messages', () => {
            sut.cleanErrorMessages();
            expect(ewfFormCtrl.cleanFieldErrors).toHaveBeenCalledWith(sut.fieldName);
        });
    });

    describe('#triggerValidation', () => {
        it('triggers validation cycle', () => {
            const prevValue = '123';
            ngModelCtrl.$viewValue = prevValue;

            sut.triggerValidation();

            expect(ngModelCtrl.$setViewValue).toHaveBeenCalledWith(prevValue);
        });
    });
});
