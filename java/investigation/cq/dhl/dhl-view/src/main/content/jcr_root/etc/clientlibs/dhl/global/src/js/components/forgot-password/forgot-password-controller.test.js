import ForgotPasswordController from './forgot-password-controller';
import NavigationService from './../../services/navigation-service';
import PasswordService from './../../services/password-service';
import 'angularMocks';

describe('ForgotPasswordController', () => {
    let sut, $q, $timeout;
    let logService, navigationService, passwordService, $window, $scope;

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        navigationService = jasmine.mockComponent(new NavigationService());
        passwordService = jasmine.mockComponent(new PasswordService());
        $scope = jasmine.createSpyObj('$scope', ['$broadcast']);

        navigationService.PATHS = {
            LOGIN_PAGE: '/auth/login.html'
        };

        sut = new ForgotPasswordController($scope, $window, logService, navigationService, passwordService);
        sut.captcha = jasmine.createSpyObj('captcha', ['getCaptchaData', 'refresh']);
    }));

    describe('#sendResetPassword', () => {
        let formError, requestDefer;

        beforeEach(() => {
            requestDefer = $q.defer();
            passwordService.sendResetPassword.and.returnValue(requestDefer.promise);

            formError = {
                email: false,
                required: false,
                formatted: false
            };
        });

        it('should check if email field was filled incorrect', () => {
            formError.required = true;
            formError.formatted = true;

            sut.sendResetPassword(formError);
            expect(passwordService.sendResetPassword).not.toHaveBeenCalled();
        });

        it('should do check if email field was filled correct', () => {
            sut.email = 'userSuccess@test.com';

            sut.sendResetPassword(formError);
            requestDefer.resolve();
            $timeout.flush();

            expect(passwordService.sendResetPassword).toHaveBeenCalledWith(sut.email, sut.captcha.getCaptchaData());
        });

        it('should turn on "An email is on its way" block if request is success', () => {
            sut.email = 'userSuccess@test.com';
            sut.sendResetPassword(formError);
            requestDefer.resolve();
            $timeout.flush();

            expect(sut.isOnWay).toEqual(true);
        });

        it('should show error if request return 400 status', () => {
            const errorMsg = 'Email does not exist';
            sut.email = 'test@test.com';
            sut.sendResetPassword(formError);
            requestDefer.reject(errorMsg);
            $timeout.flush();

            expect(sut.error).toEqual(errorMsg);
        });

        it('should show error if request return 500 status', () => {
            const errorMsg = 'Service is currently unavailable';
            sut.email = 'user@test.com';
            sut.sendResetPassword(formError);
            requestDefer.reject(errorMsg);
            $timeout.flush();

            expect(sut.error).toEqual(errorMsg);
        });

        it('should return send-reset-password promise for ewf-click processing', () => {
            expect(sut.sendResetPassword(formError).then).toBeDefined();
        });
    });

    describe('#redirectToLoginPage', () => {
        it('should redirect to login page', () => {
            sut.redirectToLoginPage();
            expect(navigationService.redirectToLogin).toHaveBeenCalled();
        });
    });
});
