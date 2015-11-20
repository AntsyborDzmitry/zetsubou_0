import ResetPasswordController from './reset-password-controller';
import UserService from './../../services/user-service';
import NavigationService from './../../services/navigation-service';
import PasswordService from './../../services/password-service';
import LoginService from './../login/login-service';
import 'angularMocks';

describe('ResetPasswordController', () => {
    let modalService, logService, nlsService, navigationService, passwordService, userService, loginService;
    let $window, $scope;
    let sut, $q, $timeout, deferred;
    let username, password, error, fieldError;

    beforeEach(module('ewf'));
    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        username = 'username';
        password = 'password';
        $scope = {
            ewfFormCtrl: {
                ewfValidation: jasmine.createSpy().and.callFake(() => true)
            }
        };
        error = {
            data: {
                errors: ['error.error']
            }
        };
        fieldError = {
            data: {
                errors: ['error.error'],
                fieldErrors: {
                    newPassword: ['error.error']
                }
            }
        };

        deferred = $q.defer();

        modalService = jasmine.createSpyObj('modalService', ['showMessageDialog']);
        modalService.showMessageDialog.and.returnValue(deferred.promise);

        logService = jasmine.createSpyObj('logService', ['log']);

        nlsService = jasmine.createSpyObj('nlsService', ['getTranslation']);
        nlsService.getTranslation.and.returnValue(deferred.promise);

        navigationService = jasmine.mockComponent(new NavigationService());
        loginService = jasmine.mockComponent(new LoginService());

        passwordService = jasmine.mockComponent(new PasswordService());
        passwordService.validateResetToken.and.returnValue(deferred.promise);
        passwordService.validateCreateToken.and.returnValue(deferred.promise);
        passwordService.resetPassword.and.returnValue(deferred.promise);
        passwordService.createPassword.and.returnValue(deferred.promise);
        passwordService.changeExpiredPassword.and.returnValue(deferred.promise);
        passwordService.resendPasswordResetEmail.and.returnValue(deferred.promise);
        passwordService.resendPasswordCreateEmail.and.returnValue(deferred.promise);

        userService = jasmine.mockComponent(new UserService());
        userService.getUsername.and.returnValue(username);
        userService.getPassword.and.returnValue(password);

        sut = new ResetPasswordController(
            $window,
            $scope,
            modalService,
            logService,
            nlsService,
            navigationService,
            passwordService,
            loginService,
            userService
        );
    }));

    describe('#init', () => {
        it('should send validateResetToken request if scenario is reset password', () => {
            sut.scenario = 'reset';
            sut.token = '12e1e2r3ffew';

            sut.init();

            expect(passwordService.validateResetToken).toHaveBeenCalledWith(sut.token);
        });

        it('should send validateCreateToken request and translate title if scenario is create password', () => {
            const createTitleCode = 'resetpassword.create_password_action';

            sut.scenario = 'create';
            sut.token = '12e1e2r3ffew';

            sut.init();

            expect(nlsService.getTranslation).toHaveBeenCalledWith(createTitleCode);
            expect(passwordService.validateCreateToken).toHaveBeenCalledWith(sut.token);
        });

        it('should translate title and change password credential if scenario is change password', () => {
            const createTitleCode = 'resetpassword.change_password_action';

            sut.scenario = 'change';

            sut.init();

            expect(nlsService.getTranslation).toHaveBeenCalledWith(createTitleCode);
            expect(sut.tokenValidation).toEqual(true);
            expect(userService.getPassword).toHaveBeenCalled();
            expect(userService.getUsername).toHaveBeenCalled();
            expect(sut.expiredPassword).toEqual(password);
            expect(sut.username).toEqual(username);
        });
    });

    describe('#processTokenError', () => {
        const LINK_EXPIRED = 'errors.link_expired';
        const LINK_INVALID = 'errors.link_invalid';
        const errorData = {
            data: {
                errors: ['']
            },
            status: 400
        };

        const rejectDeferred = function(data) {
            deferred.reject(data);
            $timeout.flush();
        };

        it('should log error data', () => {
            rejectDeferred(errorData);
            expect(logService.log).toHaveBeenCalledWith(errorData);
        });

        it('should add error key to vm errors', () => {
            sut.errors = [];
            rejectDeferred(errorData);
            expect(sut.errors[0]).toEqual('errors.link_invalid');
        });

        it('should set tokenExpired flag and if error status is 400 and token experid', () => {
            errorData.data.errors[0] = LINK_EXPIRED;
            rejectDeferred(errorData);
            expect(sut.tokenExpired).toEqual(true);
        });

        it('should change title and redirect to login in case of invalid link and CREATE scenario', () => {
            sut.scenario = 'create';
            errorData.data.errors[0] = LINK_INVALID;
            rejectDeferred(errorData);
            expect(loginService.saveNextFormTitle).toHaveBeenCalledWith('resetpassword.create_password_already_used');
            expect(navigationService.redirectToLogin).toHaveBeenCalledWith();
        });

        it('should change title and redirect to login in case of invalid link and RESET scenario', () => {
            sut.scenario = 'reset';
            errorData.data.errors[0] = LINK_INVALID;
            rejectDeferred(errorData);
            expect(loginService.saveNextFormTitle).toHaveBeenCalledWith('resetpassword.reset_password_already_used');
            expect(navigationService.redirectToLogin).toHaveBeenCalledWith();
        });

    });

    describe('#resetPassword', () => {
        beforeEach(() => {
            sut.resetPassword();
        });

        it('should set submit reset', () => {
            expect(sut.submitted).toEqual(true);
        });

        it('should call resetPassword method of passwordService', () => {
            expect(passwordService.resetPassword).toHaveBeenCalledWith(sut.token, sut.password);
        });

        it('should show success dialog if reset password request success', () => {
            deferred.resolve();
            $timeout.flush();

            const dialogOptions = {
                nlsTitle: 'resetpassword.reset_password_success_title',
                nlsMessage: 'resetpassword.reset_password_success_message',
                okButtonNlsLabel: 'resetpassword.confirm'
            };
            expect(modalService.showMessageDialog).toHaveBeenCalledWith(dialogOptions);
        });

        it('should call redirectToLogin method of navigationService on dialog close', () => {
            deferred.resolve();
            $timeout.flush();

            expect(navigationService.redirectToLogin).toHaveBeenCalled();
        });

        it('should show error dialog if reset password request reject', () => {
            deferred.reject(error);
            $timeout.flush();

            expect(passwordService.resetPassword).toHaveBeenCalledWith(sut.token, sut.password);
            expect(logService.log).toHaveBeenCalledWith(error);
            expect(sut.errors).toEqual(error.data && error.data.errors);
        });

        it('should show error message if entered new password the same as old password', () => {
            deferred.reject(fieldError);
            $timeout.flush();
            expect(logService.log).toHaveBeenCalledWith(fieldError);
            expect(sut.errors).toEqual(fieldError.data.fieldErrors.newPassword);
        });
    });

    describe('#createPassword', () => {
        beforeEach(() => {
            sut.createPassword();
        });

        it('should set submit create', () => {
            expect(sut.submitted).toEqual(true);
        });

        it('should call createPassword method of passwordService', () => {
            expect(passwordService.createPassword).toHaveBeenCalledWith(sut.token, sut.password);
        });

        it('should show success dialog if create password request success', () => {
            deferred.resolve();
            $timeout.flush();

            const dialogOptions = {
                nlsTitle: 'resetpassword.create_password_success_title',
                nlsMessage: 'resetpassword.create_password_success_message',
                okButtonNlsLabel: 'resetpassword.confirm'
            };
            expect(modalService.showMessageDialog).toHaveBeenCalledWith(dialogOptions);
        });

        it('should call redirectToLogin method of navigationService on dialog close', () => {
            deferred.resolve();
            $timeout.flush();

            expect(navigationService.redirectToLogin).toHaveBeenCalled();
        });

        it('should show success dialog if create password request reject', () => {
            deferred.reject(error);
            $timeout.flush();

            expect(passwordService.createPassword).toHaveBeenCalledWith(sut.token, sut.password);
            expect(logService.log).toHaveBeenCalledWith(error);
            expect(sut.errors).toEqual(error.data && error.data.errors);
        });
    });

    describe('#changePassword', () => {
        beforeEach(() => {
            sut.changePassword();
        });

        it('should set submit change', () => {
            expect(sut.submitted).toEqual(true);
        });

        it('should call changeExpiredPassword method of passwordService', () => {
            expect(passwordService.changeExpiredPassword)
                .toHaveBeenCalledWith(sut.username, sut.expiredPassword, sut.password);
        });

        it('should show success dialog if change password request success', () => {
            deferred.resolve();
            $timeout.flush();

            const dialogOptions = {
                nlsTitle: 'resetpassword.change_password_success_title',
                nlsMessage: 'resetpassword.change_password_success_message',
                okButtonNlsLabel: 'resetpassword.confirm'
            };
            expect(modalService.showMessageDialog).toHaveBeenCalledWith(dialogOptions);
        });

        it('should call redirectToLogin method of navigationService on dialog close', () => {
            deferred.resolve();
            $timeout.flush();

            expect(navigationService.redirectToLogin).toHaveBeenCalled();
        });

        it('should show success dialog if change password request reject', () => {
            deferred.reject(error);
            $timeout.flush();

            expect(passwordService.changeExpiredPassword)
                .toHaveBeenCalledWith(sut.username, sut.expiredPassword, sut.password);
            expect(logService.log).toHaveBeenCalledWith(error);
            expect(sut.errors).toEqual(error.data && error.data.errors);
        });
    });

    describe('#resendPasswordResetEmail', () => {
        it('should redirect to login if resend password reset email request success', () => {
            sut.resendPasswordResetEmail();

            deferred.resolve();
            $timeout.flush();

            expect(passwordService.resendPasswordResetEmail).toHaveBeenCalledWith(sut.token);
            expect(navigationService.redirectToLogin).toHaveBeenCalled();
        });

        it('should redirect to login if resend password reset email request reject', () => {
            sut.resendPasswordResetEmail();

            deferred.reject(error);
            $timeout.flush();

            expect(passwordService.resendPasswordResetEmail).toHaveBeenCalledWith(sut.token);
            expect(logService.log).toHaveBeenCalledWith(error);
            expect(sut.errors).toEqual(error.data && error.data.errors);
        });
    });

    describe('#resendPasswordCreateEmail', () => {
        it('should redirect to login if resend password create email request success', () => {
            sut.resendPasswordCreateEmail();

            deferred.resolve();
            $timeout.flush();

            expect(passwordService.resendPasswordCreateEmail).toHaveBeenCalledWith(sut.token);
            expect(navigationService.redirectToLogin).toHaveBeenCalled();
        });

        it('should redirect to login if resend password create email request reject', () => {
            sut.resendPasswordCreateEmail();

            deferred.reject(error);
            $timeout.flush();

            expect(passwordService.resendPasswordCreateEmail).toHaveBeenCalledWith(sut.token);
            expect(logService.log).toHaveBeenCalledWith(error);
            expect(sut.errors).toEqual(error.data && error.data.errors);
        });
    });

    describe('#redirectToLogin', () => {
        it('should call #redirectToLogin function in navigation service', () => {
            sut.redirectToLogin();

            expect(navigationService.redirectToLogin).toHaveBeenCalled();
        });
    });

    describe('#validateResetForm', () => {
        it('should check if reset form valid', () => {
            const resetForm = {
                $valid: true
            };
            const result = sut.validateResetForm(resetForm);

            expect(result).toEqual(true);
        });
    });
});
