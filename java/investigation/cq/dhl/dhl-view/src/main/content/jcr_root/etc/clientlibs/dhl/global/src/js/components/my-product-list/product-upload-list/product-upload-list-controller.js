import ewf from 'ewf';
import './../../../services/ewf-crud-service';
import './../../../constants/system-settings-constants';

ewf.controller('productUploadListController', ProductUploadListController);

ProductUploadListController.$inject = [
    '$scope',
    '$attrs',
    '$timeout',
    'attrsService',
    'ewfCrudService',
    'systemSettings'
];

export default function ProductUploadListController(
    $scope,
    $attrs,
    $timeout,
    attrsService,
    crudService,
    systemSettings) {

    const vm = this;
    const filesInfoList = [];
    const productSaveCatalogUrl = '/api/myprofile/customs/products/catalog/save';

    Object.assign(vm, {
        alerts: {
            showCatalogError: false
        },

        uploadedFiles,
        removeFile,
        addListOfProducts,
        onUploadSuccessful,
        onUploadError,
        onBeforeSelectFiles
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
        Object.assign(vm.alerts, {errors});
        toggleNotificationAlert('showCatalogError');
    }

    function addListOfProducts() {
        crudService.updateElement(productSaveCatalogUrl, filesInfoList[0])
            .then(() => {
                $scope.ewfModalCtrl.close();
                attrsService.trigger($scope, $attrs, 'successfulHandler');
            })
            .catch((response) => {
                vm.onUploadError(response.errors);
            });

    }

    function toggleNotificationAlert(action) {
        vm.alerts[action] = true;
        $timeout(() => {
            vm.alerts[action] = false;
        }, systemSettings.showInformationHintTimeout);
    }
}
