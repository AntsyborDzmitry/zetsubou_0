import EwfFieldErrorsController from './ewf-field-errors-controller';
import 'angularMocks';

describe('EwfFieldErrorsController', () => {
    let sut;
    let $scope;

    function initSut() {
        sut = new EwfFieldErrorsController($scope, {log: () => {}});
    }

    beforeEach(module('ewf'));

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
    }));

    describe('#constructor', () => {
        it('should subscribe for event with server errors', () => {
            spyOn($scope, '$on');

            initSut();

            expect($scope.$on).toHaveBeenCalledWith('ewfForm.displayServerErrors', jasmine.any(Function));
        });
    });

    describe('#onDisplayServerErrors', () => {
        beforeEach(initSut);

        it('should put field errors for rendering in directive', () => {
            sut.fieldController = {};
            sut.fieldController.invalidateModel = function() {};
            const fieldErrors = ['test_error_key'];
            const errors = {
                fieldErrors: {
                    test: fieldErrors
                },
                errors: {}
            };

            sut.fieldName = 'test';
            sut.errorMessages = [];

            sut.onDisplayServerErrors({}, errors);

            expect(sut.errorMessages).toBe(fieldErrors);
        });
    });
});
