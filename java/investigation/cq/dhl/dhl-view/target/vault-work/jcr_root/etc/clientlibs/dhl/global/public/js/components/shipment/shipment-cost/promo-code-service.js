define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = PromoCodeService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('promoCodeService', PromoCodeService);

    PromoCodeService.$inject = ['$http', '$q', 'logService'];

    function PromoCodeService($http, $q, logService) {
        var NECTAR_CODE_PREFIX = '98263000';

        function validatePromoCode(promoCode, accountNo, paymentTypeMethod, shipperCountryCode, destinationCountryCode) {
            var requestData = {
                promoCode: promoCode,
                accountNo: accountNo,
                paymentTypeMethod: paymentTypeMethod,
                shipperCountryCode: shipperCountryCode,
                destinationCountryCode: destinationCountryCode
            };

            return $http.post('/api/shipment/promocode/validate', requestData).then(function (response) {
                return response.data.accountNumber ? response.data : $q.reject(response);
            })['catch'](function (response) {
                logService.error('PromoCodeService#validatePromoCode: response error', response.data);
                return $q.reject(response.data);
            });
        }

        function validateRewardCard(rewardCard) {
            var rewardCardData = angular.copy(rewardCard);
            rewardCardData.rewardCard = '' + NECTAR_CODE_PREFIX + rewardCard.rewardCard;
            return $http.post('/api/shipment/reward/validate', rewardCardData).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                var errors = filterRewardCardErrors(response.data);
                logService.error('PromoCodeService#validateRewardCard: response error', response);
                return $q.reject(errors);
            });
        }

        function filterRewardCardErrors(data) {
            return data.fieldErrors ? Object.keys(data.fieldErrors) : data.errors;
        }

        function getSavedRewardCardNumber() {
            return $http.get('/api/myprofile/rewards').then(function (response) {
                return response.data ? response.data.rewardsCardNumber.substr(8) : null;
            })['catch'](function (response) {
                logService.error('PromoCodeService#getSavedRewardCard: response error ' + response.data);
                return $q.reject(response.data);
            });
        }

        function saveRewardCardNumber(number) {
            var rewardsCardNumber = '' + NECTAR_CODE_PREFIX + number;
            return $http.post('/api/myprofile/rewards', { rewardsCardNumber: rewardsCardNumber }).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.error('PromoCodeService#saveRewardCardNumber: response error ' + response.data);
                return $q.reject(response.data);
            });
        }

        function validateByLuhnFormula(value) {
            var sumOfEachSecondDigit = 0;
            for (var pos = 0; pos < value.length; pos++) {
                if (pos % 2 !== 0) {
                    sumOfEachSecondDigit += Number(value[pos]);
                }
            }
            return sumOfEachSecondDigit * 2 % 10 === 0;
        }

        return {
            validatePromoCode: validatePromoCode,
            validateRewardCard: validateRewardCard,
            getSavedRewardCardNumber: getSavedRewardCardNumber,
            saveRewardCardNumber: saveRewardCardNumber,
            NECTAR_CODE_PREFIX: NECTAR_CODE_PREFIX,
            validateByLuhnFormula: validateByLuhnFormula
        };
    }
});
//# sourceMappingURL=promo-code-service.js.map
