import EwfRewardCardsService from './ewf-reward-cards-service';
import ConfigService from './config-service';
import CrudService from './ewf-crud-service';
import 'angularMocks';

describe('EwfRewardCardsService', function() {
    let sut;
    let configService, crudService, crudServiceDefer, configServiceDefer;
    let $timeout;

    const rewardCardsSettings = {rewardCardsSettingString: 'Rewards / Promotion.Available Reward programs.nectar'};

    beforeEach(inject((_$timeout_, _$q_) => {
        const $q = _$q_;
        crudServiceDefer = $q.defer();
        configServiceDefer = $q.defer();
        $timeout = _$timeout_;

        crudService = jasmine.mockComponent(new CrudService());
        crudService.getElementDetails.and.returnValue(crudServiceDefer.promise);

        configService = jasmine.mockComponent(new ConfigService());
        configService.getValue.and.returnValue(configServiceDefer.promise);

        sut = new EwfRewardCardsService($q, configService, crudService, rewardCardsSettings);
    }));

    it('should get reward program availability', () => {
        sut.canShowRewardCards();
        expect(crudService.getElementDetails).toHaveBeenCalledWith(jasmine.any(String));
    });

    it('should get reward program setting', () => {
        sut.canShowRewardCards();
        expect(configService.getValue).toHaveBeenCalledWith(rewardCardsSettings.rewardCardsSettingString);
    });

    it('should return correct value #1 for showing reward program for current account', () => {
        const [rewardProgramAvailable, showRewardCardsSetting] = ['true', true];
        sut.canShowRewardCards()
            .then((response) => {
                expect(response).toBe(rewardProgramAvailable === 'true' && showRewardCardsSetting);
            });

        crudServiceDefer.resolve(rewardProgramAvailable);
        configServiceDefer.resolve({data: {value: showRewardCardsSetting}});
        $timeout.flush();
    });

    it('should return correct value #2 for showing reward program for current account', () => {
        const [rewardProgramAvailable, showRewardCardsSetting] = ['true', false];
        sut.canShowRewardCards()
            .then((response) => {
                expect(response).toBe(rewardProgramAvailable === 'true' && showRewardCardsSetting);
            });

        crudServiceDefer.resolve(rewardProgramAvailable);
        configServiceDefer.resolve({data: {value: showRewardCardsSetting}});
        $timeout.flush();
    });

    it('should return correct value #3 for showing reward program for current account', () => {
        const [rewardProgramAvailable, showRewardCardsSetting] = ['false', true];
        sut.canShowRewardCards()
            .then((response) => {
                expect(response).toBe(rewardProgramAvailable === 'true' && showRewardCardsSetting);
            });

        crudServiceDefer.resolve(rewardProgramAvailable);
        configServiceDefer.resolve({data: {value: showRewardCardsSetting}});
        $timeout.flush();
    });

    it('should return correct value #4 for showing reward program for current account', () => {
        const [rewardProgramAvailable, showRewardCardsSetting] = ['false', false];
        sut.canShowRewardCards()
            .then((response) => {
                expect(response).toBe(rewardProgramAvailable === 'true' && showRewardCardsSetting);
            });

        crudServiceDefer.resolve(rewardProgramAvailable);
        configServiceDefer.resolve({data: {value: showRewardCardsSetting}});
        $timeout.flush();
    });

});
