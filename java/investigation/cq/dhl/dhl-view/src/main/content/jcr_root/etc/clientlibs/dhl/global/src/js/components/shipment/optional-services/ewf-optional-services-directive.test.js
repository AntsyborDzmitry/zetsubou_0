import EwfPickup from './ewf-optional-services-directive';
import EwfPickupController from './ewf-optional-services-controller';
import EwfShipmentController from './../ewf-shipment-controller';
import 'angularMocks';

describe('EwfPickup', () => {
    let sut;
    let $scope;
    let elem;
    let attrs;
    let pickupCtrl;
    let shipmentCtrl;

    function callPreLink() {
        sut.link.pre($scope, elem, attrs, [shipmentCtrl, pickupCtrl]);
    }

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};
        pickupCtrl = new EwfPickupController();
        shipmentCtrl = new EwfShipmentController();

        sut = new EwfPickup();
    }));

    describe('#preLink', () => {
        it('should add controller to steps of main controller', () => {
            spyOn(shipmentCtrl, 'addStep');

            callPreLink();

            expect(shipmentCtrl.addStep).toHaveBeenCalledWith(pickupCtrl);
        });
    });
});
