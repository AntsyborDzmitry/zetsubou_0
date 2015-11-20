import RegistrationService from './registration-service';

describe('RegistrationService', () => {
    let sut, $http, $timeout, logService, $httpBackend, deferred;

    beforeEach(inject(($q, _$httpBackend_, _$timeout_) => {
        deferred = $q.defer();
        $http = {
            get: jasmine.createSpy('get').and.returnValue(deferred.promise),
            post: jasmine.createSpy('post').and.returnValue(deferred.promise)
        };

        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        logService = jasmine.createSpyObj('logService', ['log']);

        sut = new RegistrationService($http, $q, logService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#verifyEmail', () => {
        const activationId = 123;

        beforeEach(() => {
            sut.verifyEmail(activationId);
        });

        it('should perform request to proper URL', () => {
            expect($http.get).toHaveBeenCalledWith(`/api/user/activate/${activationId}`);
        });

        it('should log success response', () => {
            deferred.resolve();
            $timeout.flush();

            expect(logService.log).toHaveBeenCalledWith('email verification done');
        });

        it('should log fail response', () => {
            const error = 'some error';
            deferred.reject(error);
            $timeout.flush();

            expect(logService.log).toHaveBeenCalledWith(`e-mail verification failed: ${error}`);
        });
    });

    describe('#registerNewUser', () => {
        const newUser = {
            email: 'some-email@mail.com'
        };
        const response = {
            data: 'some data'
        };

        beforeEach(() => {
            sut.registerNewUser(newUser);
        });

        it('should perform request to proper URL', () => {
            const user = {
                email: 'some-email@mail.com',
                userName: 'some-email@mail.com'
            };

            expect($http.post).toHaveBeenCalledWith('/api/user/signup', jasmine.objectContaining(user));
        });

        it('should log success response', () => {
            deferred.resolve(response);
            $timeout.flush();

            expect(logService.log).toHaveBeenCalledWith('new user registered successfully');
        });

        it('should log fail response', () => {
            deferred.reject(response);
            $timeout.flush();

            expect(logService.log).toHaveBeenCalledWith('New user\'s registration failed! ' + response.data);
        });
    });

    describe('#renewExpiredActivationLink', () => {
        const expiredLink = 'some-link';

        beforeEach(() => {
            sut.renewExpiredActivationLink(expiredLink);
        });

        it('should perform request to proper URL', () => {
            expect($http.get).toHaveBeenCalledWith(`/api/user/activationEmail/renewExpired/${expiredLink}`);
        });
    });
});
