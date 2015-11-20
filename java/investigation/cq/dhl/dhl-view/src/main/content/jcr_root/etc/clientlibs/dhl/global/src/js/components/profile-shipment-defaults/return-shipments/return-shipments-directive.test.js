import returnShipments from './return-shipments-directive';
import 'angularMocks';

describe('pickupsDirective', () => {
    let sut;
    let $scope;
    let ctrl;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        ctrl = jasmine.createSpyObj('ReturnShipmentsController', ['preloadSectionFromUrl']);

        sut = new returnShipments();
    }));

    it('should call controller to pre-load settings', () => {
        sut.link.pre($scope, {}, {}, ctrl);
        expect(ctrl.preloadSectionFromUrl).toHaveBeenCalled();
    });
});
