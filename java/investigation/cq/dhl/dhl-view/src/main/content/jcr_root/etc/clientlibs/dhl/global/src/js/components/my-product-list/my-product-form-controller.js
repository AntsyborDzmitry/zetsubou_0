import './../../services/ewf-crud-service';
import './../../services/attrs-service';
import './../profile-shipment-defaults/services/profile-shipment-service';

MyProductFormController.$inject = [
    '$scope',
    '$attrs',
    '$timeout',
    'locationService',
    'ewfCrudService',
    'attrsService',
    'profileShipmentService'
];

export default function MyProductFormController(
    $scope,
    $attrs,
    $timeout,
    locationService,
    ewfCrudService,
    attrsService,
    profileShipmentService
) {

    const vm = this;
    const productUrl = '/api/myprofile/customs/products';

    const productDefaults = {
        weightUnits: 'KG',
        currency: 'USD',
        importProduct: false
    };

    const emptyImportCommodityCode = {
        key: 0,
        commodityCode: '',
        countryCode: ''
    };

    Object.assign(vm, {
        isEditMode: false,
        hasUnitsList: false,
        currencyList: [],
        availableLocations: [],
        product: {},

        init,
        addProduct,
        updateProduct,
        cancelForm,
        canAddCommodityCode,
        canShowRemoveButton,
        addNewCommodityCode,
        removeCommodityCode,
        clearCountryCode,
        countryTypeaheadOnSelect,
        productCountryTypeaheadOnSelect
    });

    function init() {
        resetProductDefaults();
        getUomAndCurrency();
        locationService.loadAvailableLocations()
            .then((locations) => {
                vm.availableLocations = locations;
            });
        attrsService.track($scope, $attrs, 'myProductListKey', vm, onProductKeyChanged);
    }

    function addProduct(ewfFormCtrl, productForm) {
        if (isValid(ewfFormCtrl, productForm)) {
            removeEmptyCommodityCodeItems();
            ewfCrudService.addElement(productUrl, vm.product)
                .then(() => {
                    resetProductDefaults();
                    resetForm(ewfFormCtrl, productForm);
                    attrsService.trigger($scope, $attrs, 'onProductAdded');
                })
                .catch((response) => {
                    onError(response, ewfFormCtrl);
                })
                .finally(() => {
                    if (!vm.product.importCommodityCodesList.length) {
                        addNewCommodityCode();
                    }
                });
        }
    }

    function updateProduct(ewfFormCtrl, productForm) {
        if (isValid(ewfFormCtrl, productForm)) {
            removeEmptyCommodityCodeItems();
            ewfCrudService.changeElement(productUrl, vm.product)
                .then(() => {
                    resetProductDefaults();
                    resetForm(ewfFormCtrl, productForm);
                    attrsService.trigger($scope, $attrs, 'onProductEdited');
                })
                .catch((response) => {
                    onError(response, ewfFormCtrl);
                })
                .finally(() => {
                    if (!vm.product.importCommodityCodesList.length) {
                        addNewCommodityCode();
                    }
                });
        }
    }

    function cancelForm(ewfFormCtrl, productForm) {
        resetProductDefaults();
        resetForm(ewfFormCtrl, productForm);
        attrsService.trigger($scope, $attrs, 'onEditCanceled');
    }

    function isValid(ewfFormCtrl, productForm) {
        ewfFormCtrl.ewfValidation();
        return productForm.$valid;
    }

    function getUomAndCurrency() {
        profileShipmentService.getDefaultSomAndCurrency()
            .then((response) => {
                productDefaults.currency = response.defaultCurrency;
                vm.currencyList = response.defaultCurrencyList;
                vm.hasUnitsList = response.somList && response.somList.length > 1;
                if (response.som === 'IMPERIAL') {
                    productDefaults.weightUnits = 'LB';
                }
                resetProductDefaults();
            });
    }

    function resetProductDefaults() {
        vm.product = angular.copy(productDefaults);
        vm.product.importCommodityCodesList = [getEmptyImportCommodityCode()];
    }

    function resetForm(ewfFormCtrl, productForm) {
        $timeout(() => {
            ewfFormCtrl.cleanAllFieldErrors();
            ewfFormCtrl.cleanFormErrors();
            productForm.$setPristine();
        });
    }

    function onProductKeyChanged(productKey) {
        vm.isEditMode = false;
        if (productKey) {
            vm.isEditMode = true;
            ewfCrudService.getElementDetails(productUrl, productKey)
                .then((response) => {
                    Object.assign(vm.product, response);
                    if (!vm.product.importCommodityCodesList.length) {
                        addNewCommodityCode();
                    }
                });
        }
    }

    function onError(response, ewfFormCtrl) {
        if (response.data) {
            ewfFormCtrl.setErrorsFromResponse(response.data);
        } else {
            ewfFormCtrl.setErrorsFromResponse({
                errors: ['errors.server_error']
            });
        }
    }

    function removeEmptyCommodityCodeItems() {
        vm.product.importCommodityCodesList = vm.product.importCommodityCodesList.filter((commodityCodeItem) => {
            return commodityCodeItem.commodityCode.trim() !== '' && commodityCodeItem.countryCode.trim() !== '';
        });
    }

    function canAddCommodityCode() {
        return vm.product.importCommodityCodesList.every((eachCodeInfo) => {
            const codeAndCountryDefined = !!(eachCodeInfo.commodityCode && eachCodeInfo.countryCode);
            let codeAndCountryPresent = false;
            if (codeAndCountryDefined) {
                codeAndCountryPresent = eachCodeInfo.commodityCode.trim().length ||
                    eachCodeInfo.countryCode.trim().length;
            }
            return codeAndCountryDefined && codeAndCountryPresent;
        });
    }

    function canShowRemoveButton() {
        return vm.product.importCommodityCodesList.length > 1;
    }

    function getEmptyImportCommodityCode() {
        return Object.assign({}, emptyImportCommodityCode);
    }

    function addNewCommodityCode() {
        vm.product.importCommodityCodesList.push(getEmptyImportCommodityCode());
    }

    function removeCommodityCode(index) {
        vm.product.importCommodityCodesList.splice(index, 1);
        if (vm.product.importCommodityCodesList.length === 0) {
            addNewCommodityCode();
        }
    }

    function clearCountryCode(item, $event) {
        const enterKeyCode = 13;
        if ($event.keyCode === enterKeyCode) {
            return;
        }
        item.countryCode = '';
    }

    function productCountryTypeaheadOnSelect($item) {
        vm.product.countryCode = $item.code2;
        $timeout(() => {
            vm.product.countryName = $item.name;
        });
    }

    function countryTypeaheadOnSelect($item, $index) {
        vm.product.importCommodityCodesList[$index].countryCode = $item.code2;
        $timeout(() => {
            vm.product.importCommodityCodesList[$index].countryName = $item.name;
        });
    }
}
