import ewfProfileShipmentDefault from './profile-shipment-default-directive';
import 'angularMocks';

describe('ewfProfileShipmentDefault', () => {
    let sut;
    let $scope;
    let ctrl;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();

        ctrl = jasmine.createSpyObj('ProfileSettingsDefaultController', ['preloadTabFromUrl']);

        sut = new ewfProfileShipmentDefault();
    }));

    it('Should call controller to pre-load Printer settings', () => {
        sut.link.pre($scope, {}, {}, ctrl);
        expect(ctrl.preloadTabFromUrl).toHaveBeenCalled();
    });
});
