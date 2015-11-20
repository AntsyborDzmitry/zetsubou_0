import ewfEnhancedInvoiceAddress from './enhanced-invoice-address-directive';
import EwfEnhancedInvoiceAddressCtrl from './enhanced-invoice-address-controller';
import 'angularMocks';

describe('ewfEnhancedInvoiceAddress', () => {
    let sut;
    let $scope;
    let elem;
    let attrs;
    let ewfEnhancedInvoiceAddressCtrl;

    function callPreLink() {
        sut.link.pre($scope, elem, attrs, ewfEnhancedInvoiceAddressCtrl);
    }

    beforeEach(inject(function(_$rootScope_) {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};
        ewfEnhancedInvoiceAddressCtrl = jasmine.mockComponent(new EwfEnhancedInvoiceAddressCtrl());

        sut = new ewfEnhancedInvoiceAddress();
    }));

    describe('#postLink', () => {
        it('should init controller', () => {
            callPreLink();

            expect(ewfEnhancedInvoiceAddressCtrl.init).toHaveBeenCalled();
        });
    });
});
