import ewfShipment from './ewf-shipment-directive';
import EwfShipmentController from './ewf-shipment-controller';
import 'angularMocks';

describe('ewfShipment', () => {
    let sut;
    let $scope;
    let elem;
    let attrs;
    let ctrl;

    function callPostLink() {
        sut.link.post($scope, elem, attrs, ctrl);
    }

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};
        ctrl = new EwfShipmentController();
        spyOn(ctrl, 'init');

        sut = new ewfShipment();
    }));

    describe('#postLink', () => {
        it('should init the controller', () => {
            callPostLink();

            expect(ctrl.init).toHaveBeenCalled();
        });
    });
});
