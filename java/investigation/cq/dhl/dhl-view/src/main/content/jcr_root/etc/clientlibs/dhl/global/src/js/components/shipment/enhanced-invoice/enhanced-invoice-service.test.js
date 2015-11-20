import enhancedInvoiceService from './enhanced-invoice-service';
import 'angularMocks';

describe('EnhancedInvoiceService', () => {
    let sut;
    let $httpBackend;

    beforeEach(inject((_$httpBackend_) => {
        $httpBackend = _$httpBackend_;

        sut = new enhancedInvoiceService();
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should return public API', () => {
        expect(sut).toEqual({});
    });
});
