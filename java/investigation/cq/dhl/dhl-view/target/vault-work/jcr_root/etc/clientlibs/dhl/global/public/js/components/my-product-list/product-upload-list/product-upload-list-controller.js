define(['exports', 'module', 'ewf', './../../../services/ewf-crud-service', './../../../constants/system-settings-constants'], function (exports, module, _ewf, _servicesEwfCrudService, _constantsSystemSettingsConstants) {
    'use strict';

    module.exports = ProductUploadListController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].controller('productUploadListController', ProductUploadListController);

    ProductUploadListController.$inject = ['$scope', '$attrs', '$timeout', 'attrsService', 'ewfCrudService', 'systemSettings'];

    function ProductUploadListController($scope, $attrs, $timeout, attrsService, crudService, systemSettings) {

        var vm = this;
        var filesInfoList = [];
        var productSaveCatalogUrl = '/api/myprofile/customs/products/catalog/save';

        Object.assign(vm, {
            alerts: {
                showCatalogError: false
            },

            uploadedFiles: uploadedFiles,
            removeFile: removeFile,
            addListOfProducts: addListOfProducts,
            onUploadSuccessful: onUploadSuccessful,
            onUploadError: onUploadError,
            onBeforeSelectFiles: onBeforeSelectFiles
        });

        function uploadedFiles() {
            return filesInfoList;
        }

        function onBeforeSelectFiles() {
            filesInfoList.length = 0;
        }

        function onUploadSuccessful(filesInfo) {
            filesInfoList.push(filesInfo);
        }

        function removeFile(index) {
            filesInfoList.splice(index, 1);
        }

        function onUploadError(errors) {
            attrsService.trigger($scope, $attrs, 'errorHandler');
            Object.assign(vm.alerts, { errors: errors });
            toggleNotificationAlert('showCatalogError');
        }

        function addListOfProducts() {
            crudService.updateElement(productSaveCatalogUrl, filesInfoList[0]).then(function () {
                $scope.ewfModalCtrl.close();
                attrsService.trigger($scope, $attrs, 'successfulHandler');
            })['catch'](function (response) {
                vm.onUploadError(response.errors);
            });
        }

        function toggleNotificationAlert(action) {
            vm.alerts[action] = true;
            $timeout(function () {
                vm.alerts[action] = false;
            }, systemSettings.showInformationHintTimeout);
        }
    }
});
//# sourceMappingURL=product-upload-list-controller.js.map
