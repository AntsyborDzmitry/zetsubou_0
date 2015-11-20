import shipmentReference from './shipment-reference-directive';
import ShipmentReferenceController from './shipment-reference-controller';
import EwfContainerController from './../../directives/ewf-container/ewf-container-controller';
import 'angularMocks';

describe('shipmentReference', () => {
    let sut;
    let shipmentReferenceCtrl;
    let ewfContainerCtrl;
    let $scope, elem, attrs;
    const gridCtrl = {};

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};

        shipmentReferenceCtrl = jasmine.mockComponent(new ShipmentReferenceController());
        ewfContainerCtrl = jasmine.mockComponent(new EwfContainerController());
        ewfContainerCtrl.getRegisteredControllerInstance.and.returnValue(gridCtrl);
        sut = new shipmentReference();
    }));

    function postLinkInit() {
        sut.link.post($scope, elem, attrs, [shipmentReferenceCtrl, ewfContainerCtrl]);
    }

    describe('postLink function', () => {
        beforeEach(() => {
            postLinkInit();
        });

        it('should call to init function of controller', () => {
            expect(shipmentReferenceCtrl.init).toHaveBeenCalled();
        });

        it('should assign grid controller to controller variable', () => {
            expect(shipmentReferenceCtrl.gridCtrl).toEqual(gridCtrl);
        });
    });
});
