define(['exports', 'module', './../../services/ewf-crud-service', './../../constants/system-settings-constants'], function (exports, module, _servicesEwfCrudService, _constantsSystemSettingsConstants) {
    'use strict';

    module.exports = MyProductListController;

    MyProductListController.$inject = ['$scope', '$timeout', 'ewfCrudService', 'modalService', 'systemSettings'];

    function MyProductListController($scope, $timeout, ewfCrudService, modalService, systemSettings) {
        var vm = this;
        var PRODUCT_URL = '/api/myprofile/customs/products';

        var columnsToDisplay = [{
            alias: 'name',
            title: 'shipment-settings.my_product_list_grid_column_name'
        }, {
            alias: 'description',
            title: 'shipment-settings.my_product_list_grid_column_description'
        }, {
            alias: 'countryName',
            title: 'shipment-settings.my_product_list_grid_column_commodity_code'
        }];

        Object.assign(vm, {
            showUploadListDialogue: showUploadListDialogue,
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
            columnsToDisplay: columnsToDisplay,
            myProductListKey: '',
            isFormVisible: false,

            init: init,
            editProduct: editProduct,
            onUpdate: onUpdate,
            onAdd: onAdd,
            onCancel: onCancel,
            onCatalogUpdated: onCatalogUpdated,
            onCatalogError: onCatalogError,
            isBulkDeleteButtonEnabled: isBulkDeleteButtonEnabled,
            toggleNotificationAlert: toggleNotificationAlert
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
            return ewfCrudService.getElementList(PRODUCT_URL).then(function (productList) {
                vm.productList = productList;
                vm.gridData = vm.productList;
                vm.gridCtrl.rebuildGrid(vm.gridData);
            });
        }

        function toggleNotificationAlert(action) {
            vm.alertTypes[action] = true;
            $timeout(function () {
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
                template: '<div id=product_upload_list_container ewf-modal><product-upload-list class=\"modal half-width visible\" id=modal_uploadProductCatalog successful-handler=myProductListCtrl.onCatalogUpdated()><h3 class=h3 nls=shipment-settings.my_product_upload_list_upload_list_label></h3><hr class=\"hr margin-top-none\"><p><span nls=shipment-settings.my_product_upload_list_please_transfer_list_before_uploading_message></span><br><a href=/content/dhl/dam/dhl/product_catalog_template.csv nls=shipment-settings.my_product_upload_list_lnk_download_list_template></a></p><div class=\"alert alert_error\" id=listErrorAlert ng-if=productUploadListCtrl.alerts.showCatalogError><span ng-repeat=\"error in productUploadListCtrl.alerts.errors\">{{error | translate}}</span></div><form type=POST enctype=multipart/form-data action=/api/myprofile/customs/products/catalog/upload><ewf-file-uploader files-uploaded=\"productUploadListCtrl.onUploadSuccessful({key: key, size: fileSize, name: fileName})\" files-before-select=productUploadListCtrl.onBeforeSelectFiles() files-upload-error=productUploadListCtrl.onUploadError(errors)><div class=file-uploader><ul class=\"file-list file-list_downloaded\" ng-if=productUploadListCtrl.uploadedFiles().length><li class=file-list__item ng-repeat=\"fileItem in productUploadListCtrl.uploadedFiles()\"><div class=row><div class=col-9><div><a ng-href=fileItem.src ng-bind=fileItem.name></a></div><div ng-bind=fileItem.size></div></div><div class=\"col-3 a-right\"><a class=\"dhlicon-cancel btn-icon btn-icon_delete right\" data-aqa-id=delete_file ng-click=productUploadListCtrl.removeFile($index) nls=shipment-settings.my_product_upload_list_label_delete></a></div></div></li></ul><ul class=file-list ng-if=fileUploaderCtrl.canShowFileList()><li class=file-list__item ng-repeat=\"fileItem in fileUploaderCtrl.getFilesList()\" ng-bind=fileItem.name></li></ul><ewf-progress-bar class=progress_bar ng-if=fileUploaderCtrl.uploadStarted ewf-progress=fileUploaderCtrl.uploadProgress></ewf-progress-bar><br><div ng-if=fileUploaderCtrl.canShowFileList()><button type=button class=\"btn btn_action btn_regular\" data-aqa-id=cancel_upload ng-click=fileUploaderCtrl.clearFilesList() nls=shipment-settings.my_product_upload_list_btn_cancel></button> <button type=button class=\"btn btn_success btn_regular\" data-aqa-id=upload_file ng-click=fileUploaderCtrl.uploadFiles() nls=shipment-settings.my_product_upload_list_btn_upload></button></div><div class=field-wrapper ng-show=!fileUploaderCtrl.canShowFileList()><div class=\"btn btn_upload\"><input type=file name=customs_invoice_docs accept=.csv> <label nls=shipment-settings.my_product_upload_list_btn_browse_file data-aqa-id=brows_for_files></label></div><span class=note></span></div></div></ewf-file-uploader></form><a class=\"btn btn_success btn_small right margin-bottom\" data-aqa-id=add_list_of_product ng-if=productUploadListCtrl.uploadedFiles().length nls=shipment-settings.my_product_upload_list_btn_add_list_of_products ng-click=productUploadListCtrl.addListOfProducts()></a></product-upload-list></div>'
            });
        }
    }
});
//# sourceMappingURL=my-product-list-controller.js.map
