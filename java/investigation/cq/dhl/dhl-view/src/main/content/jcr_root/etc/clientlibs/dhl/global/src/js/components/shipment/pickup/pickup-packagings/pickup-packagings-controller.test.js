import 'angularMocks';
import PickupPackagingsCtrl from './pickup-packagings-controller';
import PackagingService from './../../package-details/package-details-service';

describe('PickupPackagingsCtrl', () => {
    let sut;
    let packagingService;
    let $q;
    let $timeout;

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        packagingService = jasmine.mockComponent(new PackagingService());
        packagingService.getPackagingDetails.and.returnValue($q.when([]));

        sut = new PickupPackagingsCtrl(packagingService);
    }));

    describe('#onShipperCountryUpdate', () => {
        it('loads packaging types', () => {
            const shipperCountry = 'GB';
            const packagingTypes = [{id: 'asd'}, {id: 'sdf'}];
            packagingService.getPackagingDetails.and.returnValue($q.when({packagingList: packagingTypes}));

            sut.onShipperCountryUpdate(shipperCountry);
            $timeout.flush();

            expect(packagingService.getPackagingDetails).toHaveBeenCalledWith('BOTH', shipperCountry, true);
            expect(sut.packagingTypes).toBe(packagingTypes);
        });
    });

    describe('#removePackaging', () => {
        it('removes packaging and updates model', () => {
            const packaging = {id: 'asd'};
            const packagings = [{id: 'sdf'}, packaging];
            sut.packagings = packagings;

            sut.removePackaging(packaging);

            expect(sut.packagings.indexOf(packaging)).toBe(-1);
            expect(sut.packagings[1]).toBeUndefined();
        });
    });

    describe('#addPackaging', () => {
        it('adds packaging and updates model', () => {
            const packagings = [{id: 'asd'}];
            sut.packagings = packagings;

            sut.addPackaging();

            expect(sut.packagings[1]).toBeDefined();
        });
    });

    describe('#hasOnlyOnePackaging', () => {
        it('returns true if there is only one packaging', () => {
            sut.packagings = [{id: 'asd'}, {id: 'sdf'}];
            expect(sut.hasOnlyOnePackaging()).toBe(false);

            sut.packagings = [];
            expect(sut.hasOnlyOnePackaging()).toBe(false);

            sut.packagings = [{id: 'asd'}];
            expect(sut.hasOnlyOnePackaging()).toBe(true);
        });
    });

    describe('#getMaxQty', () => {
        const maxQuantity = 5;
        const packagingTypes = [
            {id: 'asd', maxQuantity},
            {id: 'sdf', maxQuantity: 4}
        ];

        it('serves max quantity for packaging from packaging types', () => {
            const packaging = {id: 'asd'};

            sut.packagingTypes = packagingTypes;

            expect(sut.getMaxQty(packaging)).toBe(maxQuantity);
        });

        it('serves empty packaging type is not found', () => {
            const packaging = {id: 'NON_EXISTING'};

            sut.packagingTypes = packagingTypes;

            expect(sut.getMaxQty(packaging)).toBe('');
        });
    });

    describe('#onPackagingTypeChange', () => {
        it('resets packaging quantity to default (1)', () => {
            const packaging = {id: 'asd', quantity: 10};
            sut.onPackagingTypeChange(packaging);

            expect(packaging.quantity).toEqual(1);
        });
    });
});
