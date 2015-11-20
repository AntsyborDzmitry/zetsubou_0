import sessionExpiredInterceptor from './session-expired-interceptor';
import 'angularMocks';

describe('sessionExpiredInterceptor', () => {
    let sut;
    let $q, $timeout;
    let logService, loginService, navigationService;

    beforeEach(module('ewf'));

    beforeEach(inject((_$q_, _$timeout_, _loginService_, _navigationService_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        loginService = _loginService_;
        navigationService = _navigationService_;

        logService = jasmine.createSpyObj('logService', ['log']);

        spyOn(loginService, ['saveNextFormTitle']);
        spyOn(navigationService, ['redirectToLogin']);

        sut = new sessionExpiredInterceptor($q, logService, loginService, navigationService);
    }));

    describe('#responseError', () => {
        describe('when HTTP 401', () => {
            const rejection = {status: 401};

            it('should log error', () => {
                sut.responseError(rejection);
                expect(logService.log)
                    .toHaveBeenCalledWith('HTTP 401: Session Expired Interceptor - redirect to login page');
            });

            it('should set session timeout title for login form', () => {
                sut.responseError(rejection);
                expect(loginService.saveNextFormTitle).toHaveBeenCalledWith(loginService.titles.SESSION_TIMED_OUT);
            });

            it('should redirect to login page', () => {
                sut.responseError(rejection);
                expect(navigationService.redirectToLogin).toHaveBeenCalled();
            });
        });

        describe('when HTTP not 401', () => {
            const rejection = {status: 500};

            it('should not redirect to login page', () => {
                sut.responseError(rejection);
                expect(navigationService.redirectToLogin).not.toHaveBeenCalled();
            });
        });

        it('should return rejected promise', () => {
            const promise = sut.responseError({status: 401});
            const rejectCallback = jasmine.createSpy(rejectCallback);
            promise.catch(rejectCallback);
            $timeout.flush();
            expect(rejectCallback).toHaveBeenCalled();
        });
    });
});
