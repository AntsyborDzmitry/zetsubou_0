import LoginController from './login-controller';
import UserService from './../../services/user-service';
import NavigationService from './../../services/navigation-service';
import ModalService from './../../services/modal/modal-service';
import EwfFormCtrl from './../../directives/ewf-form/ewf-form-controller';
import 'angularMocks';

describe('LoginController', () => {
    let sut;
    let navigationService, userService, loginService, modalService;
    let $q, $timeout, $scope;
    let logInDeferred, resendActivationEmailDeferred, modalDeferred;
    let usernameTest = 'user@mail.com';
    let resolveTitleSpy, testTitle;
    let isPasswordExpiredSpy, isUserInactiveSpy, isUserInactiveAndActivationExpiredSpy;

    beforeEach(module('ewf'));
    beforeEach(inject((_$q_, _$timeout_, _$rootScope_, _loginService_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $scope = _$rootScope_.$new();

        loginService = _loginService_;

        modalService = jasmine.mockComponent(new ModalService());

        logInDeferred = $q.defer();
        modalDeferred = $q.defer();
        resendActivationEmailDeferred = $q.defer();

        navigationService = jasmine.mockComponent(new NavigationService());

        userService = jasmine.mockComponent(new UserService());
        userService.logIn.and.returnValue(logInDeferred.promise);
        userService.getUsername.and.returnValue(usernameTest);
        userService.resendActivationEmail.and.returnValue(resendActivationEmailDeferred.promise);
        testTitle = 'login.test_title';
        resolveTitleSpy = spyOn(loginService, 'resolveFormTitle').and.returnValue(testTitle);

        isPasswordExpiredSpy = spyOn(loginService, 'isPasswordExpired');
        isUserInactiveSpy = spyOn(loginService, 'isUserInactive');
        isUserInactiveAndActivationExpiredSpy = spyOn(loginService, 'isUserInactiveAndActivationExpired');

        sut = new LoginController($scope, modalService, navigationService, userService, loginService);
        sut.ewfFormCtrl = jasmine.mockComponent(new EwfFormCtrl());
    }));

    describe('#constructor', () => {
        it('should init username with remembered value', () => {
            expect(sut.username).toBe(usernameTest);
        });

        it('should get form title from login service', () => {
            expect(resolveTitleSpy).toHaveBeenCalled();
        });
    });

    describe('#logIn', () => {
        let dataTest = {};
        let validationStatus = {
            $valid: true
        };

        beforeEach(() => {
            spyOn($scope, '$broadcast');
            dataTest = {
                authResult: 'SUCCESS',
                loginMessageCode: 'login.success',
                paperlessTrading: false,
                shipmentExpert: false
            };
        });

        it('should call userService#logIn with entered credentials', () => {
            sut.username = 'smith';
            sut.password = 'password';
            sut.logIn(validationStatus);
            expect(userService.logIn).toHaveBeenCalledWith(sut.username, sut.password);
        });

        it('should set this.loginErrors to empty array', () => {
            sut.loginErrors = [];
            sut.logIn(validationStatus);
            expect(sut.loginErrors).toEqual([]);
        });

        it('should set form state as submitted', () => {
            sut.logIn(validationStatus);
            expect($scope.submitted).toBeTruthy();
        });

        it('should call for validation when form submitted', () => {
            sut.logIn(validationStatus);
            expect($scope.$broadcast).toHaveBeenCalledWith('ValidateForm');
        });

        describe('remember me in LogIn', () => {
            it('should store username with user service if remember me is chosen', () => {
                sut.rememberMe = true;
                sut.username = 'john';
                sut.logIn(validationStatus);
                logInDeferred.resolve(dataTest);
                $timeout.flush();
                expect(userService.setUsername).toHaveBeenCalledWith(sut.username);
            });

            it('should not store username if remember me is not chosen', () => {
                sut.rememberMe = false;
                sut.logIn(validationStatus);
                logInDeferred.resolve(dataTest);
                $timeout.flush();
                expect(userService.setUsername).not.toHaveBeenCalled();
            });
        });

        describe('errors in LogIn', () => {
            const errors = {
                errors: {
                    errors: ['nls_key']
                }
            };
            it('should translate message code', () => {
                sut.logIn(validationStatus);
                logInDeferred.reject(errors);
                $timeout.flush();
                expect(sut.ewfFormCtrl.setErrorsFromResponse).toHaveBeenCalledWith(errors);
            });

            it('should handle expired password opening modalService', () => {
                isPasswordExpiredSpy.and.returnValue(true);
                sut.logIn(validationStatus);
                logInDeferred.reject(errors);
                $timeout.flush();
                expect(modalService.showDialog).toHaveBeenCalled();
            });

            it('should change formTitle and set make userInactive truthy if user is inactive', () => {
                isUserInactiveSpy.and.returnValue(true);
                sut.logIn(validationStatus);
                logInDeferred.reject(errors);
                $timeout.flush();
                expect(sut.userInactive).toBeTruthy();
                expect(sut.formTitle).toEqual(loginService.titles.DEFAULT);
            });

            it('should change formTitle and set userInactive truthy if user inactive and activation expired', () => {
                isUserInactiveAndActivationExpiredSpy.and.returnValue(true);
                sut.logIn(validationStatus);
                logInDeferred.reject(errors);
                $timeout.flush();
                expect(sut.userInactive).toBeTruthy();
                expect(sut.formTitle).toEqual(loginService.titles.ACTIVATION_EMAIL_EXPIRED);
            });
        });

        describe('do redirect in LogIn', () => {
            it('should redirect to shipping.html if user is shipping expert', () => {
                const data = {
                    authResult: 'SUCCESS',
                    loginMessageCode: 'login.success',
                    paperlessTrading: false,
                    shipmentExpert: true
                };

                sut.logIn(validationStatus);
                logInDeferred.resolve(data);
                $timeout.flush();

                expect(navigationService.location).toHaveBeenCalledWith('shipment.html');
            });

            it('should redirect to dashboard.html if persona has paperless trading', () => {
                const data = {
                    authResult: 'SUCCESS',
                    loginMessageCode: 'login.success',
                    paperlessTrading: true,
                    shipmentExpert: false
                };

                sut.logIn(validationStatus);
                logInDeferred.resolve(data);
                $timeout.flush();

                expect(navigationService.location).toHaveBeenCalledWith('dashboard.html');
            });

            it('should redirect to user-profile.html by default', () => {
                const data = {
                    authResult: 'SUCCESS',
                    loginMessageCode: 'login.success',
                    paperlessTrading: false,
                    shipmentExpert: false
                };

                sut.logIn(validationStatus);
                logInDeferred.resolve(data);
                $timeout.flush();

                expect(navigationService.location).toHaveBeenCalledWith('user-profile.html');
            });
        });
    });

    describe('#closeStopCreditDialog', () => {
        it('should redirect to user profile after closing Stop Credit dialog if user has credit stop', () => {
            let validationStatus = {
                $valid: true
            };
            const data = {
                authResult: 'SUCCESS',
                loginMessageCode: 'login.success',
                paperlessTrading: false,
                shipmentExpert: false,
                accountCreditStopMsg: 'message'
            };
            modalService.showDialog.and.returnValue({
                result: modalDeferred.promise,
                close: function() {
                    modalDeferred.resolve();
                    $timeout.flush();
                }
            });
            sut.logIn(validationStatus);
            logInDeferred.resolve(data);
            $timeout.flush();
            sut.closeStopCreditDialog();

            expect(navigationService.location).toHaveBeenCalledWith('user-profile.html');
        });
    });

    describe('#resendActivationEmail', () => {
        beforeEach(() => {
            sut.resendActivationEmail();
        });

        it('should test resendActivationEmail', () => {
            expect(userService.resendActivationEmail).toHaveBeenCalledWith(sut.username);
        });
    });
});
