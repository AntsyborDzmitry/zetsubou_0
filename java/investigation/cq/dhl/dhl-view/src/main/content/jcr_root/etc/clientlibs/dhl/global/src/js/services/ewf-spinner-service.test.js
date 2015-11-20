import EwfSpinnerService from './ewf-spinner-service';
import 'angularMocks';

describe('EwfSpinnerService', () => {
    let sut;
    let $q, $timeout, $scope;
    const makeFakePromise = function() {
        return $q.when('Remote call result');
    };

    beforeEach(inject((_$rootScope_, _$q_, _$timeout_) => {
        $q = _$q_;
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;
        sut = new EwfSpinnerService($q, $timeout);
    }));

    it('should show spinner instantly after service is called', () => {
        expect(sut.isSpinnerActive()).toEqual(true);
    });

    it('should not hide spinner untill call is not resolved', () => {
        const fakePromise = makeFakePromise();
        sut.applySpinner(fakePromise);
        $scope.$apply();
        expect(sut.isSpinnerActive()).toBe(true);
    });

    it('should hide spinner when promise, passed to a method, resolved', () => {
        const anotherFakePromise = makeFakePromise();
        sut.applySpinner(anotherFakePromise);
        $scope.$apply();
        $timeout.flush();
        expect(sut.isSpinnerActive()).toBe(false);
    });

    it('should resolve spinner even if no promise were passed', () => {
        const anotherFakePromise = '';
        sut.applySpinner(anotherFakePromise);
        expect(sut.isSpinnerActive()).toBe(true);
        $scope.$apply();
        $timeout.flush();
        expect(sut.isSpinnerActive()).toBe(false);
    });
});
