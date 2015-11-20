import ewf from 'ewf';

ewf.service('profileAccountSettingsService', profileAccountSettingsService);

profileAccountSettingsService.$inject = ['$http', '$q', 'logService'];

// TODO: add jsdoc
export default function profileAccountSettingsService($http, $q, logService) {

    return {
        getMyDhlAccountsDefaults,
        updateMyDhlAccountsDefaults
    };

    function getMyDhlAccountsDefaults() {
        return $http.get('/api/myprofile/accounts/defaults')
            .then((response) => {
                // TODO: check 'data' validity
                logService.log(`Default accounts from server: ${response.data}`);
                const availableAccounts = response.data.available;
                const maskDhlAccounts = response.data.maskDhlAccounts;
                const dutiesAndTaxesOptions = response.data.dutiesAndTaxesOptions;
                const shipmentOptions = response.data.shipmentOptions;
                delete response.data.available;
                delete response.data.maskDhlAccounts;
                delete response.data.dutiesAndTaxesOptions;
                delete response.data.shipmentOptions;
                return {
                    availableAccounts,
                    maskDhlAccounts,
                    dutiesAndTaxesOptions,
                    shipmentOptions,
                    selectedAccountInfo: response.data
                };
            })
            .catch((response) => {
                const data = response.data;
                logService.error('LangSelector failed to get langs! ' + data);
                $q.reject(data);
            });
    }

    function updateMyDhlAccountsDefaults(selectedAccountInfo, maskDhlAccounts) {
        //reducing amount of posting data
        Object.keys(selectedAccountInfo).forEach((selection) => {
            selectedAccountInfo[selection] = selectedAccountInfo[selection].data.key;
        });
        selectedAccountInfo.maskDhlAccounts = maskDhlAccounts;
        return $http.post('/api/myprofile/accounts/defaults/modify', selectedAccountInfo)
            .then((response) => {
                // TODO: check 'data' validity
                return response.data;
            })
            .catch((response) => {
                const data = response.data;
                logService.error('LangSelector failed to get langs! ' + data);
                return $q.reject(data);
            });
    }
}
