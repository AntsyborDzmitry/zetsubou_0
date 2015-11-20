import ewfPackageDetails from './package-details-directive';
import 'angularMocks';

describe('ewfPackageDetails', () => {
    let sut;
    let controllers, shipmentCtrl;
    const scope = {}, elem = {}, attrs = {};

    function callPostLink() {
        sut.link.post(scope, elem, attrs, controllers);
    }

    beforeEach(() => {
        shipmentCtrl = jasmine.createSpyObj('shipmentCtrl', ['addStep']);
        controllers = [shipmentCtrl, {}];

        sut = new ewfPackageDetails();
    });

    describe('#link', () => {
        it('should add step to shipment controller', () => {
            callPostLink();

            expect(shipmentCtrl.addStep).toHaveBeenCalledWith({});
        });
    });
});
