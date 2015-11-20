define(['exports', 'module', './../../../../services/location-service', './item-attributes-model', './item-attributes-service', './../../ewf-shipment-service', './../shipment-type-service', './../../../../services/modal/modal-service'], function (exports, module, _servicesLocationService, _itemAttributesModel, _itemAttributesService, _ewfShipmentService, _shipmentTypeService, _servicesModalModalService) {
    'use strict';

    module.exports = ItemAttributesFormController;

    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

    ItemAttributesFormController.$inject = ['$scope', 'modalService', 'locationService', 'itemAttributesModel', 'itemAttributesService', 'shipmentService', 'shipmentTypeService'];

    function ItemAttributesFormController($scope, modalService, locationService, itemAttributesModel, itemAttributesService, shipmentService, shipmentTypeService) {
        var vm = this;

        Object.assign(vm, {
            init: init,
            isSaveable: isSaveable,
            handleSaveItemAttributesAction: handleSaveItemAttributesAction,
            setSavingRowData: setSavingRowData,
            saveItemAttributesRow: saveItemAttributesRow,
            weightUnits: weightUnits,
            isProductWeightValid: isProductWeightValid,
            showProductList: showProductList,
            hideProductList: hideProductList,
            pickProductListGroup: pickProductListGroup,
            isCommodityCodesVisible: isCommodityCodesVisible,
            showCommoditiesCodeSearchPopup: showCommoditiesCodeSearchPopup,
            pickCommodityCode: pickCommodityCode,
            getCommodityCodeSubcategories: getCommodityCodeSubcategories,
            getCommodityCodes: getCommodityCodes,
            showProductCatalogPopup: showProductCatalogPopup,
            hideProductCatalogPopup: hideProductCatalogPopup,
            pickProductCatalogRow: pickProductCatalogRow,
            updateProductCatalog: updateProductCatalog,
            updateTaxesFromCommodityCode: updateTaxesFromCommodityCode,
            toggleShowCountriesList: toggleShowCountriesList,
            pickCountry: pickCountry,
            onNextClick: onNextClick,

            PROHIBITED_ITEM: 'prohibited item',
            itemAttributesModel: {},
            quantityUnits: [],

            countriesList: [],
            isUnitsMismatched: false,
            shipperCountrySom: '',
            userProfileCountrySom: '',
            weightConvertionRate: 1,
            dimensionConvertionRate: 1,
            shipperCountryConversionPrecision: 2,
            userProfileCountryConversionPrecision: 2,
            defaultQuantityUnit: '',
            productList: [],
            productListFiltered: [],
            productGroups: [],
            isProductCatalogVisible: false,
            productCatalogColumns: [{ alias: 'name', title: 'shipment.shipment_type_packages_product_catalog_name_title' }, { alias: 'description', title: 'shipment.shipment_type_packages_product_catalog_description_title' }, { alias: 'commodityCode', title: 'shipment.shipment_type_packages_product_catalog_commodity_code_title' }, { alias: 'countryCode', title: 'shipment.shipment_type_packages_product_catalog_country_title' }],
            commodityCodesCategories: [],
            commodityCodesCurrentCategory: {},
            commodityCodesCurrentSubCategory: {},

            PATTERNS: {
                quantity: '(^[1-9][0-9]*$)|(?:^$)',
                commodityCode: '^\\d(?:[\\-\\.]?\\d{1,6})?$',
                dimension: '^(([1-9]+\\d*)|(\\d+\\.\\d+))$|^$'
            }
        });

        var CUSTOMS_INVOICE_TYPE = {
            CREATE: 'CREATE',
            USE: 'USE'
        };
        var WEIGHT_UOM = {
            METRIC: 'kg',
            IMPERIAL: 'lb'
        };

        var itemAttributesSavePopup = undefined,
            commodityCodeSearchPopup = undefined;

        function init() {
            mapSomParameters();

            vm.itemAttributesModel = itemAttributesModel.init();

            itemAttributesService.getShipmentItemAttributesDetails().then(onGetShipmentItemAttributesDetails);

            var fromCountry = shipmentService.getShipmentCountry();
            var toCountry = shipmentService.getDestinationCountry();
            shipmentTypeService.getShipmentParameters(fromCountry, toCountry).then(onGetShipmentParameters);

            itemAttributesService.getCommodityCodeCategories().then(onGetCommodityCodeCategories);

            locationService.loadAvailableLocations().then(function (countriesList) {
                return vm.countriesList = countriesList;
            });
        }

        function mapSomParameters() {
            Object.assign(vm, shipmentService.getCountrySomParameters());
            vm.isUnitsMismatched = vm.shipperCountrySom !== vm.userProfileCountrySom;
        }

        function onGetShipmentItemAttributesDetails(response) {
            vm.productList = vm.productListFiltered = response.productList;
            vm.productGroups = response.productGroups;
        }

        function onGetShipmentParameters(response) {
            vm.quantityUnits = response.units.map(function (unit) {
                return unit.name;
            });
            vm.defaultQuantityUnit = response.units.find(function (unit) {
                return unit['default'];
            }).name;

            vm.itemAttributesModel.productList.filter(function (product) {
                return !product.quantityUnits;
            }).forEach(function (product) {
                product.quantityUnits = vm.defaultQuantityUnit;
            });
        }

        function onGetCommodityCodeCategories(response) {
            vm.commodityCodesCategories = response;
            vm.commodityCodesCurrentCategory = {};
        }

        function isSaveable(row) {
            return !!(!row.id && row.description && row.commodityCode && row.countryOfManufactureCode && !row.isActive);
        }

        function handleSaveItemAttributesAction(row) {
            row.isActive = true;

            row.name = '';
            row.groupId = '';

            itemAttributesSavePopup = modalService.showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default ngdialog-theme-small',
                template: '<div ewf-modal nls-title=shipment.shipment_type_packages_customs_invoice_save_popup_title><div class=form-row><label class=block nls=shipment.shipment_type_packages_customs_invoice_save_product_name></label> <input type=text class=\"input input_width_full\" ng-model=name ng-change=itemAttrFormCtrl.setSavingRowData(name)></div><div class=form-row><label class=block nls=shipment.shipment_type_packages_customs_invoice_save_product_group></label> <span class=\"select full-width\"><select ng-model=option ng-options=\"group.id as group.name for group in itemAttrFormCtrl.productGroups\" ng-change=\"itemAttrFormCtrl.setSavingRowData(\'\', option)\"></select></span></div><div class=\"row right margin-top\"><button type=button class=btn nls=shipment.shipment_type_packages_customs_invoice_save_product_button ng-disabled=!itemAttrFormCtrl.productGroups.length ng-click=itemAttrFormCtrl.saveItemAttributesRow()></button></div></div>'
            });
            itemAttributesSavePopup.result['finally'](function () {
                row.isActive = false;
            });
        }

        function setSavingRowData(name, groupId) {
            var rowSaving = vm.itemAttributesModel.productList.find(function (row) {
                return row.isActive;
            });
            rowSaving.name = name || rowSaving.name;
            rowSaving.groupId = groupId || rowSaving.groupId;
        }

        function saveItemAttributesRow() {
            var rowSaving = vm.itemAttributesModel.productList.find(function (row) {
                return row.isActive;
            });
            rowSaving.countryCode = rowSaving.countryOfManufactureCode;

            itemAttributesService.saveShipmentItemAttributes(rowSaving).then(function (response) {
                rowSaving.id = response.id;
                if (!vm.productList.find(function (group) {
                    return group.id === rowSaving.id;
                })) {
                    vm.productList.push(angular.copy(rowSaving));
                }
            })['finally'](function () {
                return rowSaving.isActive = false;
            });

            itemAttributesSavePopup.close();
        }

        function weightUnits(toggle) {
            var uom = vm.shipperCountrySom;
            if (toggle) {
                uom = uom === 'METRIC' ? 'IMPERIAL' : 'METRIC';
            }
            return WEIGHT_UOM[uom];
        }

        function isProductWeightValid(product) {
            var grossWeight = +product.grossWeight || 0;
            var netWeight = +product.netWeight || 0;
            return grossWeight >= netWeight;
        }

        function showProductList(row) {
            row.isProductListVisible = vm.productList.some(function (group) {
                return group.description.toLowerCase().includes(row.description.toLowerCase());
            });
        }

        function hideProductList(row) {
            row.isProductListVisible = false;
        }

        function pickProductListGroup(row, group) {
            row.name = group.name;
            row.description = group.description;
            row.commodityCode = group.commodityCode;
            row.groupId = group.groupId;
            row.countryOfManufactureCode = group.countryCode;

            hideProductList(row);
        }

        function isCommodityCodesVisible() {
            return !!((vm.commodityCodeSearchQuery || vm.commodityCodesCurrentCategory.id) && vm.commodityCodesList.length);
        }

        function showCommoditiesCodeSearchPopup(product) {
            product.isActive = true;

            commodityCodeSearchPopup = modalService.showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default ngdialog-theme-middle',
                template: '<div ewf-modal nls-title=shipment.shipment_type_packages_customs_invoice_commodity_popup_title><div class=form-row><label nls=shipment.shipment_type_packages_item_attributes_description></label> <input type=text class=\"input input_width_full\" ng-model=itemAttrFormCtrl.commodityCodeSearchQuery ng-change=itemAttrFormCtrl.getCommodityCodes()></div><div class=form-row><label nls=shipment.shipment_type_packages_customs_invoice_commodity_category_label></label> <span class=\"select full-width\"><select name=commodityCodeCategory ng-options=\"category.name for category in itemAttrFormCtrl.commodityCodesCategories track by category.id\" ng-change=itemAttrFormCtrl.getCommodityCodeSubcategories() ng-model=itemAttrFormCtrl.commodityCodesCurrentCategory></select></span></div><div class=form-row ng-if=itemAttrFormCtrl.commodityCodesCurrentCategory.id><label nls=shipment.shipment_type_packages_customs_invoice_commodity_subcategory_label></label> <span class=\"select full-width\"><select name=commodityCodeSubcategory ng-options=\"subcategory.name for subcategory in itemAttrFormCtrl.commodityCodesCurrentCategory.subcategories track by subcategory.id\" ng-change=itemAttrFormCtrl.getCommodityCodes() ng-model=itemAttrFormCtrl.commodityCodesCurrentSubCategory></select></span></div><div class=form-row ng-if=itemAttrFormCtrl.isCommodityCodesVisible()><table class=\"table table_zebra table_hover\"><thead><tr><th nls=shipment.shipment_type_packages_customs_invoice_commodity_table_code_label></th><th nls=shipment.shipment_type_packages_customs_invoice_commodity_table_description_label></th><th nls=shipment.shipment_type_packages_customs_invoice_commodity_table_tariff_label></th><th nls=shipment.shipment_type_packages_customs_invoice_commodity_table_tax_label></th></tr></thead><tbody><tr ng-repeat=\"commodity in itemAttrFormCtrl.commodityCodesList\" ng-click=itemAttrFormCtrl.pickCommodityCode(commodity)><td>{{commodity.id}}</td><td><p class=margin-none>{{commodity.name}}</p><small>{{commodity.description}}</small></td><td>{{commodity.tariff | number : 1}}%</td><td>{{commodity.tax | number : 1}}%</td></tr></tbody></table></div></div>'
            });
            commodityCodeSearchPopup.result['finally'](function () {
                product.isActive = false;
            });
        }

        function pickCommodityCode(commodity) {
            var row = vm.itemAttributesModel.productList.find(function (product) {
                return product.isActive;
            });
            row.isActive = false;
            row.commodityCode = commodity.id;
            row.dutyPercent = commodity.tariff;
            row.taxPercent = commodity.tax;

            commodityCodeSearchPopup.close();
        }

        function getCommodityCodeSubcategories() {
            vm.getCommodityCodes();
            vm.commodityCodesCurrentCategory.subcategories = [];

            var id = vm.commodityCodesCurrentCategory.id;
            itemAttributesService.getCommodityCodeSubcategories(id).then(function (subcategoriesList) {
                vm.commodityCodesCurrentSubCategory = {};
                vm.commodityCodesCurrentCategory.subcategories = subcategoriesList;
            });
        }

        function getCommodityCodes() {
            vm.commodityCodesList = [];

            var query = vm.commodityCodeSearchQuery || '';
            var categoryId = vm.commodityCodesCurrentCategory.id || '';
            var subcategoryId = categoryId ? vm.commodityCodesCurrentSubCategory.id || '' : '';
            itemAttributesService.getCommodityCodes(query, categoryId, subcategoryId).then(function (commodityCodesList) {
                vm.commodityCodesList = commodityCodesList;
            });
        }

        function showProductCatalogPopup(product) {
            product.isActive = true;
            vm.isProductCatalogVisible = true;
        }

        function hideProductCatalogPopup() {
            vm.isProductCatalogVisible = false;
            vm.itemAttributesModel.productList.forEach(function (row) {
                row.isActive = false;
            });
        }

        function pickProductCatalogRow(row) {
            var activeProduct = vm.itemAttributesModel.productList.find(function (product) {
                return product.isActive;
            });
            vm.pickProductListGroup(activeProduct, row);
            hideProductCatalogPopup();
        }

        function updateProductCatalog() {
            var query = (vm.productCatalogSearchQuery || '').toLowerCase();
            vm.productListFiltered = vm.productList.filter(function (product) {
                return product.description.toLowerCase().includes(query);
            });
            vm.gridCtrl.rebuildGrid(vm.productListFiltered);
        }

        function joinArrays(arrayOfArrays) {
            return arrayOfArrays.length ? Array.concat.apply(Array, _toConsumableArray(arrayOfArrays)) : [];
        }

        function updateTaxesFromCommodityCode(row) {
            var categories = vm.commodityCodesCategories.filter(function (el) {
                return el !== undefined && el.subcategories;
            });
            var subCategories = joinArrays(categories.map(function (category) {
                return category.subcategories;
            }));
            var commodityCodes = joinArrays(subCategories.map(function (category) {
                return category.commodityCodes;
            }));

            var commodity = commodityCodes.find(function (code) {
                return code.id === row.commodityCode;
            });
            row.dutyPercent = commodity ? commodity.tariff : 0;
            row.taxPercent = commodity ? commodity.tax : 0;
        }

        function toggleShowCountriesList(product, state) {
            product.isCountriesListVisible = state;
        }

        function pickCountry(product, country) {
            product.countryOfManufactureCode = country.code2;
            product.countryName = country.name;

            vm.toggleShowCountriesList(product, false);
        }

        function onNextClick() {
            var customsInvoiceType = shipmentService.getCustomsInvoiceType();
            if (customsInvoiceType === CUSTOMS_INVOICE_TYPE.CREATE) {
                shipmentService.setCustomsInvoice(vm.itemAttributesModel);
            } else {
                shipmentService.setCustomsInvoice();
            }
        }
    }
});
//# sourceMappingURL=item-attributes-form-controller.js.map
