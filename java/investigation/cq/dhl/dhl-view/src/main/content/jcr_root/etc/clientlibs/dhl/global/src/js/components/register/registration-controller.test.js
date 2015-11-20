import RegistrationController from './registration-controller';
import 'angularMocks';

describe('RegistrationController', () => {
    let sut;
    let navigationService, registrationService, logService;
    let $q, $timeout, $rootScope;
    let registerUserDeferred, verifyEmailDeferred;

    const RESULT_STEP = 'result';
    const FORM_STEP = 'form';
    const ACTIVATION_STEP = 'verification';
    const activationId = 'activationId';

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;

        registerUserDeferred = $q.defer();
        verifyEmailDeferred = $q.defer();


        navigationService = jasmine.createSpyObj('navigationService', ['location']);

        logService = jasmine.createSpyObj('logService', ['error']);

        registrationService = jasmine.createSpyObj('registrationService', ['verifyEmail', 'registerNewUser']);
        registrationService.verifyEmail.and.returnValue(verifyEmailDeferred.promise);
        registrationService.registerNewUser.and.returnValue(registerUserDeferred.promise);

        sut = new RegistrationController($timeout, $q, navigationService, logService, registrationService);
    }));

    describe('#navigateToEmailActivationPage', () => {
        it('initial form step should be changed current step to set to ACTIVATION_STEP', () => {
            expect(sut.currentStep).toBe(FORM_STEP);
            sut.navigateToEmailActivationPage();
            expect(sut.currentStep).toBe(ACTIVATION_STEP);
        });
    });

    describe('#getActivationId', () => {
        it('returns vm.emailActivationId', () => {
            const idMock = 'IdMock';
            sut.emailActivationId = 'IdMock';
            expect(sut.getActivationId()).toBe(idMock);
        });
    });

    describe('#registerNewUser', () => {
        const userDTOMock = 'UserInfoGoesHere';

        it('registration should redirect to RESULT_STEP and set activationId to emailActivationId', () => {
            sut.registerNewUser(userDTOMock);

            registerUserDeferred.resolve(activationId);
            $timeout.flush();

            expect(registrationService.registerNewUser).toHaveBeenCalledWith(userDTOMock);
            expect(sut.currentStep).toEqual(RESULT_STEP);
            expect(sut.emailActivationId).toEqual(activationId);
        });

        it('registration controller should pass user to service call unmodified', () => {
            sut.registerNewUser(userDTOMock);

            expect(registrationService.registerNewUser).toHaveBeenCalledWith(userDTOMock);
        });

        it('registration should do $q.reject, to make sure we continue chain of catches', () => {
            const promise = sut.registerNewUser(userDTOMock);
            let rejected = false;
            registerUserDeferred.reject(activationId);
            $timeout.flush();

            expect(registrationService.registerNewUser).toHaveBeenCalledWith(userDTOMock);

            promise.catch(() => {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toBeTruthy();
        });
    });

    describe('#activateAccount', () => {
        it('should redirect to login.html if user has been activated', () => {
            sut.activateAccount();

            verifyEmailDeferred.resolve();
            $timeout.flush();
            $timeout.flush();

            expect(registrationService.verifyEmail).toHaveBeenCalledWith('');
            expect(navigationService.location).toHaveBeenCalledWith('auth/login.html');
        });

        it('should NOT redirect to login.html if user has NOT been activated', () => {
            sut.activateAccount();

            verifyEmailDeferred.reject();
            $timeout.flush();

            expect(registrationService.verifyEmail).toHaveBeenCalledWith('');
            expect(navigationService.location).not.toHaveBeenCalled();
        });
    });
});
