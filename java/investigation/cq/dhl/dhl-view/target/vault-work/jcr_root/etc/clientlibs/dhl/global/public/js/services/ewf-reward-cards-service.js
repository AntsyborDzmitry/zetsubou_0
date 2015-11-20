define(['exports', 'module', 'ewf', './ewf-crud-service'], function (exports, module, _ewf, _ewfCrudService) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = EwfRewardCardsService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('ewfRewardCardsService', EwfRewardCardsService);

    EwfRewardCardsService.$inject = ['$q', 'configService', 'ewfCrudService', 'systemSettings'];

    function EwfRewardCardsService($q, configService, crudService, systemSettings) {
        return {
            canShowRewardCards: canShowRewardCards
        };

        function canShowRewardCards() {
            var rewardPromises = [];

            rewardPromises.push(crudService.getElementDetails('/api/myprofile/rewards/available'));
            rewardPromises.push(configService.getValue(systemSettings.rewardCardsSettingString));

            return $q.all(rewardPromises).then(function (responses) {
                var _responses = _slicedToArray(responses, 2);

                var rewardProgramAvailable = _responses[0];
                var rewardProgramSetting = _responses[1];

                return rewardProgramAvailable === 'true' && rewardProgramSetting.data.value;
            });
        }
    }
});
//# sourceMappingURL=ewf-reward-cards-service.js.map
