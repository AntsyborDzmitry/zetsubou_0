import EmailVerificationController from './verification-controller';
import RegistrationController from './../registration-controller';
import 'angularMocks';

describe('EmailVerificationController', () => {
    let sut;
    let modalService, logService, registrationController;
    let $q, $timeout, $rootScope;
    let verificationDeferred;

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;

        verificationDeferred = $q.defer();

        registrationController = jasmine.mockComponent(new RegistrationController());
        registrationController.activateAccount.and.returnValue(verificationDeferred.promise);
        registrationController.renewActivationLink.and.returnValue(verificationDeferred.promise);

        logService = jasmine.createSpyObj('logService', ['error']);
        modalService = jasmine.createSpyObj('modalService', ['showDialog']);

        sut = new EmailVerificationController(logService, $rootScope, modalService);
        sut.setRegistrationController(registrationController);
    }));

    describe('#setRegistrationController', () => {
        it('should run email verification in registration controller', () => {
            expect(registrationController.activateAccount).toHaveBeenCalled();
        });

        it('should mark verify flag as true', () => {
            verificationDeferred.resolve();
            $timeout.flush();

            expect(sut.verified).toEqual(true);
        });

        describe('when verification is failed', () => {
            let error, errorKey;

            beforeEach(() => {
                errorKey = 'errors.link_expired';
                error = {
                    data: {
                        errors: [errorKey]
                    }
                };
            });

            it('should set proper flag when link is expired', () => {
                verificationDeferred.reject(error);
                $timeout.flush();

                expect(sut.expired).toEqual(true);
            });

            it('should not set expired flag for another keys returned', () => {
                error.data.errors[0] = 'errors.any_other_error';
                verificationDeferred.reject(error);
                $timeout.flush();

                expect(sut.expired).toEqual(false);
            });

            it('should set invalid flag when activation request is failed', () => {
                errorKey = 'invalid link';
                verificationDeferred.reject(error);
                $timeout.flush();

                expect(sut.invalid).toEqual(true);
            });

            it('should log error', () => {
                verificationDeferred.reject(error);
                $timeout.flush();

                expect(logService.error).toHaveBeenCalled();
            });
        });

    });

    describe('#renewExpiredActivationLink', () => {
        beforeEach(() => {
            sut.renewExpiredActivationLink();
        });

        it('should process renew activation link', () => {
            expect(registrationController.renewActivationLink).toHaveBeenCalled();
        });

        it('should show modal window', () => {
            verificationDeferred.resolve();
            $timeout.flush();

            expect(modalService.showDialog).toHaveBeenCalled();
        });

        it('should process renew activation link fail', () => {
            verificationDeferred.reject('Link is not expired');
            $timeout.flush();

            expect(logService.error).toHaveBeenCalled();
        });
    });
});
