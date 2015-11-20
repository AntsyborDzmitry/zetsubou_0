import './../../../../services/location-service';
import './item-attributes-model';
import './item-attributes-service';
import './../../ewf-shipment-service';
import './../shipment-type-service';
import './../../../../services/modal/modal-service';

ItemAttributesFormController.$inject = ['$scope',
                                        'modalService',
                                        'locationService',
                                        'itemAttributesModel',
                                        'itemAttributesService',
                                        'shipmentService',
                                        'shipmentTypeService'];

export default function ItemAttributesFormController($scope,
                                                     modalService,
                                                     locationService,
                                                     itemAttributesModel,
                                                     itemAttributesService,
                                                     shipmentService,
                                                     shipmentTypeService) {
    const vm = this;

    Object.assign(vm, {
        init,
        isSaveable,
        handleSaveItemAttributesAction,
        setSavingRowData,
        saveItemAttributesRow,
        weightUnits,
        isProductWeightValid,
        showProductList,
        hideProductList,
        pickProductListGroup,
        isCommodityCodesVisible,
        showCommoditiesCodeSearchPopup,
        pickCommodityCode,
        getCommodityCodeSubcategories,
        getCommodityCodes,
        showProductCatalogPopup,
        hideProductCatalogPopup,
        pickProductCatalogRow,
        updateProductCatalog,
        updateTaxesFromCommodityCode,
        toggleShowCountriesList,
        pickCountry,
        onNextClick,

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
        productCatalogColumns: [
            {alias: 'name', title: 'shipment.shipment_type_packages_product_catalog_name_title'},
            {alias: 'description', title: 'shipment.shipment_type_packages_product_catalog_description_title'},
            {alias: 'commodityCode', title: 'shipment.shipment_type_packages_product_catalog_commodity_code_title'},
            {alias: 'countryCode', title: 'shipment.shipment_type_packages_product_catalog_country_title'}
        ],
        commodityCodesCategories: [],
        commodityCodesCurrentCategory: {},
        commodityCodesCurrentSubCategory: {},

        PATTERNS: {
            quantity: '(^[1-9][0-9]*$)|(?:^$)',
            commodityCode: '^\\d(?:[\\-\\.]?\\d{1,6})?$',
            dimension: '^(([1-9]+\\d*)|(\\d+\\.\\d+))$|^$'
        }
    });

    const CUSTOMS_INVOICE_TYPE = {
        CREATE: 'CREATE',
        USE: 'USE'
    };
    const WEIGHT_UOM = {
        METRIC: 'kg',
        IMPERIAL: 'lb'
    };

    let itemAttributesSavePopup, commodityCodeSearchPopup;

    function init() {
        mapSomParameters();

        vm.itemAttributesModel = itemAttributesModel.init();

        itemAttributesService.getShipmentItemAttributesDetails()
            .then(onGetShipmentItemAttributesDetails);

        const fromCountry = shipmentService.getShipmentCountry();
        const toCountry = shipmentService.getDestinationCountry();
        shipmentTypeService.getShipmentParameters(fromCountry, toCountry)
            .then(onGetShipmentParameters);

        itemAttributesService.getCommodityCodeCategories()
            .then(onGetCommodityCodeCategories);

        locationService.loadAvailableLocations()
            .then((countriesList) => vm.countriesList = countriesList);
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
        vm.quantityUnits = response.units.map((unit) => unit.name);
        vm.defaultQuantityUnit = response.units.find((unit) => unit.default).name;

        vm.itemAttributesModel.productList
            .filter((product) => !product.quantityUnits)
            .forEach((product) => {
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

        itemAttributesSavePopup = modalService
            .showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default ngdialog-theme-small',
                templateUrl: 'item-attributes-save-dialog.html'
            });
        itemAttributesSavePopup.result
            .finally(() => {
                row.isActive = false;
            });
    }

    function setSavingRowData(name, groupId) {
        const rowSaving = vm.itemAttributesModel.productList.find((row) => row.isActive);
        rowSaving.name = name || rowSaving.name;
        rowSaving.groupId = groupId || rowSaving.groupId;
    }

    function saveItemAttributesRow() {
        const rowSaving = vm.itemAttributesModel.productList.find((row) => row.isActive);
        rowSaving.countryCode = rowSaving.countryOfManufactureCode;

        itemAttributesService.saveShipmentItemAttributes(rowSaving)
            .then((response) => {
                rowSaving.id = response.id;
                if (!vm.productList.find((group) => group.id === rowSaving.id)) {
                    vm.productList.push(angular.copy(rowSaving));
                }
            })
            .finally(() => rowSaving.isActive = false);

        itemAttributesSavePopup.close();
    }

    function weightUnits(toggle) {
        let uom = vm.shipperCountrySom;
        if (toggle) {
            uom = uom === 'METRIC' ? 'IMPERIAL' : 'METRIC';
        }
        return WEIGHT_UOM[uom];
    }

    function isProductWeightValid(product) {
        const grossWeight = +product.grossWeight || 0;
        const netWeight = +product.netWeight || 0;
        return grossWeight >= netWeight;
    }

    function showProductList(row) {
        row.isProductListVisible = vm.productList.some((group) =>
            group.description.toLowerCase().includes(row.description.toLowerCase()));
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

       commodityCodeSearchPopup = modalService
            .showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default ngdialog-theme-middle',
                templateUrl: 'commodity-code-search-dialog.html'
            });
        commodityCodeSearchPopup.result
            .finally(() => {
                product.isActive = false;
            });
    }

    function pickCommodityCode(commodity) {
        const row = vm.itemAttributesModel.productList.find((product) => product.isActive);
        row.isActive = false;
        row.commodityCode = commodity.id;
        row.dutyPercent = commodity.tariff;
        row.taxPercent = commodity.tax;

        commodityCodeSearchPopup.close();
    }

    function getCommodityCodeSubcategories() {
        vm.getCommodityCodes();
        vm.commodityCodesCurrentCategory.subcategories = [];

        const id = vm.commodityCodesCurrentCategory.id;
        itemAttributesService.getCommodityCodeSubcategories(id)
            .then((subcategoriesList) => {
                vm.commodityCodesCurrentSubCategory = {};
                vm.commodityCodesCurrentCategory.subcategories = subcategoriesList;
            });
    }

    function getCommodityCodes() {
        vm.commodityCodesList = [];

        const query = vm.commodityCodeSearchQuery || '';
        const categoryId = vm.commodityCodesCurrentCategory.id || '';
        const subcategoryId = categoryId ? (vm.commodityCodesCurrentSubCategory.id || '') : '';
        itemAttributesService.getCommodityCodes(query, categoryId, subcategoryId)
            .then((commodityCodesList) => {
                vm.commodityCodesList = commodityCodesList;
            });
    }

    function showProductCatalogPopup(product) {
        product.isActive = true;
        vm.isProductCatalogVisible = true;
    }

    function hideProductCatalogPopup() {
        vm.isProductCatalogVisible = false;
        vm.itemAttributesModel.productList.forEach((row) => {
            row.isActive = false;
        });
    }

    function pickProductCatalogRow(row) {
        const activeProduct = vm.itemAttributesModel.productList.find((product) => product.isActive);
        vm.pickProductListGroup(activeProduct, row);
        hideProductCatalogPopup();
    }

    function updateProductCatalog() {
        const query = (vm.productCatalogSearchQuery || '').toLowerCase();
        vm.productListFiltered = vm.productList.filter((product) => product.description.toLowerCase().includes(query));
        vm.gridCtrl.rebuildGrid(vm.productListFiltered);
    }

    function joinArrays(arrayOfArrays) {
        return arrayOfArrays.length ? Array.concat(...arrayOfArrays) : [];
    }

    function updateTaxesFromCommodityCode(row) {
        const categories = vm.commodityCodesCategories.filter((el) => el !== undefined && el.subcategories);
        const subCategories = joinArrays(categories.map((category) => category.subcategories));
        const commodityCodes = joinArrays(subCategories.map((category) => category.commodityCodes));

        const commodity = commodityCodes.find((code) => code.id === row.commodityCode);
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
        const customsInvoiceType = shipmentService.getCustomsInvoiceType();
        if (customsInvoiceType === CUSTOMS_INVOICE_TYPE.CREATE) {
            shipmentService.setCustomsInvoice(vm.itemAttributesModel);
        } else {
            shipmentService.setCustomsInvoice();
        }
    }
}
