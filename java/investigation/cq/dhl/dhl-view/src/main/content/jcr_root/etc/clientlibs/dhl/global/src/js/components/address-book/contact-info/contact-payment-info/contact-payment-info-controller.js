import angular from 'angular';

EwfContactPaymentInfoController.$inject = ['$q', '$scope', '$attrs', 'ewfCrudService', 'attrsService'];

export default function EwfContactPaymentInfoController($q, $scope, $attrs, ewfCrudService, attrsService) {
    const vm = this;
    const selectOneOption = {
        key: null,
        type: null,
        title: 'Select One'
    };
    const alternateDHLAccountOption = {
        key: null,
        type: 'ALTERNATE_DHLACCOUNT',
        title: 'Alternate DHL Account Number'
    };
    const accountForShippingChargesOptions = [
        {
            key: null,
            type: 'CREDIT_CARD',
            title: 'Credit Card'
        },
        {
            key: null,
            type: 'PAYPAL',
            title: 'PayPal'
        },
        {
            key: null,
            type: 'CASH',
            title: 'Cash'
        }
    ];
    const dutiesAndTaxesOptions = {
        key: null,
        type: 'RECEIVER_WILL_PAY',
        title: 'Receiver Will Pay'
    };

    vm.attributes = {};

    attrsService.track($scope, $attrs, 'paymentSettings', vm.attributes, function onChange(paymentSettings) {
        if (!paymentSettings) {
            return;
        }

        paymentSettings.defaultAccount = paymentSettings.defaultAccount || null;
        paymentSettings.accountForShippingCharges = paymentSettings.accountForShippingCharges || null;
        paymentSettings.accountForDuties = paymentSettings.accountForDuties || null;
        paymentSettings.accountForTaxes = paymentSettings.accountForTaxes || null;
        paymentSettings.splitDutiesAndTaxes = paymentSettings.splitDutiesAndTaxes || false;
    });

    vm.mapOption = mapOption;

    init();

    function mapOption(option) {
        return option && (option.key || option.type);
    }

    //Mock for Support Utilities data
    function getSupportInfoDataDefer() {
        return $q.when(true);
    }

    //Mock for Selected Terms Of Trade data
    function getSelectedTermOfTrade() {
        return $q.when([
            'CIP - Carriage and Insurance Paid To',
            'CPT - Carriage Paid To',
            'DAP - Delivered at Place',
            'DAT - Delivered at Terminal',
            'DDP - Delivered Duty Paid',
            'EXW - Ex Works',
            'FCA - Free Carrier'
        ]);
    }

    function init() {
        $q.all([getSupportInfoDataDefer(), getSelectedTermOfTrade(), getUserProfileAccounts()])
            .then((responses) => {
                const [supportInfo, selectedTermOfTrade] = responses;

                vm.accountForDuties.push(dutiesAndTaxesOptions);
                vm.accountForTaxes.push(dutiesAndTaxesOptions);

                vm.accountForShippingCharges.push(alternateDHLAccountOption);
                vm.accountForDuties.push(alternateDHLAccountOption);
                vm.accountForTaxes.push(alternateDHLAccountOption);

                if (vm.multipleDefaultAccounts) {
                    vm.defaultAccount.unshift(selectOneOption);
                }
                vm.accountForShippingCharges.unshift(selectOneOption);
                vm.accountForDuties.unshift(selectOneOption);
                vm.accountForTaxes.unshift(selectOneOption);

                if (supportInfo) {
                    vm.accountForShippingCharges.push(...accountForShippingChargesOptions);
                    vm.accountForDuties.push(...accountForShippingChargesOptions);
                    vm.accountForTaxes.push(...accountForShippingChargesOptions);
                }

                vm.selectedTermOfTrade = selectedTermOfTrade;
            });
    }

    function getUserProfileAccounts() {
        return ewfCrudService.getElementList('/api/myprofile/accounts')
            .then((accountsData) => {
                vm.multipleDefaultAccounts = angular.isArray(accountsData) && accountsData.length > 1;
                vm.isUserProfileAccounts = !!accountsData.length;
                const formattedAccountsData = accountsData.map((accountData) => ({
                    key: accountData.key,
                    type: 'DHL_ACCOUNT',
                    title: accountData.title,
                    accountNickname: accountData.accountNickname
                }));

                const accountsSort = (first, second) => {
                    return first.accountNickname.toLocaleUpperCase()
                        .localeCompare(second.accountNickname.toLocaleUpperCase());
                };

                formattedAccountsData.sort(accountsSort);
                if (vm.multipleDefaultAccounts) {
                    vm.defaultAccount = angular.copy(formattedAccountsData);
                }
                vm.accountForShippingCharges = angular.copy(formattedAccountsData);
                vm.accountForDuties = angular.copy(formattedAccountsData);
                vm.accountForTaxes = angular.copy(formattedAccountsData);
            });
    }
}
