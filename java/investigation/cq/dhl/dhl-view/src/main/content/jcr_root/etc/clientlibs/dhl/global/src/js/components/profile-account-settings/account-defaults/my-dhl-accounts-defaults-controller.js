import './../profile-account-settings-service';
import './../../../constants/system-settings-constants';

MyDhlAccountsDefaultsController.$inject = [
    '$timeout',
    '$q',
    'profileAccountSettingsService',
    'nlsService',
    'systemSettings'
];

export default function MyDhlAccountsDefaultsController(
    $timeout,
    $q,
    profileAccountSettingsService,
    nlsService,
    systemSettings) {
    const vm = this;

    vm.accountListUpdated = false;
    vm.isEditing = false;
    vm.cancelEditing = cancelEditing;

    vm.populateAccountsDefaults = populateAccountsDefaults;
    vm.updateAccountsDefaults = updateAccountsDefaults;

    function cancelEditing() {
        vm.isEditing = false;
        populateAccountsDefaults();
    }

    populateAccountsDefaults();

    function populateAccountsDefaults() {
        profileAccountSettingsService.getMyDhlAccountsDefaults()
            .then((response) => {
                initData(response);
            })
            .catch(errorHandler);
    }

    function updateAccountsDefaults() {
        profileAccountSettingsService.updateMyDhlAccountsDefaults(vm.selectedAccountInfo, vm.maskDhlAccounts)
            .then(() => {
                populateAccountsDefaults();
                vm.accountListUpdated = true;
                vm.isEditing = false;
                $timeout(() => {
                    vm.accountListUpdated = false;
                }, systemSettings.showInformationHintTimeout);
            })
            .catch(errorHandler);
    }

    function initData(response) {
        const dutiesAndTaxesOptions = response.dutiesAndTaxesOptions;
        const shipmentOptions = response.shipmentOptions;
        vm.selectedAccountInfo = response.selectedAccountInfo;
        vm.maskDhlAccounts = response.maskDhlAccounts;
        vm.availableForDutiesAndTaxes = response.availableAccounts;

        getTranslation(shipmentOptions, dutiesAndTaxesOptions)
            .then((translationDictionary) => {
                translateSelectedAccounts(vm.selectedAccountInfo, translationDictionary);

                vm.availableForShipment = angular.copy(vm.availableForDutiesAndTaxes);
                vm.availableForShipmentImportAccounts = vm.availableForShipment
                    .filter((item) => item.importAccount === true);

                appendOptions(vm.availableForShipment, shipmentOptions, translationDictionary);
                appendOptions(vm.availableForDutiesAndTaxes, dutiesAndTaxesOptions, translationDictionary);

                vm.availableForShipmentImportAccounts = vm.availableForShipmentImportAccounts.concat(shipmentOptions);

                //copy pointers for simplify access to data from controller
                Object.keys(vm.selectedAccountInfo).forEach((field) => {
                    vm[field] = vm.selectedAccountInfo[field];
                });
            });
    }

    function appendOptions(destination, options, translationDictionary) {
        options.forEach((option, index) => {
            options[index].title = translationDictionary[option.title];
            if (!destination.find((account) => account.key === option.key)) {
                destination.push(option);
            }
        });
    }

    function translateSelectedAccounts(selectedAccounts, translationDictionary) {
        Object.keys(selectedAccounts).forEach((accountType) => {
            const translation = translationDictionary[selectedAccounts[accountType].data.title];
            if (translation) {
                selectedAccounts[accountType].data.title = translation;
            }
        });
    }

    function getTranslation(shipmentOptions, dutiesAndTaxesOptions) {
        const translationDefer = $q.defer();
        const translatePromises = [];
        const titles = mergeTitles(shipmentOptions, dutiesAndTaxesOptions);
        const translationDictionary = {};

        titles.forEach((title) => {
            translatePromises.push(nlsService.getTranslation(`my-accounts.${title}`));
        });
        $q.all(translatePromises)
            .then((translations) => {
                titles.forEach((title, index) => {
                    translationDictionary[title] = translations[index];
                });
                translationDefer.resolve(translationDictionary);
            })
            .catch(errorHandler);
        return translationDefer.promise;
    }

    function mergeTitles() {
        const allItems = Array.concat(...arguments);
        const result = new Set();
        allItems.forEach((item) => {
            result.add(item.title);
        });
        return [...result];
    }

    function errorHandler() {
        vm.accountListUpdated = false;
    }
}
