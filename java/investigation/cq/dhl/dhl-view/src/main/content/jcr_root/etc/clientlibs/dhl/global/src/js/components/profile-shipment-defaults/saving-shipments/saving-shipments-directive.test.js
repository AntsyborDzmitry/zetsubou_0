import SavingShipments from './saving-shipments-directive';
//import SavingShipmentsController from './saving-shipments-controller';
import 'angularMocks';

describe('SavingShipments', () => {
    let sut;
    let $scope;
    let ctrl;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();

        ctrl = jasmine.createSpyObj(
            'SavingShipmentsController',
            [
                'preloadDefaultSavingShipment',
                'preloadSectionFromUrl'
            ]);

        sut = new SavingShipments();
    }));

    it('should call controller to pre-load preloadDefaultSavingShipment', () => {
        sut.link.pre($scope, {}, {}, ctrl);
        expect(ctrl.preloadDefaultSavingShipment).toHaveBeenCalled();
    });

    it('should call controller to pre-load preloadSectionFromUrl', () => {
        sut.link.pre($scope, {}, {}, ctrl);
        expect(ctrl.preloadSectionFromUrl).toHaveBeenCalled();
    });
});
