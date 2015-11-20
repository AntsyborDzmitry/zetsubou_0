/**
 * Test suit for shipmentTypeService
 */
import ShipmentTypeService from './shipment-type-service';
import ShipmentErrorService from './../ewf-shipment-error-service';
import 'angularMocks';

describe('shipmentTypeService', () => {
    let sut, logService, shipmentErrorService, $httpBackend;
    const error = 'some error';

    beforeEach(inject(($http, $q, _$httpBackend_) => {
        $httpBackend = _$httpBackend_;
        logService = jasmine.createSpyObj('logService', ['error']);
        shipmentErrorService = jasmine.mockComponent(new ShipmentErrorService());

        sut = new ShipmentTypeService($http, $q, logService, shipmentErrorService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getReferencesDetails', () => {
        it('should make API call to proper URL', () => {
            const fromContactId = 1;
            const toContactId = 2;
            $httpBackend.whenGET(`/api/shipment/reference/details/${fromContactId}/${toContactId}`).respond(422, error);
            sut.getReferencesDetails(fromContactId, toContactId);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(`References list failed with ${error}`);
        });
    });

    describe('#getReferenceBehavior', () => {
        it('should make API call to proper URL', () => {
            const countryCode = 'US';
            $httpBackend.whenGET(`/api/shipment/reference/guest/behavior/${countryCode}`).respond(422, error);
            sut.getReferenceBehavior(countryCode);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(`Reference behavior failed with ${error}`);
        });
    });

    describe('#getShipmentParameters', () => {
        it('should make API call to proper URL', () => {
            const fromCountry = 'US';
            const toCountry = 'UA';
            const url = `/api/shipment/parameters/${fromCountry}/${toCountry}`;
            $httpBackend.whenGET(url).respond(401, 'some error');
            sut.getShipmentParameters(fromCountry, toCountry);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalled();
        });
    });
});
