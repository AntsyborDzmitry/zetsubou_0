import EwfPaymentType from './payment-type-directive';
import EwfShipmentController from '../ewf-shipment-controller';
import 'angularMocks';

describe('ewfPaymentType', () => {
    let sut;
    let $scope;
    let elem;
    let attrs;
    let controllers;
    let shipmentCtrl;
    let paymentTypeCtrl;
    let ewfFormCtrl;

    function callPostLink() {
        sut.link.post($scope, elem, attrs, controllers);
    }

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};

        shipmentCtrl = jasmine.mockComponent(new EwfShipmentController());
        paymentTypeCtrl = {};
        ewfFormCtrl = {};

        controllers = [shipmentCtrl, paymentTypeCtrl, ewfFormCtrl];

        sut = new EwfPaymentType();
    }));

    describe('#postLink', () => {
        it('should add step to shipment controller', () => {
            callPostLink();

            expect(shipmentCtrl.addStep).toHaveBeenCalledWith(paymentTypeCtrl);
        });
    });
});
