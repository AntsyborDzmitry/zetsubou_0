define(['exports', 'module', 'services/rule-service', './../../constants/system-settings-constants', './../../services/ewf-reward-cards-service'], function (exports, module, _servicesRuleService, _constantsSystemSettingsConstants, _servicesEwfRewardCardsService) {
    'use strict';

    module.exports = ProfileSettingsController;

    ProfileSettingsController.$inject = ['navigationService', 'ewfRewardCardsService'];

    function ProfileSettingsController(navigationService, ewfRewardCardsService) {

        var vm = this;
        var tabFromUrl = navigationService.getParamFromUrl('tab');

        Object.assign(vm, {
            DETAILS_UPDATE: 'userDetails',
            PASSWORD_UPDATE: 'passwordUpdate',
            LINK_UPDATE: 'manageLinks',
            REWARD_UPDATE: 'rewardProgram',

            setCurrentTab: setCurrentTab,
            canShowTabByName: canShowTabByName
        });

        init();

        function init() {
            vm.currentTab = vm.DETAILS_UPDATE;
            if (tabFromUrl) {
                vm.currentTab = tabFromUrl;
            }

            ewfRewardCardsService.canShowRewardCards().then(function (responses) {
                vm.showRewardCards = responses;
            });
        }

        function setCurrentTab(newTab) {
            vm.currentTab = newTab;
            changeTab(newTab);
        }

        function changeTab(tabName) {
            var path = navigationService.getPath();
            var tabParam = path.includes('?') ? '&tab' + tabName : '?tab=' + tabName;
            path += tabParam;
            navigationService.location(path);
        }

        function canShowTabByName(tabName) {
            return tabName !== vm.REWARD_UPDATE || vm.showRewardCards;
        }
    }
});
//# sourceMappingURL=profile-settings-controller.js.map
