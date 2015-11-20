define(['exports', 'module', './profile-shipment-default-directive', './../../services/navigation-service'], function (exports, module, _profileShipmentDefaultDirective, _servicesNavigationService) {
    'use strict';

    module.exports = ProfileSettingsDefaultController;

    ProfileSettingsDefaultController.$inject = ['navigationService'];

    function ProfileSettingsDefaultController(navigationService) {
        var vm = this;

        var DEFAULT_TAB = 'manageShipment';
        vm.preloadTabFromUrl = preloadTabFromUrl;
        vm.currentTab = DEFAULT_TAB;
        vm.setCurrentTab = setCurrentTab;

        function preloadTabFromUrl() {
            var tabFromUrl = navigationService.getParamFromUrl('tab');
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

            var path = navigationService.getPath();
            var tabParam = undefined;

            tabParam = path.includes('?') ? '&tab' + tabName : '?tab=' + tabName;
            path += tabParam;
            navigationService.location(path);
        }
    }
});
//# sourceMappingURL=profile-shipment-default-controller.js.map
