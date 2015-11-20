define(['exports', 'module', './../../services/ewf-crud-service', './../../services/attrs-service', './../profile-shipment-defaults/services/profile-shipment-service'], function (exports, module, _servicesEwfCrudService, _servicesAttrsService, _profileShipmentDefaultsServicesProfileShipmentService) {
    'use strict';

    module.exports = MyProductFormController;

    MyProductFormController.$inject = ['$scope', '$attrs', '$timeout', 'locationService', 'ewfCrudService', 'attrsService', 'profileShipmentService'];

    function MyProductFormController($scope, $attrs, $timeout, locationService, ewfCrudService, attrsService, profileShipmentService) {

        var vm = this;
        var productUrl = '/api/myprofile/customs/products';

        var productDefaults = {
            weightUnits: 'KG',
            currency: 'USD',
            importProduct: false
        };

        var emptyImportCommodityCode = {
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

            init: init,
            addProduct: addProduct,
            updateProduct: updateProduct,
            cancelForm: cancelForm,
            canAddCommodityCode: canAddCommodityCode,
            canShowRemoveButton: canShowRemoveButton,
            addNewCommodityCode: addNewCommodityCode,
            removeCommodityCode: removeCommodityCode,
            clearCountryCode: clearCountryCode,
            countryTypeaheadOnSelect: countryTypeaheadOnSelect,
            productCountryTypeaheadOnSelect: productCountryTypeaheadOnSelect
        });

        function init() {
            resetProductDefaults();
            getUomAndCurrency();
            locationService.loadAvailableLocations().then(function (locations) {
                vm.availableLocations = locations;
            });
            attrsService.track($scope, $attrs, 'myProductListKey', vm, onProductKeyChanged);
        }

        function addProduct(ewfFormCtrl, productForm) {
            if (isValid(ewfFormCtrl, productForm)) {
                removeEmptyCommodityCodeItems();
                ewfCrudService.addElement(productUrl, vm.product).then(function () {
                    resetProductDefaults();
                    resetForm(ewfFormCtrl, productForm);
                    attrsService.trigger($scope, $attrs, 'onProductAdded');
                })['catch'](function (response) {
                    onError(response, ewfFormCtrl);
                })['finally'](function () {
                    if (!vm.product.importCommodityCodesList.length) {
                        addNewCommodityCode();
                    }
                });
            }
        }

        function updateProduct(ewfFormCtrl, productForm) {
            if (isValid(ewfFormCtrl, productForm)) {
                removeEmptyCommodityCodeItems();
                ewfCrudService.changeElement(productUrl, vm.product).then(function () {
                    resetProductDefaults();
                    resetForm(ewfFormCtrl, productForm);
                    attrsService.trigger($scope, $attrs, 'onProductEdited');
                })['catch'](function (response) {
                    onError(response, ewfFormCtrl);
                })['finally'](function () {
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
            profileShipmentService.getDefaultSomAndCurrency().then(function (response) {
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
            $timeout(function () {
                ewfFormCtrl.cleanAllFieldErrors();
                ewfFormCtrl.cleanFormErrors();
                productForm.$setPristine();
            });
        }

        function onProductKeyChanged(productKey) {
            vm.isEditMode = false;
            if (productKey) {
                vm.isEditMode = true;
                ewfCrudService.getElementDetails(productUrl, productKey).then(function (response) {
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
            vm.product.importCommodityCodesList = vm.product.importCommodityCodesList.filter(function (commodityCodeItem) {
                return commodityCodeItem.commodityCode.trim() !== '' && commodityCodeItem.countryCode.trim() !== '';
            });
        }

        function canAddCommodityCode() {
            return vm.product.importCommodityCodesList.every(function (eachCodeInfo) {
                var codeAndCountryDefined = !!(eachCodeInfo.commodityCode && eachCodeInfo.countryCode);
                var codeAndCountryPresent = false;
                if (codeAndCountryDefined) {
                    codeAndCountryPresent = eachCodeInfo.commodityCode.trim().length || eachCodeInfo.countryCode.trim().length;
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
            var enterKeyCode = 13;
            if ($event.keyCode === enterKeyCode) {
                return;
            }
            item.countryCode = '';
        }

        function productCountryTypeaheadOnSelect($item) {
            vm.product.countryCode = $item.code2;
            $timeout(function () {
                vm.product.countryName = $item.name;
            });
        }

        function countryTypeaheadOnSelect($item, $index) {
            vm.product.importCommodityCodesList[$index].countryCode = $item.code2;
            $timeout(function () {
                vm.product.importCommodityCodesList[$index].countryName = $item.name;
            });
        }
    }
});
//# sourceMappingURL=my-product-form-controller.js.map
