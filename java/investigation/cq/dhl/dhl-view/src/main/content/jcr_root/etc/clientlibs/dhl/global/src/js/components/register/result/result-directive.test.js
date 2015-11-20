import RegistrationResult from './result-directive';
import RegistrationSuccessController from './result-controller';

describe('RegistrationResult', () => {
    let sut, $scope, elem, attrs, registrationController, registrationSuccessCtrl;

    beforeEach(inject((_$rootScope_) => {
        $scope = _$rootScope_.$new();
        elem = {};
        attrs = {};

        registrationSuccessCtrl = jasmine.mockComponent(new RegistrationSuccessController());
        registrationController = {};

        sut = new RegistrationResult();
    }));

    describe('preLink', () => {
        beforeEach(() => {
            const controllers = [registrationController, registrationSuccessCtrl];
            sut.link.pre($scope, elem, attrs, controllers);
        });

        it('should set registrationController', () => {
            expect(registrationSuccessCtrl.setRegistrationController).toHaveBeenCalledWith(registrationController);
        });
    });
});

