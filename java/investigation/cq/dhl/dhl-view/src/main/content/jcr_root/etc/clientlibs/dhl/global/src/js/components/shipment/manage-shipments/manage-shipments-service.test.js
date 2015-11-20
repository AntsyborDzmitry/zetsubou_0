import 'angularMocks';
import ManageShipmentsService from './manage-shipments-service';

describe('manageShipmentsService', () => {
    let sut;
    let $httpBackend;
    let logService;

    const shipment = {
        id: 1,
        airWayBillNumber: '5264465194',
        name: 'Package for John',
        savedDate: '11/22/2014',
        manifested: false,
        fromAddress: {
            cityName: 'Wellesley',
            postCode: '02482',
            addressLine1: '1260 Grove St'
        },
        toAddress: {
            cityName: 'York',
            postCode: '073-0134',
            addressLine1: '366-1193 Higashi 4-jominami'
        },
        fromName: 'Adriaan Adelheid',
        toName: 'John Takekoshi',
        fromCompany: 'Acme Inc.',
        toCompany: 'Zaamdoway'
    };

    beforeEach(inject(($http, _$httpBackend_, $q) => {
        $httpBackend = _$httpBackend_;

        logService = jasmine.createSpyObj('logService', ['error']);

        sut = new ManageShipmentsService($http, $q, logService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getShipments', () => {
        const url = '/api/shipment';

        let result, error;

        beforeEach(() => {
            sut.getShipments()
                .then((res) => {
                    result = res;
                })
                .catch((err) => {
                    error = err;
                });
        });

        it('should return shipment array if there are no errors', () => {
            $httpBackend.whenGET(url).respond(200, [shipment]);
            $httpBackend.flush();

            expect(result).toEqual([shipment]);
        });

        it('should log error', () => {
            const err = {
                status: 400,
                data: 'Bad request'
            };

            $httpBackend.whenGET(url).respond(err.status, err.data);
            $httpBackend.flush();

            expect(logService.error).toHaveBeenCalledWith(jasmine.objectContaining(err));
        });

        it('should return error', () => {
            const err = {
                status: 400,
                data: 'Bad request'
            };

            $httpBackend.whenGET(url).respond(err.status, err.data);
            $httpBackend.flush();

            expect(error).toEqual(jasmine.objectContaining(err));
        });
    });
});
