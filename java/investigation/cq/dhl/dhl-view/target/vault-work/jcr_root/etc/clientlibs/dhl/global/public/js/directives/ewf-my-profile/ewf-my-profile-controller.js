define(['exports', 'module', 'services/rule-service', './../../constants/system-settings-constants', './../../services/ewf-reward-cards-service'], function (exports, module, _servicesRuleService, _constantsSystemSettingsConstants, _servicesEwfRewardCardsService) {
    'use strict';

    module.exports = EwfMyProfileController;

    EwfMyProfileController.$inject = ['$scope', '$attrs', 'ewfRewardCardsService'];

    function EwfMyProfileController($scope, $attrs, ewfRewardCardsService) {
        var vm = this;
        Object.assign(vm, {
            urlWithLang: $scope.$eval($attrs.urlWithLang)
        });

        ewfRewardCardsService.canShowRewardCards().then(function (responses) {
            vm.showRewardCards = responses;
        });
    }
});
//# sourceMappingURL=ewf-my-profile-controller.js.map
