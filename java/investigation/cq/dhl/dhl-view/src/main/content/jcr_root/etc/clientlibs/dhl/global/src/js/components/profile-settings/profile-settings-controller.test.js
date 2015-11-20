import ProfileSettingsController from './profile-settings-controller';
import NavigationService from './../../services/navigation-service';
import EwfRewardCardsService from './../../services/ewf-reward-cards-service';
import 'angularMocks';

describe('ProfileSettingsController', function() {
    let sut;
    let navigationService, ewfRewardCardsService;

    beforeEach(inject((_$q_) => {
        navigationService = jasmine.mockComponent(new NavigationService({}));
        navigationService.getPath.and.returnValue('');

        ewfRewardCardsService = jasmine.mockComponent(new EwfRewardCardsService());
        ewfRewardCardsService.canShowRewardCards.and.returnValue(_$q_.when());
    }));

    describe('#constructor', () => {
        it('Should be set currentTab as Update user details by default', () => {
            sut = new ProfileSettingsController(navigationService, ewfRewardCardsService);
            expect(sut.currentTab).toBe(sut.DETAILS_UPDATE);
            expect(ewfRewardCardsService.canShowRewardCards).toHaveBeenCalledWith();
        });
    });

    describe('#ProfileSettingsController', () => {
        it('profile settings controller successfully called with params in url', () => {
            navigationService.getParamFromUrl.and.returnValue('rewardProgram');

            sut = new ProfileSettingsController(navigationService, ewfRewardCardsService);

            expect(sut.currentTab).toBe(sut.REWARD_UPDATE);
            expect(ewfRewardCardsService.canShowRewardCards).toHaveBeenCalledWith();
        });

        it('addressBook controller unsuccessfully called', () => {
            navigationService.getParamFromUrl.and.returnValue(undefined);

            sut = new ProfileSettingsController(navigationService, ewfRewardCardsService);

            expect(sut.currentTab).toBe(sut.DETAILS_UPDATE);
            expect(ewfRewardCardsService.canShowRewardCards).toHaveBeenCalledWith();
        });

        it('should enable show tab if tab is not REWARD_UPDATE with disabled showing of reward cards', () => {
            navigationService.getParamFromUrl.and.returnValue(undefined);

            sut = new ProfileSettingsController(navigationService, ewfRewardCardsService);

            sut.showRewardCards = false;
            expect(sut.canShowTabByName(sut.PASSWORD_UPDATE)).toBe(true);
        });

        it('should enable show tab if tab is not REWARD_UPDATE with enabled showing of reward cards', () => {
            navigationService.getParamFromUrl.and.returnValue(undefined);

            sut = new ProfileSettingsController(navigationService, ewfRewardCardsService);

            sut.showRewardCards = true;
            expect(sut.canShowTabByName(sut.PASSWORD_UPDATE)).toBe(true);
        });

        it('should disable show REWARD_UPDATE tab if tab is REWARD_UPDATE', () => {
            navigationService.getParamFromUrl.and.returnValue(undefined);

            sut = new ProfileSettingsController(navigationService, ewfRewardCardsService);

            sut.showRewardCards = false;
            expect(sut.canShowTabByName(sut.REWARD_UPDATE)).toBe(false);
        });

        it('should enable show REWARD_UPDATE tab if tab is REWARD_UPDATE', () => {
            navigationService.getParamFromUrl.and.returnValue(undefined);

            sut = new ProfileSettingsController(navigationService, ewfRewardCardsService);

            sut.showRewardCards = true;
            expect(sut.canShowTabByName(sut.REWARD_UPDATE)).toBe(true);
        });
    });
});
