import ewf from 'ewf';
import './ewf-crud-service';

ewf.service('ewfRewardCardsService', EwfRewardCardsService);

EwfRewardCardsService.$inject = ['$q', 'configService', 'ewfCrudService', 'systemSettings'];

export default function EwfRewardCardsService($q, configService, crudService, systemSettings) {
    return {
        canShowRewardCards
    };

    function canShowRewardCards() {
        const rewardPromises = [];

        rewardPromises.push(crudService.getElementDetails('/api/myprofile/rewards/available'));
        rewardPromises.push(configService.getValue(systemSettings.rewardCardsSettingString));

        return $q.all(rewardPromises)
            .then((responses) => {
                const [rewardProgramAvailable, rewardProgramSetting] = responses;
                return rewardProgramAvailable === 'true' && rewardProgramSetting.data.value;
            });
    }
}
