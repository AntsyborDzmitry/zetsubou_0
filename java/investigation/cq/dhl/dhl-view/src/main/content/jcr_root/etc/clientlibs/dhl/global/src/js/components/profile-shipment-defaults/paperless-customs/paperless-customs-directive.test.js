import 'angularMocks';
import PaperlessCustoms from './paperless-customs-directive';
import PaperlessCustomsController from './paperless-customs-controller';

describe('paperlessCustomsDirective', () => {
    let sut;
    let $scope;
    let ctrl;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        ctrl = jasmine.mockComponent(new PaperlessCustomsController());

        sut = PaperlessCustoms();
    }));

    it('should call controller method to load Paperless Customs settings', () => {
        sut.link.pre($scope, {}, {}, ctrl);
        expect(ctrl.loadSettings).toHaveBeenCalledWith();
    });
});
