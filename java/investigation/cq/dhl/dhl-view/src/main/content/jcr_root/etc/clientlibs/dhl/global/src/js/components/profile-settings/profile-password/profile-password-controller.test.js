import ProfilePasswordController from './profile-password-controller';
import ProfileSettingsService from './../profile-settings-service';
import EwfSpinnerService from './../../../services/ewf-spinner-service';
import 'angularMocks';

describe('ProfilePasswordController', () => {
    let sut, $q, $timeout, $scope, deferedGet;
    let systemSettingsMock, profileSettingsServiceMock, ewfSpinnerServiceMock;

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $scope = _$rootScope_.$new();
        deferedGet = $q.defer();
        systemSettingsMock = {};

        profileSettingsServiceMock = jasmine.mockComponent(new ProfileSettingsService());
        ewfSpinnerServiceMock = jasmine.mockComponent(new EwfSpinnerService());

        profileSettingsServiceMock.updateProfilePassword.and.returnValue(deferedGet.promise);
        profileSettingsServiceMock.getAuthenticationDetails.and.returnValue(deferedGet.promise);

        sut = new ProfilePasswordController(
            $scope,
            $timeout,
            profileSettingsServiceMock,
            systemSettingsMock,
            ewfSpinnerServiceMock
        );
    }));

    it('should check that spinner handler called on initialize', () => {
        const successResponse = {
            status: 200,
            userName: 'Anonymous'
        };
        deferedGet.resolve(successResponse);
        $timeout.flush();
        expect(ewfSpinnerServiceMock.applySpinner).toHaveBeenCalled();
    });

    it('should check if service is called', () => {
        const successResponse = {
            status: 200,
            userName: 'Anonymous'
        };

        deferedGet.resolve(successResponse);
        $timeout.flush();

        expect(profileSettingsServiceMock.getAuthenticationDetails).toHaveBeenCalled();

        expect(sut.emailAddress).toBe(successResponse.userName);
    });

    it('should display error if service failed', () => {
        const rejectResponse = {
            status: 500,
            data: {
                message: 'fail'
            }
        };

        deferedGet.reject(rejectResponse);
        $timeout.flush();

        expect(profileSettingsServiceMock.getAuthenticationDetails).toHaveBeenCalled();
    });

    it('should check if password updated', () => {
        sut.oldPassword = 'password';
        sut.newPassword = 'passwordNew';
        const successResponse = {
            status: 200,
            data: [{
                id: '1234567',
                name: 'User'
            }]
        };

        sut.updatePassword();

        deferedGet.resolve(successResponse);
        $timeout.flush();

        expect(profileSettingsServiceMock.getAuthenticationDetails).toHaveBeenCalled();
        expect(profileSettingsServiceMock.updateProfilePassword).toHaveBeenCalled();

        expect(sut.profilePasswordResponse).toBe(successResponse);
    });

    it('should run save password process if old and new pass are same', () => {
        sut.oldPassword = 'password';
        sut.newPassword = 'passwordNew';

        sut.updatePassword();

        expect(profileSettingsServiceMock.getAuthenticationDetails).toHaveBeenCalled();
    });
});
