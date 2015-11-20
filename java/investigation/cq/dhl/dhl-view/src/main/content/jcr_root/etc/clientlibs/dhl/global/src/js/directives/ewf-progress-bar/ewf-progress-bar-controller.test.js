import AttrsService from './../../services/attrs-service';
import EwfProgressBarController from './ewf-progress-bar-controller';

describe('#EwfProgressBarController', () => {
    let sut;
    let attrServiceMock;

    const $scope = {};
    const $attrs = {ewfProgress: 50};

    beforeEach(() => {
        attrServiceMock = jasmine.mockComponent(new AttrsService());
        sut = new EwfProgressBarController($scope, $attrs, attrServiceMock);
    });

    describe('initialization', () => {
        it('should watch for progress attribute', () => {
            expect(attrServiceMock.track).toHaveBeenCalledWith($scope, $attrs, 'ewfProgress', sut, null, 'progress');
        });
    });
});
