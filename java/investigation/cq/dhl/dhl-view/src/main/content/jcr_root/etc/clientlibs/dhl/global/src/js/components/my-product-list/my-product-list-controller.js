import './../../services/ewf-crud-service';
import './../../constants/system-settings-constants';

MyProductListController.$inject = [
    '$scope',
    '$timeout',
    'ewfCrudService',
    'modalService',
    'systemSettings'
];

export default function MyProductListController(
    $scope,
    $timeout,
    ewfCrudService,
    modalService,
    systemSettings) {
    const vm = this;
    const PRODUCT_URL = '/api/myprofile/customs/products';

    const columnsToDisplay = [
        {
            alias: 'name',
            title: 'shipment-settings.my_product_list_grid_column_name'
        },
        {
            alias: 'description',
            title: 'shipment-settings.my_product_list_grid_column_description'
        },
        {
            alias: 'countryName',
            title: 'shipment-settings.my_product_list_grid_column_commodity_code'
        }
    ];

    Object.assign(vm, {
        showUploadListDialogue,
        alertTypes: {
            catalogError: false,
            catalogUpdated: false,
            uploaded: false,
            added: false,
            updated: false,
            deleted: false
        },
        gridData: [],
        productList: [],
        columnsToDisplay,
        myProductListKey: '',
        isFormVisible: false,

        init,
        editProduct,
        onUpdate,
        onAdd,
        onCancel,
        onCatalogUpdated,
        onCatalogError,
        isBulkDeleteButtonEnabled,
        toggleNotificationAlert
    });

    function init() {
        vm.gridCtrl.editCallback = editProduct;
        getDataFromService();
    }

    function editProduct(key) {
        showFormHideGrid();
        vm.myProductListKey = key;
    }

    function onUpdate() {
        showGridAndUpdate();
        toggleNotificationAlert('updated');
    }

    function isBulkDeleteButtonEnabled() {
        return !!vm.gridCtrl.getSelectedKeysOnCurrentPage().length;
    }

    function onAdd() {
        showGridAndUpdate();
        toggleNotificationAlert('added');
    }

    function onCancel() {
        showGridHideFrom();
    }

    function onCatalogUpdated() {
        getDataFromService();
        toggleNotificationAlert('catalogUpdated');
    }

    function onCatalogError() {
        toggleNotificationAlert('catalogError');
    }

    function getDataFromService() {
        return ewfCrudService.getElementList(PRODUCT_URL)
            .then((productList) => {
                vm.productList = productList;
                vm.gridData = vm.productList;
                vm.gridCtrl.rebuildGrid(vm.gridData);
            });
    }

    function toggleNotificationAlert(action) {
        vm.alertTypes[action] = true;
        $timeout(() => {
            vm.alertTypes[action] = false;
        }, systemSettings.showInformationHintTimeout);
    }

    function showGridAndUpdate() {
        showGridHideFrom();
        getDataFromService();
    }

    function showGridHideFrom() {
        vm.isFormVisible = false;
        vm.myProductListKey = '';
    }

    function showFormHideGrid() {
        vm.isFormVisible = true;
    }

    function showUploadListDialogue() {
        modalService.showDialog({
            closeOnEsc: true,
            scope: $scope,
            windowClass: 'ngdialog-theme-default',
            showClose: true,
            templateUrl: 'product-upload-list/product-upload-list-layout.html'
        });
    }
}
