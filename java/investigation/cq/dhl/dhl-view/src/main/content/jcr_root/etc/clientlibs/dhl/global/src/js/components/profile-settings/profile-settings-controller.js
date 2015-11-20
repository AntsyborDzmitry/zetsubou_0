import 'services/rule-service';
import './../../constants/system-settings-constants';
import './../../services/ewf-reward-cards-service';

ProfileSettingsController.$inject = [
    'navigationService',
    'ewfRewardCardsService'
];

export default function ProfileSettingsController(
    navigationService,
    ewfRewardCardsService) {

    const vm = this;
    const tabFromUrl = navigationService.getParamFromUrl('tab');

    Object.assign(vm, {
        DETAILS_UPDATE: 'userDetails',
        PASSWORD_UPDATE: 'passwordUpdate',
        LINK_UPDATE: 'manageLinks',
        REWARD_UPDATE: 'rewardProgram',

        setCurrentTab,
        canShowTabByName
    });

    init();

    function init() {
        vm.currentTab = vm.DETAILS_UPDATE;
        if (tabFromUrl) {
            vm.currentTab = tabFromUrl;
        }

        ewfRewardCardsService.canShowRewardCards()
            .then((responses) => {
                vm.showRewardCards = responses;
            });
    }

    function setCurrentTab(newTab) {
        vm.currentTab = newTab;
        changeTab(newTab);
    }

    function changeTab(tabName) {
        let path = navigationService.getPath();
        const tabParam = path.includes('?') ? `&tab${tabName}` : `?tab=${tabName}`;
        path += tabParam;
        navigationService.location(path);
    }

    function canShowTabByName(tabName) {
        return tabName !== vm.REWARD_UPDATE || vm.showRewardCards;
    }
}
