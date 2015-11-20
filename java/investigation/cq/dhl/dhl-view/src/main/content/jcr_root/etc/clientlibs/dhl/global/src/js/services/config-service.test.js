import ConfigService from './config-service';
import ThrottleService from './throttle-service';

import 'angularMocks';

describe('ewfcService', () => {
    let sut,
        $q,
        $http,
        $timeout,
        logService,
        throttleService,
        navigationService;

    const url = '/api/rules';
    const testRequest = 'some.test.value';
    const apiResponse = [{
        data: [{
            group: 'some',
            subGroup: 'test',
            alias: 'value',
            data: {
                value: true
            }
        }]
    }];

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        $http = jasmine.createSpyObj('$http', ['get', 'post']);

        $q.all = jasmine.createSpy('$q.all');
        $q.all.and.returnValue($q.when(apiResponse));

        navigationService = jasmine.createSpyObj('navigationService', ['getCountryLang']);
        navigationService.getCountryLang.and.returnValue({countryId: 1, langId: 2});
        logService = jasmine.createSpyObj('logService', ['error']);

        throttleService = jasmine.mockComponent(new ThrottleService());
        throttleService.createThrottleFunction = jasmine.createSpy('createThrottleFunctionSpy')
            .and.callFake((aggregationFn, throttleHandler) => (...aggregateArgs) => {
                aggregateArgs.unshift(null);
                const args = aggregationFn.apply(this, aggregateArgs);

                return $q.when(() => throttleHandler(args));
            });

        sut = new ConfigService($http, $q, logService, navigationService, throttleService);
        spyOn(sut, 'getValue').and.callThrough();

    }));

    describe('#getValue', () => {
        it('should use throttling for API calls aggregation', () => {
            sut.getValue(testRequest, 'US');
            expect(throttleService.createThrottleFunction).toHaveBeenCalled();
        });
        it('should call proper end-point with rules', () => {
            const expectedUrl = `${url}?country=US&groups=some`;

            sut.getValue(testRequest, 'US');

            $timeout.flush();
            expect($http.get).toHaveBeenCalledWith(expectedUrl);
        });
        it('should return proper structure', () => {
            sut.getValue(testRequest, 'US').then((response) => {
                expect(response).toEqual(apiResponse[0].data[0]);
            });

            $timeout.flush();
        });
        it('should make two API calls if different languages were applied', () => {
            const expectedUrl1 = `${url}?country=US&groups=some`;
            const expectedUrl2 = `${url}?country=UA&groups=some`;

            sut.getValue(testRequest, 'US');
            sut.getValue(testRequest, 'UA');

            $timeout.flush();
            expect($http.get).toHaveBeenCalledWith(expectedUrl1);
            expect($http.get).toHaveBeenCalledWith(expectedUrl2);
        });
    });

    describe('#getBoolean', () => {
        it('should make proper request for boolean value', () => {
            sut.getBoolean(testRequest, 'US');
            expect(sut.getValue).toHaveBeenCalledWith(testRequest, 'US');
        });
        it('should get a raw boolean value instead of full response object', () => {
            sut.getBoolean(testRequest, 'US').then((response) => {
                expect(response).toBe(apiResponse[0].data[0].data.value);
            });

            $timeout.flush();
        });
    });

    describe('#getBoolean', () => {
        it('should make proper request for boolean value', () => {
            sut.getBoolean(testRequest, 'US');
            expect(sut.getValue).toHaveBeenCalledWith(testRequest, 'US');
        });
        it('should get a raw boolean value instead of full response object', () => {
            sut.getBoolean(testRequest, 'US').then((response) => {
                expect(response).toBe(apiResponse[0].data[0].data.value);
            });

            $timeout.flush();
        });
    });

    describe('#getFormField', () => {
        it('should make proper request for boolean value', () => {
            sut.getFormField(testRequest, 'US');
            expect(sut.getValue).toHaveBeenCalledWith(testRequest, 'US');
        });
        it('should get a raw value instead of full response object', () => {
            sut.getFormField(testRequest, 'US').then((response) => {
                expect(response).toBe(apiResponse[0].data[0].data.value);
            });

            $timeout.flush();
        });
    });

});
