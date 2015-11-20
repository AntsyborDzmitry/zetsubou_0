define(['exports', 'module', './../profile-account-settings-service', './../../../constants/system-settings-constants'], function (exports, module, _profileAccountSettingsService, _constantsSystemSettingsConstants) {
    'use strict';

    module.exports = MyDhlAccountsDefaultsController;

    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

    MyDhlAccountsDefaultsController.$inject = ['$timeout', '$q', 'profileAccountSettingsService', 'nlsService', 'systemSettings'];

    function MyDhlAccountsDefaultsController($timeout, $q, profileAccountSettingsService, nlsService, systemSettings) {
        var vm = this;

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
            profileAccountSettingsService.getMyDhlAccountsDefaults().then(function (response) {
                initData(response);
            })['catch'](errorHandler);
        }

        function updateAccountsDefaults() {
            profileAccountSettingsService.updateMyDhlAccountsDefaults(vm.selectedAccountInfo, vm.maskDhlAccounts).then(function () {
                populateAccountsDefaults();
                vm.accountListUpdated = true;
                vm.isEditing = false;
                $timeout(function () {
                    vm.accountListUpdated = false;
                }, systemSettings.showInformationHintTimeout);
            })['catch'](errorHandler);
        }

        function initData(response) {
            var dutiesAndTaxesOptions = response.dutiesAndTaxesOptions;
            var shipmentOptions = response.shipmentOptions;
            vm.selectedAccountInfo = response.selectedAccountInfo;
            vm.maskDhlAccounts = response.maskDhlAccounts;
            vm.availableForDutiesAndTaxes = response.availableAccounts;

            getTranslation(shipmentOptions, dutiesAndTaxesOptions).then(function (translationDictionary) {
                translateSelectedAccounts(vm.selectedAccountInfo, translationDictionary);

                vm.availableForShipment = angular.copy(vm.availableForDutiesAndTaxes);
                vm.availableForShipmentImportAccounts = vm.availableForShipment.filter(function (item) {
                    return item.importAccount === true;
                });

                appendOptions(vm.availableForShipment, shipmentOptions, translationDictionary);
                appendOptions(vm.availableForDutiesAndTaxes, dutiesAndTaxesOptions, translationDictionary);

                vm.availableForShipmentImportAccounts = vm.availableForShipmentImportAccounts.concat(shipmentOptions);

                //copy pointers for simplify access to data from controller
                Object.keys(vm.selectedAccountInfo).forEach(function (field) {
                    vm[field] = vm.selectedAccountInfo[field];
                });
            });
        }

        function appendOptions(destination, options, translationDictionary) {
            options.forEach(function (option, index) {
                options[index].title = translationDictionary[option.title];
                if (!destination.find(function (account) {
                    return account.key === option.key;
                })) {
                    destination.push(option);
                }
            });
        }

        function translateSelectedAccounts(selectedAccounts, translationDictionary) {
            Object.keys(selectedAccounts).forEach(function (accountType) {
                var translation = translationDictionary[selectedAccounts[accountType].data.title];
                if (translation) {
                    selectedAccounts[accountType].data.title = translation;
                }
            });
        }

        function getTranslation(shipmentOptions, dutiesAndTaxesOptions) {
            var translationDefer = $q.defer();
            var translatePromises = [];
            var titles = mergeTitles(shipmentOptions, dutiesAndTaxesOptions);
            var translationDictionary = {};

            titles.forEach(function (title) {
                translatePromises.push(nlsService.getTranslation('my-accounts.' + title));
            });
            $q.all(translatePromises).then(function (translations) {
                titles.forEach(function (title, index) {
                    translationDictionary[title] = translations[index];
                });
                translationDefer.resolve(translationDictionary);
            })['catch'](errorHandler);
            return translationDefer.promise;
        }

        function mergeTitles() {
            var allItems = Array.concat.apply(Array, arguments);
            var result = new Set();
            allItems.forEach(function (item) {
                result.add(item.title);
            });
            return [].concat(_toConsumableArray(result));
        }

        function errorHandler() {
            vm.accountListUpdated = false;
        }
    }
});
//# sourceMappingURL=my-dhl-accounts-defaults-controller.js.map
