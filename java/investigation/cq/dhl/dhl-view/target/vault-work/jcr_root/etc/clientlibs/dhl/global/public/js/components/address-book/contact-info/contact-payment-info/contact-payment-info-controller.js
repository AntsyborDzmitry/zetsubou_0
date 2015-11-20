define(['exports', 'module', 'angular'], function (exports, module, _angular) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = EwfContactPaymentInfoController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _angular2 = _interopRequireDefault(_angular);

    EwfContactPaymentInfoController.$inject = ['$q', '$scope', '$attrs', 'ewfCrudService', 'attrsService'];

    function EwfContactPaymentInfoController($q, $scope, $attrs, ewfCrudService, attrsService) {
        var vm = this;
        var selectOneOption = {
            key: null,
            type: null,
            title: 'Select One'
        };
        var alternateDHLAccountOption = {
            key: null,
            type: 'ALTERNATE_DHLACCOUNT',
            title: 'Alternate DHL Account Number'
        };
        var accountForShippingChargesOptions = [{
            key: null,
            type: 'CREDIT_CARD',
            title: 'Credit Card'
        }, {
            key: null,
            type: 'PAYPAL',
            title: 'PayPal'
        }, {
            key: null,
            type: 'CASH',
            title: 'Cash'
        }];
        var dutiesAndTaxesOptions = {
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
            return $q.when(['CIP - Carriage and Insurance Paid To', 'CPT - Carriage Paid To', 'DAP - Delivered at Place', 'DAT - Delivered at Terminal', 'DDP - Delivered Duty Paid', 'EXW - Ex Works', 'FCA - Free Carrier']);
        }

        function init() {
            $q.all([getSupportInfoDataDefer(), getSelectedTermOfTrade(), getUserProfileAccounts()]).then(function (responses) {
                var _responses = _slicedToArray(responses, 2);

                var supportInfo = _responses[0];
                var selectedTermOfTrade = _responses[1];

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
                    var _vm$accountForShippingCharges, _vm$accountForDuties, _vm$accountForTaxes;

                    (_vm$accountForShippingCharges = vm.accountForShippingCharges).push.apply(_vm$accountForShippingCharges, accountForShippingChargesOptions);
                    (_vm$accountForDuties = vm.accountForDuties).push.apply(_vm$accountForDuties, accountForShippingChargesOptions);
                    (_vm$accountForTaxes = vm.accountForTaxes).push.apply(_vm$accountForTaxes, accountForShippingChargesOptions);
                }

                vm.selectedTermOfTrade = selectedTermOfTrade;
            });
        }

        function getUserProfileAccounts() {
            return ewfCrudService.getElementList('/api/myprofile/accounts').then(function (accountsData) {
                vm.multipleDefaultAccounts = _angular2['default'].isArray(accountsData) && accountsData.length > 1;
                vm.isUserProfileAccounts = !!accountsData.length;
                var formattedAccountsData = accountsData.map(function (accountData) {
                    return {
                        key: accountData.key,
                        type: 'DHL_ACCOUNT',
                        title: accountData.title,
                        accountNickname: accountData.accountNickname
                    };
                });

                var accountsSort = function accountsSort(first, second) {
                    return first.accountNickname.toLocaleUpperCase().localeCompare(second.accountNickname.toLocaleUpperCase());
                };

                formattedAccountsData.sort(accountsSort);
                if (vm.multipleDefaultAccounts) {
                    vm.defaultAccount = _angular2['default'].copy(formattedAccountsData);
                }
                vm.accountForShippingCharges = _angular2['default'].copy(formattedAccountsData);
                vm.accountForDuties = _angular2['default'].copy(formattedAccountsData);
                vm.accountForTaxes = _angular2['default'].copy(formattedAccountsData);
            });
        }
    }
});
//# sourceMappingURL=contact-payment-info-controller.js.map
