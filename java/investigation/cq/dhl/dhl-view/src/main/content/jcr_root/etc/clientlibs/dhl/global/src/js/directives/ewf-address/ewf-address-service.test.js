import EwfAddressService from './ewf-address-service';
import 'angularMocks';

describe('EwfAddressService', () => {
    let sut, logService, $httpBackend;
    const countryCode = 'US';
    const error = 'some error';

    beforeEach(inject(($http, $q, _$httpBackend_) => {
        $httpBackend = _$httpBackend_;
        logService = jasmine.createSpyObj('logService', ['error']);

        sut = new EwfAddressService($http, $q, logService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getAddresses', () => {
        it('should make API call to proper URL', () => {
            const query = 'test-query';
            $httpBackend.whenGET(`/api/admr/address/${countryCode}/${query}`).respond(422, error);
            sut.getAddresses(countryCode, query);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(jasmine.objectContaining({data: error}));
        });

        it('should filter response by correct fields', () => {
            const query = 'Qwe';
            const data = [
                {
                    street: `str${query}eet`.toUpperCase(),
                    city: 'city'.toUpperCase(),
                    district: 'district'.toUpperCase()
                },
                {
                    street: 'street',
                    city: 'city',
                    district: 'district'
                },
                {
                    street: 'street',
                    city: `c${query}ity`.toLowerCase(),
                    district: 'district'.toUpperCase()
                },
                {
                    street: 'street',
                    city: `ci${query}ty`,
                    district: `distric${query}t`.toUpperCase()
                }
            ];

            $httpBackend.whenGET(`/api/admr/address/${countryCode}/${query}`).respond(200, data);

            sut.getAddresses(countryCode, query).then((response) => {
                expect(response.length).toEqual(3);
                expect(response[2].data).toEqual(data[3]);
            });

            $httpBackend.flush();
        });
    });

    describe('#addressSearchByZipCode', () => {
        it('should make API call to proper URL', () => {
            const zipCode = '12345';
            $httpBackend.whenGET(`/api/addressbook/search?countryCode=${countryCode}&zipCode=${zipCode}`)
                            .respond(422, error);
            sut.addressSearchByZipCode(countryCode, zipCode);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(jasmine.objectContaining({data: error}));
        });
    });

    describe('#addressSearchByCity', () => {
        const city = '12345';

        it('should make API call to proper URL', () => {
            $httpBackend.whenGET(`/api/addressbook/search?countryCode=${countryCode}&city=${city}`).respond(422, error);
            sut.addressSearchByCity(countryCode, city);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(jasmine.objectContaining({data: error}));
        });
    });

    describe('#getShipmentAddressDefaults', () => {
        it('should load defaults for shipment address from backend', () => {
            const defaults = {
                residentialDefault: false
            };
            $httpBackend.whenGET('/api/myprofile/shipment/defaults/address').respond(200, defaults);
            sut.getShipmentAddressDefaults().then((data) => {
                expect(data).toEqual(defaults);
            });

            $httpBackend.flush();
        });

        it('should log error if it happend', () => {
            $httpBackend.whenGET('/api/myprofile/shipment/defaults/address').respond(500, error);
            sut.getShipmentAddressDefaults();
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(jasmine.objectContaining({
                data: error
            }));
        });
    });
});
