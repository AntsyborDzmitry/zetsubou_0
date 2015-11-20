/**
 * Test suit for ValidationService
 */
import ValidationService from './validation-service';
import 'angularMocks';

describe('ValidationService', function() {
    const rules = ['required', 'formatted', 'exist'];
    const successResponse = {exist: false, valid: true};
    const errorResponse = 'some error';

    let sut, model, $httpBackend;
    let isEmptySpy, patternTestSpy, setValiditySpy, logService;

    beforeEach(inject(function(_$httpBackend_, $http) {
        $httpBackend = _$httpBackend_;

        isEmptySpy = jasmine.createSpy();
        patternTestSpy = jasmine.createSpy();
        setValiditySpy = jasmine.createSpy();

        model = {
            name: 'loginUsername',
            maxLength: 10,
            $parsers: [],
            $isEmpty: isEmptySpy,
            $setValidity: setValiditySpy,
            pattern: {
                test: patternTestSpy
            }
        };

        logService = jasmine.createSpyObj(['error']);

        sut = new ValidationService($http, logService);
    }));

    describe('#applyValidationRules', function() {
        beforeEach(function() {
            sut.applyRulesValidators(model, rules);
        });

        it('should populate model $parsers with according to applied rules', function() {
            expect(model.$parsers.length).toEqual(rules.length);
        });
    });

    describe('validators', function() {
        beforeEach(function() {
            sut.applyRulesValidators(model, rules);
        });

        describe('required', function() {
            let requiredValidator;
            const value = '';

            beforeEach(function() {
                requiredValidator = model.$parsers[0];
            });

            it('should check if value is empty', function() {
                requiredValidator(value);

                expect(isEmptySpy).toHaveBeenCalledWith(value);
            });

            it('should pass validation', function() {
                isEmptySpy.and.returnValue(false);

                requiredValidator(value);

                expect(setValiditySpy).toHaveBeenCalledWith('required', true);
            });

            it('should fail validation', function() {
                isEmptySpy.and.returnValue(true);

                requiredValidator(value);

                expect(setValiditySpy).toHaveBeenCalledWith('required', false);
            });
        });

        describe('formatted', function() {
            let formattedValidator;
            const validValue = 't@test.com';
            const invalidValue = 'test@testcom.';

            beforeEach(function() {
                formattedValidator = model.$parsers[1];
            });

            it('should fail validation', function() {
                isEmptySpy.and.returnValue(false);
                patternTestSpy.and.returnValue(false);

                formattedValidator(invalidValue);

                expect(setValiditySpy).toHaveBeenCalledWith('formatted', false);
            });

            it('should pass validation', function() {
                isEmptySpy.and.returnValue(false);
                patternTestSpy.and.returnValue(true);

                formattedValidator(validValue);
                expect(setValiditySpy).toHaveBeenCalledWith('formatted', true);
            });
        });

        describe('exist', function() {
            let existValidator;
            const email = 'test@test.com';

            beforeEach(function() {
                existValidator = model.$parsers[2];
            });

            it('should set validity on success', function() {
                $httpBackend.whenPOST('/api/user/validate/email').respond(successResponse, errorResponse);
                existValidator(email);
                $httpBackend.expectPOST('/api/user/validate/email');

                $httpBackend.flush();
                expect(setValiditySpy).toHaveBeenCalledWith('exist', !successResponse.exist);
            });

            it('should set validity on success', function() {
                $httpBackend.whenPOST('/api/user/validate/email').respond(500, errorResponse);
                existValidator(email);
                $httpBackend.expectPOST('/api/user/validate/email');

                $httpBackend.flush();
                expect(setValiditySpy).toHaveBeenCalledWith('exist', false);
                expect(logService.error).toHaveBeenCalled();
            });
        });
    });
});
