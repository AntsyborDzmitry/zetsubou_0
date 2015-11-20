import EwfCrudService from './ewf-crud-service';
import 'angularMocks';

describe('EwfCrudService', () => {

    let sut, url, logService, requestDeferred;
    let $http, $q, $timeout, $rootScope;

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;

        requestDeferred = $q.defer();

        $http = {
            get: jasmine.createSpy('get').and.returnValue(requestDeferred.promise),
            post: jasmine.createSpy('post').and.returnValue(requestDeferred.promise),
            put: jasmine.createSpy('put').and.returnValue(requestDeferred.promise),
            delete: jasmine.createSpy('delete').and.returnValue(requestDeferred.promise)
        };

        logService = jasmine.createSpyObj('logService', ['error', 'log']);

        sut = new EwfCrudService($http, $q, logService);

        url = 'http://myurl.com';
    }));

    describe('#should request data by proper endpoint URL', () => {

        it('should call for $http.get', () => {
            sut.getElementList(url);
            expect($http.get).toHaveBeenCalled();
        });

        it('should load locations ', () => {
            const successResponse = {
                status: 200,
                data: [{
                    id: '1234567',
                    name: 'User'
                }]
            };

            sut.getElementList(url)
                .then((response) => {
                    expect(response).toBe(successResponse.data);
                    expect(logService.error).not.toHaveBeenCalled();
                });

            requestDeferred.resolve(successResponse);

            $timeout.flush();

        });

        it('should log error when load data failed', () => {
            const errorResponse = {
                status: 403,
                data: {
                    message: 'fail'
                }
            };

            sut.getElementList(url)
                .then((response) => {
                    expect(response).toBe(errorResponse.data);
                    expect(logService.error).toHaveBeenCalled();
                });

            requestDeferred.reject(errorResponse);

            $timeout.flush();
        });
    });

    describe('#updateElement', () => {
        const requestData = {name: 'some request data'};
        const successResponse = {
            status: 200,
            data: {}
        };
        const errorResponse = {
            status: 403,
            data: {
                message: 'fail'
            }
        };

        beforeEach(() => {
            sut.updateElement(url, requestData);
        });

        it('should make POST HTTP request with correct params', () => {
            expect($http.post).toHaveBeenCalledWith(url, requestData);
        });

        it('should not make any other HTTP requests', () => {
            expect($http.get).not.toHaveBeenCalled();
            expect($http.put).not.toHaveBeenCalled();
            expect($http.delete).not.toHaveBeenCalled();
        });

        it('should log successful request', () => {
            requestDeferred.resolve(successResponse);
            $rootScope.$apply();

            expect(logService.log).toHaveBeenCalledWith(jasmine.any(String), successResponse);
            expect(logService.error).not.toHaveBeenCalled();
        });

        it('should log error when request failed', () => {
            requestDeferred.reject(errorResponse);
            $rootScope.$apply();

            expect(logService.error).toHaveBeenCalledWith(jasmine.any(String), errorResponse);
            expect(logService.log).not.toHaveBeenCalled();
        });
    });

    describe('#changeElement', () => {
        const requestData = {name: 'some request data'};
        const successResponse = {
            status: 200,
            data: {}
        };
        const errorResponse = {
            status: 403,
            data: {
                message: 'fail'
            }
        };

        beforeEach(() => {
            sut.changeElement(url, requestData);
        });

        it('should make PUT HTTP request with correct params', () => {
            expect($http.put).toHaveBeenCalledWith(url, requestData);
        });

        it('should not make any other HTTP requests', () => {
            expect($http.get).not.toHaveBeenCalled();
            expect($http.post).not.toHaveBeenCalled();
            expect($http.delete).not.toHaveBeenCalled();
        });

        it('should log successful request', () => {
            requestDeferred.resolve(successResponse);
            $timeout.flush();

            expect(logService.log).toHaveBeenCalledWith(jasmine.any(String), successResponse);
            expect(logService.error).not.toHaveBeenCalled();
        });

        it('should log error when request failed', () => {
            requestDeferred.reject(errorResponse);
            $rootScope.$apply();

            expect(logService.error).toHaveBeenCalledWith(jasmine.any(String), errorResponse);
            expect(logService.log).not.toHaveBeenCalled();
        });
    });

    describe('#deleteElement', () => {
        const successResponse = {
            status: 200,
            data: {}
        };
        const errorResponse = {
            status: 403,
            data: {
                message: 'fail'
            }
        };

        beforeEach(() => {
            sut.deleteElement(url);
        });

        it('should make DELETE HTTP request', () => {
            expect($http.delete).toHaveBeenCalledWith(url, undefined);
        });

        it('should not make any other HTTP requests', () => {
            expect($http.get).not.toHaveBeenCalled();
            expect($http.post).not.toHaveBeenCalled();
            expect($http.put).not.toHaveBeenCalled();
        });

        it('should log successful request', () => {
            requestDeferred.resolve(successResponse);
            $rootScope.$apply();

            expect(logService.log).toHaveBeenCalledWith(jasmine.any(String), successResponse);
            expect(logService.error).not.toHaveBeenCalled();
        });

        it('should log error when request failed', () => {
            requestDeferred.reject(errorResponse);
            $rootScope.$apply();

            expect(logService.error).toHaveBeenCalledWith(jasmine.any(String), errorResponse);
            expect(logService.log).not.toHaveBeenCalled();
        });
    });
});
