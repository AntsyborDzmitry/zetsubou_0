import 'angularMocks';
import PickupPackagings from './pickup-packagings-directive';
import PickupPackagingsCtrl from './pickup-packagings-controller';

describe('packagings', () => {
    let sut;
    let ctrl;
    let scope;

    beforeEach(inject(($rootScope) => {
        scope = $rootScope.$new();
        ctrl = jasmine.mockComponent(new PickupPackagingsCtrl());
        sut = new PickupPackagings();
    }));

    function invokePostLink() {
        sut.link.post(scope, {}, {}, ctrl);
    }

    describe('#postLink', () => {
        const packagings = [];

        beforeEach(() => {
            scope.packagings = packagings;
        });

        it('sets packagings to controller', () => {
            invokePostLink();

            expect(ctrl.packagings).toBe(packagings);
        });

        it('updates packaging types when shipper country has changed', () => {
            invokePostLink();

            scope.country = 'GB';
            scope.$apply();

            expect(ctrl.onShipperCountryUpdate).toHaveBeenCalled();
        });

        it('adds packaging if initial packagings collection is empty', () => {
            invokePostLink();

            expect(ctrl.addPackaging).toHaveBeenCalled();
        });
    });
});
