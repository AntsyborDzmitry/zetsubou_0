/**
 * Test suit for itarService
 */
import ewfItarService from './ewf-itar-service';
import ShipmentErrorService from './../../ewf-shipment-error-service';
import ConfigService from './../../../../services/config-service';
import 'angularMocks';

describe('ewfItarService', () => {
    let sut, logService, shipmentErrorService, $httpBackend, configService, configDeffered, $q, $timeout;
    const error = 'some error';

    beforeEach(inject(($http, _$q_, _$timeout_, _$httpBackend_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $httpBackend = _$httpBackend_;
        configDeffered = $q.defer();
        logService = jasmine.createSpyObj('logService', ['error']);
        shipmentErrorService = jasmine.mockComponent(new ShipmentErrorService());
        configService = jasmine.mockComponent(new ConfigService());
        configService.getValue.and.returnValue(configDeffered.promise);
        configService.getBoolean.and.returnValue(configDeffered.promise);

        sut = new ewfItarService($http, $q, logService, configService, shipmentErrorService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getItarDetails', () => {
        it('should make API call to proper URL', () => {
            $httpBackend.whenGET(`/api/shipment/itar/details/US`).respond(422, error);
            sut.getItarDetails('US');
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(`Critical shipment item price failed with ${error}`);
        });
    });

    describe('#getCriticalShipmentItem', () => {
        it('should make call to configService and return just number of critical shipment value', () => {
            const criticalShipmentItem = {
                data: {
                    value: 'USD 2,500'
                }
            };
            const key = 'Shipment Details.EEI.critical.shipment.item.value';
            const country = 'US';

            const result = sut.getCriticalShipmentItem(country);
            configDeffered.resolve(criticalShipmentItem);
            $timeout.flush();
            result.then((response) => {
                expect(response).toEqual(`2500`);
            });
            expect(configService.getValue).toHaveBeenCalledWith(key, country);
        });
    });

    describe('#getEnableItarValue', () => {
        it('should make call to configService and return boolean - shall we show itar block or not', () => {
            const key = 'Shipment Details.EEI.enable.eei';
            const country = 'US';

            sut.getEnableItarValue(country);
            expect(configService.getBoolean).toHaveBeenCalledWith(key, country);
        });
    });
});
