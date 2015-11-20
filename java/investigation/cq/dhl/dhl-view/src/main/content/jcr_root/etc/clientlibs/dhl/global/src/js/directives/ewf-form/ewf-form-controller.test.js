import EwfFormController from './ewf-form-controller';
import RuleService from 'services/rule-service';
import 'angularMocks';

describe('EwfFormController', () => {
    let sut;
    let $scope, $q;
    let ruleService, logService;
    let deferred;

    beforeEach(inject((_$rootScope_, _$q_) => {
        $scope = _$rootScope_.$new();
        $q = _$q_;

        ruleService = jasmine.mockComponent(new RuleService());
        logService = {};

        deferred = $q.defer();
        deferred.resolve();
        ruleService.acquireRulesForFormFields.and.returnValue(deferred.promise);

        sut = new EwfFormController($scope, logService, ruleService);
    }));

    describe('#init', () => {
        it('calls ruleService passing formName to it', () => {
            const formName = 'paymentType';

            sut.init(formName, null);

            expect(ruleService.acquireRulesForFormFields).toHaveBeenCalledWith(formName, undefined);
        });
    });

    describe('#displayServerErrors', () => {
        it('should broadcast event with errors', () => {
            const response = {
                fieldErrors: {
                    fieldName: ['error string']
                },
                errors: []
            };

            spyOn($scope, '$broadcast');

            sut.setErrorsFromResponse(response);

            expect(sut.formErrors).toEqual(response.errors);
            expect(sut.fieldErrors).toEqual(response.fieldErrors);
        });
    });

    describe('#cleanFieldError', () => {
        it('should clean error messages for particular field by name', () => {
            let fieldName = 'test_field_name';
            sut.fieldErrors[fieldName] = ['some_message'];

            sut.cleanFieldErrors(fieldName);

            expect(sut.fieldErrors[fieldName]).toEqual([]);
        });
    });

    describe('#cleanAllFieldError', () => {
        it('should clean all fields error messages', () => {
            let fieldName = 'test_field_name';
            sut.fieldErrors[fieldName] = ['some_message'];

            sut.cleanAllFieldErrors();

            expect(sut.fieldErrors).toEqual({});
        });
    });

    describe('#cleanFormErrors', () => {
        it('should clean form errors', () => {
            sut.cleanFormErrors();

            expect(sut.formErrors).toEqual([]);
        });
    });

    describe('#addFieldError', () => {
        it('should add error to field`s errors', () => {
            let fieldName = 'test';
            let errorMsg = 'some_field_error_message';

            let expectedFieldErrors = {};
            expectedFieldErrors[fieldName] = [errorMsg];

            sut.addFieldError(fieldName, errorMsg);

            expect(sut.fieldErrors).toEqual(jasmine.objectContaining(expectedFieldErrors));
        });
    });

    describe('#reloadRules', () => {
        const formName = 'someFormName';
        const fieldName = 'someField';
        const visible = true;
        const props = {visible};
        const rules = {};

        beforeEach(() => {
            sut.formName = formName;
            rules[fieldName] = {props};
            ruleService.acquireRulesForFormFields.and.returnValue($q.when(rules));
        });

        it('loads rules passing formName and countryId to ruleService', () => {
            const countryId = 'US';

            sut.reloadRules(countryId);

            expect(ruleService.acquireRulesForFormFields).toHaveBeenCalledWith(formName, countryId);
        });

        it('writes new rules to hideRules', () => {
            const countryId = 'US';

            sut.reloadRules(countryId);
            $scope.$apply();

            expect(sut.hideRules[fieldName]).toBe(!visible);
        });
    });
});
