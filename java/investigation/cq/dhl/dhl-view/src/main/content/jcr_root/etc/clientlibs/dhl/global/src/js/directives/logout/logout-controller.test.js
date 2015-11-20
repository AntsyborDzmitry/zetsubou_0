import LogoutController from './logout-controller';
import 'angularMocks';

describe('LogoutController', () => {
    let sut;
    let logService, navigationService, userService, loginService;
    let $q, $timeout;
    let logOutDeferred;

    beforeEach(module('ewf'));

    beforeEach(inject((_$q_, _$timeout_, _loginService_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        loginService = _loginService_;

        logOutDeferred = $q.defer();

        navigationService = jasmine.createSpyObj('navigationService', ['location', 'redirectToLogin']);

        userService = jasmine.createSpyObj('userService', ['logOut']);
        userService.logOut.and.returnValue(logOutDeferred.promise);

        sut = new LogoutController(logService, navigationService, userService, loginService);
    }));

    describe('#onElementClick', () => {
        let event;
        beforeEach(() => {
            event = jasmine.createSpyObj('event', ['preventDefault']);
            spyOn(sut, 'logoutUser');

            sut.onElementClick(event);
        });
        it('should prevent default behavior of an event', () => {
            expect(event.preventDefault).toHaveBeenCalled();
        });
        it('should call method for logout ', () => {
            expect(sut.logoutUser).toHaveBeenCalled();
        });
    });

    describe('#logoutUser', () => {
        it('should set logged out title for login form', () => {
            spyOn(loginService, 'saveNextFormTitle');

            sut.logoutUser();
            logOutDeferred.resolve();
            $timeout.flush();

            expect(loginService.saveNextFormTitle).toHaveBeenCalledWith('login.form_title_logged_out');
        });

        it('should redirect to login page after logout', () => {
            sut.logoutUser();
            logOutDeferred.resolve();
            $timeout.flush();
            expect(navigationService.redirectToLogin).toHaveBeenCalled();
        });
    });
});
