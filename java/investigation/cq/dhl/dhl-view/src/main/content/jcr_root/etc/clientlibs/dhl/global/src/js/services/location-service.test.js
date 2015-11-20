/**
 * Test suit for location service
 */
import locationService from './location-service';
import 'angularMocks';

describe('locationService', () => {

    let sut, getRequestDeferred, logService, localStorageService, locationsApiUrl;
    let $http, $q, $timeout, $cookies;

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        $cookies = {};

        locationsApiUrl = '/api/location/list';
        getRequestDeferred = $q.defer();

        $http = {
            get: jasmine.createSpy('get').and.returnValue(getRequestDeferred.promise)
        };

        logService = jasmine.createSpyObj('logService', ['error']);
        localStorageService = jasmine.createSpyObj('localStorageService', ['set', 'get']);

        sut = new locationService($http, $q, $cookies, logService, localStorageService);
    }));

    describe('#loadAvailableLocations', () => {
        let successCb, failCb;

        beforeEach(() => {
            successCb = jasmine.createSpy('successCb');
            failCb = jasmine.createSpy('failCb');
        });

        it('should call for $http.get with precise url', () => {
            sut.loadAvailableLocations();
            expect($http.get).toHaveBeenCalledWith(locationsApiUrl);
        });

        it('should load locations ', () => {
            const successResponse = {
                status: 200,
                data: [{
                    code: 'ukr',
                    code2: 'UK',
                    name: 'UKRAINE'
                }]
            };

            sut.loadAvailableLocations()
                .then(successCb, failCb);

            getRequestDeferred.resolve(successResponse);

            $timeout.flush();

            const firstLetter = successResponse.data[0].name.charAt(0).toUpperCase();
            const lastPartOfWord = successResponse.data[0].name.substr(1).toLowerCase();

            expect(successCb).toHaveBeenCalledWith(successResponse.data);
            expect(successResponse.data[0].flag).toBe(`flag_${successResponse.data[0].code2}`);
            expect(successResponse.data[0].capitalizedName).toBe(`${firstLetter}${lastPartOfWord}`);
            expect(logService.error).not.toHaveBeenCalled();
        });

        it('should log error when load data failed', () => {
            const errorResponse = {
                status: 403,
                data: {
                    message: 'fail'
                }
            };

            sut.loadAvailableLocations()
                .then(successCb, failCb);

            getRequestDeferred.reject(errorResponse);

            $timeout.flush();

            expect(failCb).toHaveBeenCalledWith(errorResponse.data);
            expect(logService.error).toHaveBeenCalled();
        });
    });

    describe('#saveCountry', () => {
        it('should set country into cookies', () => {
            let countryCode = 'usa';
            let country = {
                code3: countryCode,
                name: 'USA'
            };

            sut.saveCountry(country);

            expect($cookies.defaultCountry).toBe(countryCode);
        });
    });
});
