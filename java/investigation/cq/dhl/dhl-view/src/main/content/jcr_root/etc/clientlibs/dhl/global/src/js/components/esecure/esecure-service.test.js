/**
 * Test suit for user service
 */
import eSecureService from './esecure-service';
import 'angularMocks';

describe('esecure-service', () => {
    let sut, $q, $http, $timeout, logService, successCallback, errorCallback;

    beforeEach(inject((_$http_, _$q_, _$timeout_) => {
        $http = _$http_;
        $q = _$q_;
        $timeout = _$timeout_;

        logService = jasmine.createSpyObj('logService', ['error']);

        sut = new eSecureService($http, $q, logService);
    }));

    describe('getToken', () => {
        let getDeferred;

        beforeEach(() => {
            getDeferred = $q.defer();
            successCallback = jasmine.createSpy('successCallback');
            errorCallback = jasmine.createSpy('errorCallback');

            spyOn($http, 'get').and.returnValue(getDeferred.promise);
        });

        it('should load token by auth/esecure url', () => {
            sut.getToken();
            expect($http.get).toHaveBeenCalledWith('/api/auth/esecure');
        });

        it('should return response data on success', () => {
            const testToken = 'testToken';
            const responseStub = {data: testToken};

            sut.getToken().then(successCallback);

            getDeferred.resolve(responseStub);
            $timeout.flush();

            expect(successCallback).toHaveBeenCalledWith(testToken);
        });

        it('should reject the promise and respond with error', () => {
            const errorResponse = {
                status: 403,
                data: {
                    message: 'fail'
                }
            };

            sut.getToken().then(successCallback, errorCallback);

            getDeferred.reject(errorResponse);

            $timeout.flush();

            expect(errorCallback).toHaveBeenCalledWith(errorResponse.data);
        });
    });
});
