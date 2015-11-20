import ewfAddressDetails from './address-details-directive';
import 'angularMocks';

describe('', () => {
    let sut;
    let $scope;
    let elem;
    let attrs;
    let controllers;
    let ewfShipmentCtrl;
    let ewfAddressDetailsCtrl;

    function callPostLink() {
        sut.link.post($scope, elem, attrs, controllers);
    }

    beforeEach(inject(function(_$rootScope_) {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};
        ewfShipmentCtrl = jasmine.createSpyObj('ewfShipmentCtrl', ['addStep']);
        ewfAddressDetailsCtrl = jasmine.createSpyObj('ewfAddressDetailsCtrl', ['init', 'getName']);
        controllers = [ewfShipmentCtrl, ewfAddressDetailsCtrl];

        sut = new ewfAddressDetails();
    }));

    describe('#postLink', () => {
        it('should add controller to steps of main controller', () => {
            callPostLink();

            expect(ewfShipmentCtrl.addStep).toHaveBeenCalledWith(ewfAddressDetailsCtrl);
        });
    });
});
