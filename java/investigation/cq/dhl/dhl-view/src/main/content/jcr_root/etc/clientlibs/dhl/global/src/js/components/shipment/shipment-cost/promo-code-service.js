import ewf from 'ewf';

ewf.service('promoCodeService', PromoCodeService);

PromoCodeService.$inject = ['$http', '$q', 'logService'];

export default function PromoCodeService($http, $q, logService) {
    const NECTAR_CODE_PREFIX = '98263000';

    function validatePromoCode(promoCode, accountNo, paymentTypeMethod, shipperCountryCode, destinationCountryCode) {
        const requestData = {
            promoCode,
            accountNo,
            paymentTypeMethod,
            shipperCountryCode,
            destinationCountryCode
        };

        return $http.post('/api/shipment/promocode/validate', requestData)
            .then((response) => response.data.accountNumber ? response.data : $q.reject(response))
            .catch((response) => {
                logService.error('PromoCodeService#validatePromoCode: response error', response.data);
                return $q.reject(response.data);
            });
    }

    function validateRewardCard(rewardCard) {
        const rewardCardData = angular.copy(rewardCard);
        rewardCardData.rewardCard = `${NECTAR_CODE_PREFIX}${rewardCard.rewardCard}`;
        return $http.post('/api/shipment/reward/validate', rewardCardData)
            .then((response) => response.data)
            .catch((response) => {
                const errors = filterRewardCardErrors(response.data);
                logService.error('PromoCodeService#validateRewardCard: response error', response);
                return $q.reject(errors);
            });
    }

    function filterRewardCardErrors(data) {
        return data.fieldErrors ?
            Object.keys(data.fieldErrors) :
            data.errors;
    }

    function getSavedRewardCardNumber() {
        return $http.get('/api/myprofile/rewards')
            .then((response) => response.data ? response.data.rewardsCardNumber.substr(8) : null)
            .catch((response) => {
                logService.error(`PromoCodeService#getSavedRewardCard: response error ${response.data}`);
                return $q.reject(response.data);
            });
    }

    function saveRewardCardNumber(number) {
        const rewardsCardNumber = `${NECTAR_CODE_PREFIX}${number}`;
        return $http.post('/api/myprofile/rewards', {rewardsCardNumber})
            .then((response) => response.data)
            .catch((response) => {
                logService.error(`PromoCodeService#saveRewardCardNumber: response error ${response.data}`);
                return $q.reject(response.data);
            });
    }

    function validateByLuhnFormula(value) {
        let sumOfEachSecondDigit = 0;
        for (let pos = 0; pos < value.length; pos++) {
            if (pos % 2 !== 0) {
                sumOfEachSecondDigit += Number(value[pos]);
            }
        }
        return (sumOfEachSecondDigit * 2 % 10) === 0;
    }

    return {
        validatePromoCode,
        validateRewardCard,
        getSavedRewardCardNumber,
        saveRewardCardNumber,
        NECTAR_CODE_PREFIX,
        validateByLuhnFormula
    };
}
