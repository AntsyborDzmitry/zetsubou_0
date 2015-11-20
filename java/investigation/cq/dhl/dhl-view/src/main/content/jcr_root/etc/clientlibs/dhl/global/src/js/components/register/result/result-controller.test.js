import RegistrationSuccessController from './result-controller';

describe('RegistrationSuccessController', () => {
    let sut;

    beforeEach(() => {
        sut = new RegistrationSuccessController();
    });

    const registrationResult = {
        accountHolder: true
    };
    const registrationController = {
        getActivationId: jasmine.createSpy('getActivationId').and.returnValue(registrationResult),
        navigateToEmailActivationPage: jasmine.createSpy('navigateToEmailActivationPage')
    };

    describe('#setRegistrationController', () => {
        beforeEach(() => {
            sut.setRegistrationController(registrationController);
        });

        it('should get activation id from registration controller', () => {
            expect(registrationController.getActivationId).toHaveBeenCalled();
        });

        it('should set isAccountHolder flag to vm', () => {
            expect(sut.isAccountHolder).toEqual(registrationResult.accountHolder);
        });
    });

    describe('#activateAccount', () => {
        beforeEach(() => {
            sut.setRegistrationController(registrationController);
            sut.activateAccount();
        });

        it('should trigger account activation', () => {
            expect(registrationController.navigateToEmailActivationPage).toHaveBeenCalled();
        });
    });
});
