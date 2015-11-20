import './profile-shipment-default-directive';
import './../../services/navigation-service';

ProfileSettingsDefaultController.$inject = ['navigationService'];

export default function ProfileSettingsDefaultController(navigationService) {
    const vm = this;

    const DEFAULT_TAB = 'manageShipment';
    vm.preloadTabFromUrl = preloadTabFromUrl;
    vm.currentTab = DEFAULT_TAB;
    vm.setCurrentTab = setCurrentTab;

    function preloadTabFromUrl() {
        let tabFromUrl = navigationService.getParamFromUrl('tab');
        if (tabFromUrl !== '') {
            vm.currentTab = tabFromUrl;
        } else {
            vm.currentTab = DEFAULT_TAB;
        }
    }

    function setCurrentTab(newTab) {
        vm.currentTab = newTab;
        changeTab(newTab);
    }

    function changeTab(tabName) {

        let path = navigationService.getPath();
        let tabParam;

        tabParam = path.includes('?') ? `&tab${tabName}` : `?tab=${tabName}`;
        path += tabParam;
        navigationService.location(path);

    }
}
