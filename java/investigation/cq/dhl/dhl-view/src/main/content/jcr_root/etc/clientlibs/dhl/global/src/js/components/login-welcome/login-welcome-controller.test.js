import LoginWelcomeController from './login-welcome-controller';
import ModalService from './../../services/modal/modal-service';

describe('LoginWelcomeController', function() {
    // system under test
    let sut;

    let $scope, modalService, modalWindow;

    beforeEach(inject((_$rootScope_) => {

        $scope = _$rootScope_.$new();
        modalService = jasmine.mockComponent(new ModalService());
        modalWindow = jasmine.createSpyObj('modalWindow', ['close']);
        modalService.showDialog.and.returnValue(modalWindow);

        sut = new LoginWelcomeController($scope, modalService);
    }));


    it('opens Registration Benefits popup with correct options', function() {
        sut.openRegistrationBenefitsPopup();
        expect(modalService.showDialog).toHaveBeenCalledWith({
            closeOnEsc: true,
            scope: $scope,
            windowClass: jasmine.any(String),
            template: jasmine.any(String)
        });
    });
});
