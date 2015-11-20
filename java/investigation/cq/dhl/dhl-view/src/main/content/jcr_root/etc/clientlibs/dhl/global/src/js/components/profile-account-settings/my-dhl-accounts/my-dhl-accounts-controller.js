import './../../../services/ewf-crud-service';
import './../../../services/ewf-spinner-service';

MyDhlAccountsController.$inject = [
    'logService',
    'ewfCrudService',
    'ewfSpinnerService'
];

export default function MyDhlAccountsController(
    logService,
    ewfCrudService,
    ewfSpinnerService) {
    const vm = this;

    vm.init = init;
    vm.waitMessage = 'Please, wait';
    vm.showDialog = showDialog;
    vm.closeDialog = closeDialog;
    vm.saveOrUpdate = saveOrUpdate;
    vm.showAddDialog = showAddDialog;
    vm.editAction = editAction;
    vm.columnsToDisplay = [
        {alias: 'accountNickname', title: 'my-accounts.account_name'},
        {alias: 'accountNumber', title: 'my-accounts.account_number'},
        {alias: 'accountType', title: 'my-accounts.account_type'},
        {alias: 'billing', title: 'my-accounts.billing'}
    ];
    vm.gridData = [];

    const emptySingleAccount = {
        key: '',
        accountNumber: '',
        accountNickname: '',
        accountType: '',
        alternative: true
    };

    vm.singleAccount = deepCopyOfPackage(emptySingleAccount);

    function init() {
        vm.gridCtrl.editCallback = editAction;

        const promise = ewfCrudService.getElementList('/api/myprofile/accounts')
            .then((accountsData) => {
                vm.gridData = accountsData;
                // TODO: remove after clarifying requirements reagrding to billing
                vm.gridData.map((gridRow) => {
                     gridRow.billing = accountsData.status === 'APPROVED'
                        ? 'eBilling Enabled'
                        : 'eBilling Pending DHL Approval';
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
            const updateKey = vm.singleAccount.key;
            let saveOrUpdatePromise;

            if (updateKey) {
                saveOrUpdatePromise = ewfCrudService.updateElement('/api/myprofile/accounts/modify', vm.singleAccount)
                    .then((response) => {
                        let packageToUpdate = vm.gridData.find((singleAccount) => singleAccount.key === updateKey);

                        copyPackageProperties(packageToUpdate, response);
                        vm.gridCtrl.rebuildGrid(vm.gridData);
                        closeDialog();
                        vm.singleAccount = deepCopyOfPackage(emptySingleAccount);
                    })
                    .catch((response) => {
                        vm.accountErrors = response.errors;
                    });
            } else {
                saveOrUpdatePromise = ewfCrudService.addElement('/api/myprofile/accounts/add', vm.singleAccount)
                    .then((response) => {
                        vm.gridData.push(response);
                        // TODO: remove after clarifying requirements reagrding to billing
                        vm.gridData.map((gridRow) => {
                            gridRow.billing = response.status === 'APPROVED'
                                ? 'eBilling Enabled'
                                : 'eBilling Pending DHL Approval';
                            return gridRow.billing;
                        });

                        vm.gridCtrl.rebuildGrid(vm.gridData);
                        closeDialog();
                        vm.singleAccount = deepCopyOfPackage(emptySingleAccount);
                    })
                    .catch((response) => {
                        vm.accountErrors = response.data.errors;
                    });
            }
            return saveOrUpdatePromise;
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
        vm.singleAccount = deepCopyOfPackage(vm.gridData.find((singleAccount) => singleAccount.key === key));
        showDialog();
    }

    function deepCopyOfPackage(singleAccount) {
        return angular.copy(singleAccount);
    }

    function copyPackageProperties(to, from) {
        Object.assign(to, from);
    }
}
