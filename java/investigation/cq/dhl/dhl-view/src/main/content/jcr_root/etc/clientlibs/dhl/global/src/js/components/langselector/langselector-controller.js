import './langselector-service';

LanguageController.$inject = ['navigationService', 'langselectorService'];

/**
 * Language selector combobox controller
 *
 * @param {navigationService} navigationService
 * @param {langselectorService} langselectorService
 */
export default function LanguageController(navigationService, langselectorService) {
    const vm = this;
    vm.langChanged = langChanged;

    const {countryId, langId} = navigationService.getCountryLang();
    const pagePath = navigationService.getPath();

    langselectorService.loadAvailableLanguages(pagePath, countryId)
        .then((langs) => {
            vm.availableLangs = langs;
            vm.currentLang = langs.find((item) => item.id === langId);
        });

    function langChanged() {
        const newLang = vm.currentLang;
        if (langId !== newLang.id) {
            navigationService.changeLang(newLang.id);
        }
    }
}
