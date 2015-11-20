import EwfSpinnerController from './ewf-spinner-controller';
import EwfSpinnerService from './../../services/ewf-spinner-service';
import 'angularMocks';

describe('EwfSpinnerController', () => {
    let sut;
    let $q, $timeout;
    let EwfSpinnerServiceMock;

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        EwfSpinnerServiceMock = jasmine.mockComponent(new EwfSpinnerService($q, $timeout));

        sut = new EwfSpinnerController(EwfSpinnerServiceMock);
    }));

    it('should get the state of a marker of a spinner', () => {
        EwfSpinnerServiceMock.isSpinnerActive.and.callThrough();
        const spinnerState = sut.isSpinnerVisible();
        expect(spinnerState).toEqual(true);
    });
});
