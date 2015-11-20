import shipmentInsurance from './shipment-insurance-directive';
import 'angularMocks';

describe('shipmentInsurance', () => {
    let sut;
    let $scope;
    let ctrl;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();

        ctrl = jasmine.createSpyObj('InsuranceController', ['preloadSectionFromUrl']);

        sut = new shipmentInsurance();
    }));

    it('should call controller to pre-load settings', () => {
        sut.link.pre($scope, {}, {}, ctrl);
        expect(ctrl.preloadSectionFromUrl).toHaveBeenCalled();
    });
});
