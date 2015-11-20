define(['exports', 'module', './langselector-service'], function (exports, module, _langselectorService) {
    'use strict';

    module.exports = LanguageController;

    LanguageController.$inject = ['navigationService', 'langselectorService'];

    /**
     * Language selector combobox controller
     *
     * @param {navigationService} navigationService
     * @param {langselectorService} langselectorService
     */

    function LanguageController(navigationService, langselectorService) {
        var vm = this;
        vm.langChanged = langChanged;

        var _navigationService$getCountryLang = navigationService.getCountryLang();

        var countryId = _navigationService$getCountryLang.countryId;
        var langId = _navigationService$getCountryLang.langId;

        var pagePath = navigationService.getPath();

        langselectorService.loadAvailableLanguages(pagePath, countryId).then(function (langs) {
            vm.availableLangs = langs;
            vm.currentLang = langs.find(function (item) {
                return item.id === langId;
            });
        });

        function langChanged() {
            var newLang = vm.currentLang;
            if (langId !== newLang.id) {
                navigationService.changeLang(newLang.id);
            }
        }
    }
});
//# sourceMappingURL=langselector-controller.js.map
