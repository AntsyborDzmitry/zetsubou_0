import EwfShipmentCost from './ewf-shipment-cost-directive';
import EwfShipmentCostController from './ewf-shipment-cost-controller';
import EwfShipmentController from './../ewf-shipment-controller';
import 'angularMocks';

describe('EwfShipmentCost', () => {
    let sut;
    let $scope;
    let elem;
    let attrs;
    let costCtrl;
    let shipmentCtrl;

    function callPreLink() {
        sut.link.pre($scope, elem, attrs, [shipmentCtrl, costCtrl]);
    }

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};
        costCtrl = new EwfShipmentCostController();
        shipmentCtrl = new EwfShipmentController();

        sut = new EwfShipmentCost();
    }));

    describe('#preLink', () => {
        it('should add controller to steps of main controller', () => {
            spyOn(shipmentCtrl, 'addStep');

            callPreLink();

            expect(shipmentCtrl.addStep).toHaveBeenCalledWith(costCtrl);
        });
    });
});
