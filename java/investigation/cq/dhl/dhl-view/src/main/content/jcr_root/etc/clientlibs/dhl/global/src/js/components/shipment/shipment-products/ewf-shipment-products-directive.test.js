import EwfShipmentProducts from './ewf-shipment-products-directive';
import EwfShipmentProductsController from './ewf-shipment-products-controller';
import EwfShipmentController from './../ewf-shipment-controller';
import 'angularMocks';

describe('EwfShipmentProducts', () => {
    let sut;
    let $scope;
    let elem;
    let attrs;
    let productsCtrl;
    let shipmentCtrl;

    function callPreLink() {
        sut.link.pre($scope, elem, attrs, [shipmentCtrl, productsCtrl]);
    }

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};

        productsCtrl = new EwfShipmentProductsController();
        spyOn(productsCtrl, 'loadShipmentDates').and.stub();

        shipmentCtrl = new EwfShipmentController();

        sut = new EwfShipmentProducts();
    }));

    describe('#preLink', () => {
        it('should add controller to steps of main controller', () => {
            spyOn(shipmentCtrl, 'addStep');
            callPreLink();
            expect(shipmentCtrl.addStep).toHaveBeenCalledWith(productsCtrl);
        });
    });
});
