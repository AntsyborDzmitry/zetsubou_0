define(['exports', 'module', './../../../services/ewf-crud-service', './../../../services/ewf-spinner-service'], function (exports, module, _servicesEwfCrudService, _servicesEwfSpinnerService) {
    'use strict';

    module.exports = MyDhlAccountsController;

    MyDhlAccountsController.$inject = ['logService', 'ewfCrudService', 'ewfSpinnerService'];

    function MyDhlAccountsController(logService, ewfCrudService, ewfSpinnerService) {
        var vm = this;

        vm.init = init;
        vm.waitMessage = 'Please, wait';
        vm.showDialog = showDialog;
        vm.closeDialog = closeDialog;
        vm.saveOrUpdate = saveOrUpdate;
        vm.showAddDialog = showAddDialog;
        vm.editAction = editAction;
        vm.columnsToDisplay = [{ alias: 'accountNickname', title: 'my-accounts.account_name' }, { alias: 'accountNumber', title: 'my-accounts.account_number' }, { alias: 'accountType', title: 'my-accounts.account_type' }, { alias: 'billing', title: 'my-accounts.billing' }];
        vm.gridData = [];

        var emptySingleAccount = {
            key: '',
            accountNumber: '',
            accountNickname: '',
            accountType: '',
            alternative: true
        };

        vm.singleAccount = deepCopyOfPackage(emptySingleAccount);

        function init() {
            vm.gridCtrl.editCallback = editAction;

            var promise = ewfCrudService.getElementList('/api/myprofile/accounts').then(function (accountsData) {
                vm.gridData = accountsData;
                // TODO: remove after clarifying requirements reagrding to billing
                vm.gridData.map(function (gridRow) {
                    gridRow.billing = accountsData.status === 'APPROVED' ? 'eBilling Enabled' : 'eBilling Pending DHL Approval';
                    return gridRow.billing;
                });

                vm.gridCtrl.rebuildGrid(vm.gridData);
            });
            return ewfSpinnerService.applySpinner(promise);
        }

        function saveOrUpdate(accountDetailsForm, ewfFormCtrl) {
            ewfFormCtrl.ewfValidation();
            vm.accountErrors = [];
            if (accountDetailsForm.$valid) {
                var _ret = (function () {
                    var updateKey = vm.singleAccount.key;
                    var saveOrUpdatePromise = undefined;

                    if (updateKey) {
                        saveOrUpdatePromise = ewfCrudService.updateElement('/api/myprofile/accounts/modify', vm.singleAccount).then(function (response) {
                            var packageToUpdate = vm.gridData.find(function (singleAccount) {
                                return singleAccount.key === updateKey;
                            });

                            copyPackageProperties(packageToUpdate, response);
                            vm.gridCtrl.rebuildGrid(vm.gridData);
                            closeDialog();
                            vm.singleAccount = deepCopyOfPackage(emptySingleAccount);
                        })['catch'](function (response) {
                            vm.accountErrors = response.errors;
                        });
                    } else {
                        saveOrUpdatePromise = ewfCrudService.addElement('/api/myprofile/accounts/add', vm.singleAccount).then(function (response) {
                            vm.gridData.push(response);
                            // TODO: remove after clarifying requirements reagrding to billing
                            vm.gridData.map(function (gridRow) {
                                gridRow.billing = response.status === 'APPROVED' ? 'eBilling Enabled' : 'eBilling Pending DHL Approval';
                                return gridRow.billing;
                            });

                            vm.gridCtrl.rebuildGrid(vm.gridData);
                            closeDialog();
                            vm.singleAccount = deepCopyOfPackage(emptySingleAccount);
                        })['catch'](function (response) {
                            vm.accountErrors = response.data.errors;
                        });
                    }
                    return {
                        v: saveOrUpdatePromise
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            }
        }

        function showDialog() {
            vm.showEditPopup = true;
        }

        function showAddDialog() {
            vm.singleAccount = deepCopyOfPackage(emptySingleAccount);
            showDialog();
        }

        function closeDialog() {
            vm.showEditPopup = false;
        }

        function editAction(key) {
            vm.singleAccount = deepCopyOfPackage(vm.gridData.find(function (singleAccount) {
                return singleAccount.key === key;
            }));
            showDialog();
        }

        function deepCopyOfPackage(singleAccount) {
            return angular.copy(singleAccount);
        }

        function copyPackageProperties(to, from) {
            Object.assign(to, from);
        }
    }
});
//# sourceMappingURL=my-dhl-accounts-controller.js.map
