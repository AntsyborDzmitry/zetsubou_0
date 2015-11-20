import ItemAttributesService from './item-attributes-service';
import 'angularMocks';

describe('itemAttributesService', () => {
    let sut;
    let logService;
    let $httpBackend;

    beforeEach(inject(($http, $q, _$httpBackend_) => {
        $httpBackend = _$httpBackend_;
        logService = jasmine.createSpyObj('logService', ['error']);

        sut = new ItemAttributesService($http, $q, logService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getShipmentItemAttributesDetails', () => {
        it('should make API call to proper URL', () => {
            $httpBackend.whenGET('/api/shipment/itemAttributes/details').respond(401, 'some error');
            sut.getShipmentItemAttributesDetails();
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(
                'ItemAttributesService#getShipmentItemAttributesDetails: response error',
                jasmine.any(Object)
            );
        });
    });

    describe('#getCommodityCodeCategories', () => {
        it('should make API call to proper URL', () => {
            const url = '/api/shipment/itemAttributes/commodityCodeCategories';

            $httpBackend.whenGET(url).respond(401, 'some error');
            sut.getCommodityCodeCategories();
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(
                'ItemAttributesService#getCommodityCodeCategories: response error',
                jasmine.any(Object)
            );
        });
    });

    describe('#getCommodityCodeSubcategories', () => {
        it('should make API call to proper URL', () => {
            const categoryId = 9;
            const url = `/api/shipment/itemAttributes/commodityCodeSubcategories/${categoryId}`;

            $httpBackend.whenGET(url).respond(401, 'some error');
            sut.getCommodityCodeSubcategories(categoryId);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(
                'ItemAttributesService#getCommodityCodeSubcategories: response error',
                jasmine.any(Object)
            );
        });
    });

    describe('#getCommodityCodes', () => {
        it('should make API call to proper URL', () => {
            const categoryId = 8;
            const subcategoryId = 7;
            const query = 'test';
            const url = `/api/shipment/itemAttributes/commodityCodes?
                            categoryId=${categoryId}&subcategoryId=${subcategoryId}&descriptionPart=${query}`;

            $httpBackend.whenGET(url).respond(401, 'some error');
            sut.getCommodityCodes(query, categoryId, subcategoryId);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(
                'ItemAttributesService#getCommodityCodes: response error',
                jasmine.any(Object)
            );
        });
    });

    describe('#saveShipmentItemAttributes', () => {
        it('should make API call to proper URL', () => {
            const itemAttributesRow = {};
            $httpBackend.whenPOST('/api/shipment/itemAttributes/save').respond(401, 'some error');
            sut.saveShipmentItemAttributes(itemAttributesRow);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(
                'ItemAttributesService#saveShipmentItemAttributes: response error',
                jasmine.any(Object)
            );
        });
    });

    describe('#getShippingPurposeList', () => {
        it('should make API call to proper URL', () => {
            const countryCode = 'US';
            const url = `/api/shipment/customsInvoice/purpose/list/${countryCode}`;

            $httpBackend.whenGET(url).respond(401, 'some error');
            sut.getShippingPurposeList(countryCode);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(
                'ItemAttributesService#getShippingPurposeList: response error',
                jasmine.any(Object)
            );
        });
    });

    describe('#getCountries', () => {
        it('should make API call to proper URL', () => {
            $httpBackend.whenGET('/api/location/list').respond(401, 'some error');
            sut.getCountries();
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(
                'ItemAttributesService#getCountries: response error',
                jasmine.any(Object)
            );
        });
    });
});
