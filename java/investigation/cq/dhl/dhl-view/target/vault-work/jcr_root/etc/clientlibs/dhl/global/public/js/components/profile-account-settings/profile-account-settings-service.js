define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = profileAccountSettingsService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('profileAccountSettingsService', profileAccountSettingsService);

    profileAccountSettingsService.$inject = ['$http', '$q', 'logService'];

    // TODO: add jsdoc

    function profileAccountSettingsService($http, $q, logService) {

        return {
            getMyDhlAccountsDefaults: getMyDhlAccountsDefaults,
            updateMyDhlAccountsDefaults: updateMyDhlAccountsDefaults
        };

        function getMyDhlAccountsDefaults() {
            return $http.get('/api/myprofile/accounts/defaults').then(function (response) {
                // TODO: check 'data' validity
                logService.log('Default accounts from server: ' + response.data);
                var availableAccounts = response.data.available;
                var maskDhlAccounts = response.data.maskDhlAccounts;
                var dutiesAndTaxesOptions = response.data.dutiesAndTaxesOptions;
                var shipmentOptions = response.data.shipmentOptions;
                delete response.data.available;
                delete response.data.maskDhlAccounts;
                delete response.data.dutiesAndTaxesOptions;
                delete response.data.shipmentOptions;
                return {
                    availableAccounts: availableAccounts,
                    maskDhlAccounts: maskDhlAccounts,
                    dutiesAndTaxesOptions: dutiesAndTaxesOptions,
                    shipmentOptions: shipmentOptions,
                    selectedAccountInfo: response.data
                };
            })['catch'](function (response) {
                var data = response.data;
                logService.error('LangSelector failed to get langs! ' + data);
                $q.reject(data);
            });
        }

        function updateMyDhlAccountsDefaults(selectedAccountInfo, maskDhlAccounts) {
            //reducing amount of posting data
            Object.keys(selectedAccountInfo).forEach(function (selection) {
                selectedAccountInfo[selection] = selectedAccountInfo[selection].data.key;
            });
            selectedAccountInfo.maskDhlAccounts = maskDhlAccounts;
            return $http.post('/api/myprofile/accounts/defaults/modify', selectedAccountInfo).then(function (response) {
                // TODO: check 'data' validity
                return response.data;
            })['catch'](function (response) {
                var data = response.data;
                logService.error('LangSelector failed to get langs! ' + data);
                return $q.reject(data);
            });
        }
    }
});
//# sourceMappingURL=profile-account-settings-service.js.map
