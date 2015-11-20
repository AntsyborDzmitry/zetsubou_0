/**
 * Test suit for user service
 */
import userService from './user-service';
import 'angularMocks';

describe('userService', () => {
    let sut, $q, $http, $timeout, logService, localStorageService;
    let getDeferred, postDeferred;

    beforeEach(inject((_$http_, _$q_, _$timeout_) => {
        $http = _$http_;
        $q = _$q_;
        $timeout = _$timeout_;
        postDeferred = $q.defer();
        getDeferred = $q.defer();

        spyOn($http, 'post').and.returnValue(postDeferred.promise);
        spyOn($http, 'get').and.returnValue(getDeferred.promise);

        logService = jasmine.createSpyObj('logService', ['error']);
        localStorageService = jasmine.createSpyObj('localStorageService', ['set', 'get']);

        sut = new userService($http, $q, logService, localStorageService);
    }));

    describe('#logIn', () => {

        it('should send credentials to auth back-end service', () => {
            const url = '/api/auth/login';
            const username = 'test';
            const password = 'test';
            const credentials = {
                username,
                password
            };
            sut.logIn(username, password);
            expect($http.post).toHaveBeenCalledWith(url, credentials);
        });

        it('should log error when request failed ', () => {
            const errors = ['login.errorMessageCode'];
            const errorResponse = {
                status: 400,
                data: {
                    errors
                }
            };
            const errorLog = 'ERROR: userService#logIn: '
                + errorResponse.status + ' - '
                + errorResponse.data.errors[0];
            sut.logIn('test', 'test');
            postDeferred.reject(errorResponse);
            $timeout.flush();

            expect(logService.error).toHaveBeenCalledWith(errorLog);
        });

        it('should reject deferred on response error', () => {
            const errors = {errors: ['login.error_message_code']};
            const errorResponse = {
                status: 400,
                data: errors
            };
            spyOn($q, 'reject').and.callThrough();
            sut.logIn('test', 'test');
            postDeferred.reject(errorResponse);
            $timeout.flush();

            expect($q.reject).toHaveBeenCalledWith(errors);
        });

        it('should reject deferred with general error when server is unavailable', () => {
            const errors = {errors: ['login.server_temporary_unavailable']};
            const errorResponse = {
                status: 500
            };
            spyOn($q, 'reject').and.callThrough();
            sut.logIn('test', 'test');
            postDeferred.reject(errorResponse);
            $timeout.flush();

            expect($q.reject).toHaveBeenCalledWith(errors);
        });
    });

    describe('#logOut', () => {
        beforeEach(() => {
            spyOn($q, 'reject').and.callThrough();
        });

        it('should send logout request to appropriate api url', () => {
            const url = '/api/auth/logout';
            sut.logOut();
            expect($http.post).toHaveBeenCalledWith(url);
        });

        it('should reject deferred on response error', () => {
            const errors = {errors: ['some_error']};
            const errorResponse = {
                status: 500,
                data: errors
            };

            sut.logOut();
            postDeferred.reject(errorResponse);
            $timeout.flush();

            expect($q.reject).toHaveBeenCalledWith(errors);
        });
    });

    it('should set username to localStorage', () => {
        const username = 'john';
        sut.setUsername(username);
        expect(localStorageService.set).toHaveBeenCalledWith('dhlUsername', username);
    });

    it('should return stored username from localStorage', () => {
        const storedUsername = 'smith';
        localStorageService.get.and.returnValue(storedUsername);

        const result = sut.getUsername();
        expect(localStorageService.get).toHaveBeenCalledWith('dhlUsername');
        expect(result).toBe(storedUsername);
    });

    it('should get information about user', () => {
        const url = '/api/auth/whoami';
        sut.whoAmI();
        expect($http.get).toHaveBeenCalledWith(url);
    });
});
