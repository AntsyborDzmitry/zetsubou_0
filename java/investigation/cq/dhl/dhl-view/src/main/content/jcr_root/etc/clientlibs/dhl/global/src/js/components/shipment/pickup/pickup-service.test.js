/**
 * Test suit for pickupService
 */
import PickupService from './pickup-service';
import 'angularMocks';

describe('pickupService', () => {
    let sut, logService;
    let $httpBackend, $http, $q, $timeout;

    beforeEach(inject((_$http_, _$q_, _$httpBackend_, _$timeout_) => {
        $httpBackend = _$httpBackend_;
        $http = _$http_;
        $q = _$q_;
        $timeout = _$timeout_;
        logService = jasmine.createSpyObj('logService', ['log']);

        sut = new PickupService($http, $q, logService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getPickupLocations', () => {
        it('should make API call to proper URL', () => {
            const shipmentCountry = 'US';
            // TODO: change endpoint to proper endpoint
            const endpointUrl = `/api/shipment/pickup/locations/list/${shipmentCountry}`;
            spyOn($http, 'get').and.returnValue($q.when({}));
            sut.getPickupLocations(shipmentCountry);

            expect($http.get).toHaveBeenCalledWith(endpointUrl);
        });

        it('should log error on fail', () => {
            const defer = $q.defer();
            const shipmentCountry = 'US';
            const data = 'Validation error';
            spyOn($http, 'get').and.returnValue(defer.promise);
            sut.getPickupLocations(shipmentCountry);
            defer.reject({data});
            $timeout.flush();

            expect(logService.log).toHaveBeenCalledWith(`Pickup locations failed with ${data}`);
        });
    });

    describe('#getLatestBooking', () => {
        it('should return latest booking', () => {
            const product = {
                bookingCutoffOffset: 3600000,
                pickupCutoffTime: 50400000
            };
            expect(sut.getLatestBooking(product)).toBe(46800000);
        });
    });

    describe('#getUserProfileDefaultValues', () => {
        let defer;

        beforeEach(() => {
            defer = $q.defer();
            spyOn($http, 'get').and.returnValue(defer.promise);
        });

        it('should make API call to proper URL', () => {
            const endpointUrl = `/api/myprofile/shipment/defaults/pickup`;
            sut.getUserProfileDefaultValues();
            defer.reject({data: null});
            $timeout.flush();

            expect($http.get).toHaveBeenCalledWith(endpointUrl);
        });

        it('should log error on fail', () => {
            const data = 'Validation error';
            sut.getUserProfileDefaultValues();
            defer.reject({data});
            $timeout.flush();

            expect(logService.log).toHaveBeenCalledWith(`Pickup default values failed with ${data}`);
        });

        it('should return error if there are no default values', () => {
            const data = null;
            sut.getUserProfileDefaultValues();
            defer.resolve({data});
            $timeout.flush();

            expect(logService.log).toHaveBeenCalledWith(`Pickup default values failed with ${data}`);
        });
    });

    describe('#getBookingReferenceNumber', () => {
        let defer;
        const pickupDate = '2015-11-06';
        const pickupAddress = {
            countryCode: 'Country Code',
            stateOrProvince: 'State Or Province',
            cityName: 'City',
            postCode: 'Zip Or Post Code',
            addressLine1: 'Address Line 1'
        };

        beforeEach(() => {
            defer = $q.defer();
            spyOn($http, 'post').and.returnValue(defer.promise);
        });

        it('should make API call to proper URL', () => {
            // TODO: change endpoint to proper endpoint
            const endpointUrl = `/api/shipment/pickup/search`;
            sut.getBookingReferenceNumber(pickupDate, pickupAddress);
            defer.reject({data: null});
            $timeout.flush();
            expect($http.post).toHaveBeenCalledWith(endpointUrl, {pickupDate, pickupAddress});
        });

        it('should log error on fail', () => {
            const error = 'Validation error';
            sut.getBookingReferenceNumber(pickupDate, pickupAddress);
            defer.reject({data: error});
            $timeout.flush();

            expect(logService.log).toHaveBeenCalledWith(`Booking Reference Number failed with ${error}`);
        });

        it('should return error if there is no booking reference number', () => {
            const error = [];
            sut.getBookingReferenceNumber(pickupDate, pickupAddress);
            defer.resolve({data: error});
            $timeout.flush();

            expect(logService.log).toHaveBeenCalledWith(`Booking Reference Number failed with ${error}`);
        });

        it('should return first element from response on success', () => {
            const data = ['1', '2'];
            let promise = sut.getBookingReferenceNumber(pickupDate, pickupAddress);
            defer.resolve({data});
            $timeout.flush();

            promise.then((element) => {
                expect(element).toBe(data[0]);
            });
        });
    });
});
