import EmailVerification from './email-verification-directive';
import EmailVerificationController from './verification-controller';

describe('EmailVerification', () => {
    let sut, $scope, elem, attrs, registrationController, verificationController;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};

        verificationController = jasmine.mockComponent(new EmailVerificationController());
        registrationController = {};

        sut = new EmailVerification();
    }));

    describe('preLink', () => {
        beforeEach(() => {
            const controllers = [registrationController, verificationController];
            sut.link.pre($scope, elem, attrs, controllers);
        });

        it('should set registrationController', () => {
            expect(verificationController.setRegistrationController).toHaveBeenCalledWith(registrationController);
        });
    });
});

