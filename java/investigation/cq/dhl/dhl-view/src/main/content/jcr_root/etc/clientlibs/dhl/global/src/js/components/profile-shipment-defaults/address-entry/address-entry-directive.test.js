import addressEntry from './address-entry-directive';
import AddressEntryController from './address-entry-controller';
import 'angularMocks';

describe('shipmentReference', () => {
    let sut;
    let addressEntryCtrl;
    let $scope, elem, attrs;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};

        addressEntryCtrl = jasmine.mockComponent(new AddressEntryController());

        sut = new addressEntry();
    }));

    function postLinkInit() {
        sut.link.post($scope, elem, attrs, addressEntryCtrl);
    }

    describe('postLink function', () => {
        beforeEach(() => {
            postLinkInit();
        });

        it('should call init function of controller', () => {
            expect(addressEntryCtrl.init).toHaveBeenCalled();
        });

        it('should check current tab', () => {
            expect(addressEntryCtrl.preloadSectionFromUrl).toHaveBeenCalled();
        });
    });
});
