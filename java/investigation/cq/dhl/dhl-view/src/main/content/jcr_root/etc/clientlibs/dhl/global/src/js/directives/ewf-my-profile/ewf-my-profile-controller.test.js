import EwfMyProfileController from './ewf-my-profile-controller';
import EwfRewardCardsService from './../../services/ewf-reward-cards-service';
import 'angularMocks';

describe('ProfileSettingsController', function() {
    let sut;
    let ewfRewardCardsService, ewfRewardCardsServiceDefer;
    let $timeout;

    const attrs = {urlWithLang: 'test value'};

    beforeEach(inject((_$timeout_, _$q_) => {
        const $q = _$q_;
        const $scope = jasmine.createSpyObj('$scope', ['$eval']);
        ewfRewardCardsServiceDefer = $q.defer();

        $scope.$eval.and.returnValue(attrs.urlWithLang);
        $timeout = _$timeout_;

        ewfRewardCardsService = jasmine.mockComponent(new EwfRewardCardsService());
        ewfRewardCardsService.canShowRewardCards.and.returnValue(ewfRewardCardsServiceDefer.promise);

        sut = new EwfMyProfileController($scope, attrs, ewfRewardCardsService);
    }));

    it('should be initialized controller', () => {
        expect(sut.urlWithLang).toBe(attrs.urlWithLang);
    });

    it('should get reward cards program availability', () => {
        ewfRewardCardsServiceDefer.resolve();
        $timeout.flush();
        expect(ewfRewardCardsService.canShowRewardCards).toHaveBeenCalledWith();
    });

    it('should enable showing reward cards', () => {
        sut.showRewardCards = false;
        ewfRewardCardsServiceDefer.resolve(true);
        $timeout.flush();

        expect(sut.showRewardCards).toBe(true);
    });

    it('should disable showing reward cards', () => {
        sut.showRewardCards = true;
        ewfRewardCardsServiceDefer.resolve(false);
        $timeout.flush();

        expect(sut.showRewardCards).toBe(false);
    });
});
