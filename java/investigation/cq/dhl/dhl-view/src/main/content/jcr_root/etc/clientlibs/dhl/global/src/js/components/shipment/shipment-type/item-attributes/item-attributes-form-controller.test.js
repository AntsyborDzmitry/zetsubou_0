import ItemAttributesFormController from './item-attributes-form-controller';
import ItemAttributesModel from './item-attributes-model';
import ItemAttributesService from './item-attributes-service';
import ShipmentService from './../../ewf-shipment-service';
import ShipmentTypeService from './../shipment-type-service';
import LocationService from './../../../../services/location-service';
import ModalService from './../../../../services/modal/modal-service';

describe('ItemAttributesFormController', () => {
    let sut, defer, purposeDefer, locationDefer, popupDefer;
    let $q, $scope, $timeout;
    let modalService,
        itemAttributesService,
        shipmentService,
        shipmentTypeService,
        locationService,
        itemAttributesModel;
    let locationList;
    let modalServiceClose;

    beforeEach(module('ewf'));
    beforeEach(inject((_$q_, _$rootScope_, _$timeout_) => {
        $q = _$q_;
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;

        defer = $q.defer();
        locationDefer = $q.defer();
        purposeDefer = $q.defer();
        popupDefer = $q.defer();

        locationList = [{
            code2: 'BR',
            code3: 'BRA',
            name: 'BRAZIL',
            phoneCode: '55'
        }, {
            code2: 'CN',
            code3: 'CHN',
            name: 'CHINA, PEOPLES REPUBLIC',
            phoneCode: '86'
        }];

        modalService = jasmine.mockComponent(new ModalService());
        itemAttributesModel = jasmine.mockComponent(new ItemAttributesModel());
        itemAttributesService = jasmine.mockComponent(new ItemAttributesService());
        shipmentService = jasmine.mockComponent(new ShipmentService());
        shipmentTypeService = jasmine.mockComponent(new ShipmentTypeService());
        locationService = jasmine.mockComponent(new LocationService());
        locationService.loadAvailableLocations.and.returnValue(locationDefer.promise);

        itemAttributesModel.init.and.returnValue(itemAttributesModel);
        modalServiceClose = jasmine.createSpy('close');
        modalService.showDialog.and.returnValue({
            result: popupDefer.promise,
            close: modalServiceClose
        });

        itemAttributesService.getShipmentItemAttributesDetails.and.returnValue(defer.promise);
        itemAttributesService.saveShipmentItemAttributes.and.returnValue(defer.promise);
        itemAttributesService.getShippingPurposeList.and.returnValue(purposeDefer.promise);
        itemAttributesService.getCommodityCodeCategories.and.returnValue(defer.promise);
        itemAttributesService.getCommodityCodeSubcategories.and.returnValue(defer.promise);
        itemAttributesService.getCommodityCodes.and.returnValue(defer.promise);

        shipmentTypeService.getShipmentParameters.and.returnValue(defer.promise);
        shipmentService.getShipmentCountry.and.returnValue('US');
        shipmentService.getDestinationCountry.and.returnValue('UA');
        shipmentService.getCountrySomParameters.and.returnValue({
            shipperCountrySom: 'METRIC',
            userProfileCountrySom: 'IMPERIAL',
            weightConvertionRate: 0.34,
            dimensionConvertionRate: 0.27,
            shipperCountryConversionPrecision: 3,
            userProfileCountryConversionPrecision: 3
        });

        sut = new ItemAttributesFormController(
            $scope,
            modalService,
            locationService,
            itemAttributesModel,
            itemAttributesService,
            shipmentService,
            shipmentTypeService
        );
    }));

    describe('#init', () => {
        const productGroups = [{
                id: 1,
                name: 'Sporting'
            }, {
                id: 2,
                name: 'Audi Parts'
            }];
        const productList = [{
                id: '1',
                name: 'Basketballs',
                description: 'Orange rubber basketball, made for athletic use',
                commodityCode: '5678',
                countryOfManufactureCode: 'US',
                groupId: '1'
            }, {
                id: '2',
                name: 'Basketballs',
                description: 'Orange rubber basketball, made for athletic use',
                commodityCode: '5678',
                countryOfManufactureCode: 'US',
                groupId: '1'
            }];
        const response = {
            productGroups,
            productList,
            commodityCodeCategories: ['categories'],
            units: [{
                    name: 'some-unit',
                    default: false
                }, {
                    name: 'other-unit',
                    default: true
                }]
        };

        beforeEach(() => {
            sut.init();
        });

        it('should get shipment item attribute details using item attributes service', () => {
            expect(itemAttributesService.getShipmentItemAttributesDetails).toHaveBeenCalled();
        });

        it('should call shipment parameters method to get quantity units', () => {
            expect(shipmentTypeService.getShipmentParameters).toHaveBeenCalledWith('US', 'UA');
        });

        it('should map quantity units without default flag', () => {
            defer.resolve(response);
            $timeout.flush();

            expect(sut.quantityUnits).toEqual(['some-unit', 'other-unit']);
        });

        it('should set default quantity units', () => {
            defer.resolve(response);
            $timeout.flush();

            expect(sut.defaultQuantityUnit).toEqual('other-unit');
        });

        it('should set quantity unit', () => {
            defer.resolve(response);
            $timeout.flush();

            expect(sut.quantityUnits).toEqual(['some-unit', 'other-unit']);
        });

        it('should set product groups list', () => {
            defer.resolve(response);
            $timeout.flush();

            expect(sut.productGroups).toEqual(productGroups);
        });

        it('should call getCommodityCodeCategories method from itemAttributesService', () => {
            defer.resolve(response);
            $timeout.flush();

            expect(itemAttributesService.getCommodityCodeCategories).toHaveBeenCalled();
        });

        it('should set products list', () => {
            defer.resolve(response);
            $timeout.flush();

            expect(sut.productList).toEqual(productList);
        });

        it('should set filtered products list', () => {
            defer.resolve(response);
            $timeout.flush();

            expect(sut.productListFiltered).toEqual(productList);
        });

        it('should init item attributes model if it was not performed before', () => {
            itemAttributesModel.init.calls.reset();
            itemAttributesModel.productList = [];
            sut.init();

            expect(itemAttributesModel.init).toHaveBeenCalled();
        });

        it('should call getAvailableLocations service method to get the list of countries', () => {
            locationDefer.resolve(locationList);
            $timeout.flush();

            expect(sut.countriesList).toEqual(locationList);
        });
    });

    describe('#isSaveable', () => {
        it('should be truthy if row has description, commodity code and country code', () => {
            const row = {
                description: 'test',
                commodityCode: 1,
                countryOfManufactureCode: 2
            };

            expect(sut.isSaveable(row)).toEqual(true);
        });

        it('should not affect other rows', () => {
            const rows = [{
                description: 'test',
                commodityCode: 1,
                countryOfManufactureCode: 2
            }, {
                description: '',
                commodityCode: 1,
                countryOfManufactureCode: 2
            }];

            sut.isSaveable(rows[0]);
            expect(sut.isSaveable(rows[1])).toEqual(false);
        });

        it('should be falsy if there is no description', () => {
            const row = {
                description: '',
                commodityCode: 1,
                countryOfManufactureCode: 2
            };

            expect(sut.isSaveable(row)).toEqual(false);
        });

        it('should be falsy if there is no commodity code', () => {
            const row = {
                description: 'test',
                commodityCode: '',
                countryOfManufactureCode: 2
            };

            expect(sut.isSaveable(row)).toEqual(false);
        });

        it('should be falsy if there is no country code', () => {
            const row = {
                description: 'test',
                commodityCode: 1,
                countryOfManufactureCode: ''
            };

            expect(sut.isSaveable(row)).toEqual(false);
        });
    });

    describe('#weightUnits', () => {
        beforeEach(() => {
            sut.shipperCountrySom = 'METRIC';
        });

        it('should return metric uom if metric inputed and toggle flag is absent', () => {
            expect(sut.weightUnits()).toEqual('kg');
        });

        it('should return imperial uom if metric inputed and toggle flag truthy', () => {
            expect(sut.weightUnits(true)).toEqual('lb');
        });
    });

    describe('#isProductWeightValid', () => {
        it('should be truthy if gross weight is bigger than net weight', () => {
            const product = {grossWeight: 15, netWeight: 12};
            expect(sut.isProductWeightValid(product)).toEqual(true);
        });

        it('should be falsy if net weight is bigger than gross weight', () => {
            const product = {grossWeight: 12, netWeight: 15};
            expect(sut.isProductWeightValid(product)).toEqual(false);
        });
    });

    describe('#setSavingRowData', () => {
        beforeEach(() => {
            sut.itemAttributesModel.productList = [{
                isActive: true,
                name: 'initial name',
                groupId: 3
            }];
        });

        it('should set name to the saving row', () => {
            sut.setSavingRowData('name', 12);
            const elem = sut.itemAttributesModel.productList[0];

            expect(elem.name).toEqual('name');
        });

        it('should set group id to the saving row', () => {
            sut.setSavingRowData('name', 12);
            const elem = sut.itemAttributesModel.productList[0];

            expect(elem.groupId).toEqual(12);
        });

        it('should not affect name in the saving row when empty string passed', () => {
            sut.setSavingRowData('', '');
            const elem = sut.itemAttributesModel.productList[0];

            expect(elem.name).toEqual('initial name');
        });

        it('should not affect group id in the saving row when empty string passed', () => {
            sut.setSavingRowData('', '');
            const elem = sut.itemAttributesModel.productList[0];

            expect(elem.groupId).toEqual(3);
        });
    });

    describe('#handleSaveItemAttributesAction', () => {
        let row;

        beforeEach(() => {
            row = {
                isActive: false
            };
            sut.productList = [];
        });

        describe('when attribute form is valid', () => {
            beforeEach(() => {
                sut.handleSaveItemAttributesAction(row);
            });

            it('should prevent duplication save request by setting isActive flag truthy', () => {
                expect(row.isActive).toEqual(true);
            });

            it('should affect isSaveable method by setting it falsy while saving', () => {
                expect(sut.isSaveable(row)).toEqual(false);
            });

            it('should clean name before opening dialogs', () => {
                expect(row.name).toEqual('');
            });

            it('should clean group id before opening dialogs', () => {
                expect(row.groupId).toEqual('');
            });

            it('should open dialog', () => {
                expect(modalService.showDialog).toHaveBeenCalledWith(jasmine.any(Object));
            });

            it('should proceed with saving', () => {
                popupDefer.resolve();
                $timeout.flush();

                expect(row.isActive).toEqual(false);
            });
        });
    });

    describe('#saveItemAttributesRow', () => {
        const rowSaving = {};
        const countryOfManufactureCode = 'UA';
        const successResponse = {
            id: '10'
        };

        function getSavingRow() {
            return sut.itemAttributesModel.productList.find((row) => row.isActive);
        }

        beforeEach(() => {
            sut.handleSaveItemAttributesAction(rowSaving);
            sut.itemAttributesModel.productList = [{
                isActive: true,
                countryOfManufactureCode
            }];
            sut.saveItemAttributesRow();
        });

        it('should map countryOfManufactureCode to countryCode', () => {
            const expectedObject = jasmine.objectContaining({countryCode: countryOfManufactureCode});
            expect(itemAttributesService.saveShipmentItemAttributes).toHaveBeenCalledWith(expectedObject);
        });

        it('should unset isActive flag after receiving result', () => {
            defer.resolve(successResponse);
            $timeout.flush();

            expect(getSavingRow()).toEqual(undefined);
        });

        it('should unset isActive flag even after receiving error', () => {
            const errorResponse = {
                status: 403,
                data: {message: 'fail to load'}
            };

            defer.resolve(errorResponse);
            $timeout.flush();

            expect(getSavingRow()).toEqual(undefined);
        });

        it('should set row id to id received in result', () => {
            const savingRow = getSavingRow();

            defer.resolve(successResponse);
            $timeout.flush();

            expect(savingRow.id).toEqual('10');
        });

        it('should append saved item to the product list', () => {
            sut.productList = [{
                name: 'Basketballs'
            }];

            defer.resolve(successResponse);
            $timeout.flush();

            expect(sut.productList.length).toEqual(2);
        });

        it('should NOT append saved item to the product list if there is one with this id', () => {
            sut.productList = [{id: '10'}];

            defer.resolve(successResponse);
            $timeout.flush();

            expect(sut.productList.length).toEqual(1);
        });

        it('should close the dialogs', () => {
            defer.resolve(successResponse);
            $timeout.flush();

            expect(modalServiceClose).toHaveBeenCalled();
        });
    });

    describe('#showProductList', () => {
        const row = {};

        beforeEach(() => {
            sut.productList = [
                {description: 'test description'},
                {description: 'some other text'}
            ];
        });

        it('should set up isProductListVisible flag truthy if there is any element with suitable description', () => {
            row.description = 'test';
            sut.showProductList(row);

            expect(row.isProductListVisible).toEqual(true);
        });

        it('should check description without string case sensitivity', () => {
            row.description = 'Test';
            sut.showProductList(row);

            expect(row.isProductListVisible).toEqual(true);
        });

        it('should set up isProductListVisible flag truthy even if description is empty', () => {
            row.description = '';
            sut.showProductList(row);

            expect(row.isProductListVisible).toEqual(true);
        });

        it('should set up isProductListVisible flag falsy when description is not suitable', () => {
            row.description = 'inappropriate text';
            sut.showProductList(row);

            expect(row.isProductListVisible).toEqual(false);
        });

        it('should set up isProductListVisible flag falsy when product list is empty', () => {
            sut.productList = [];
            row.description = 'test';
            sut.showProductList(row);

            expect(row.isProductListVisible).toEqual(false);
        });
    });

    describe('#hideProductList', () => {
        beforeEach(() => {
            sut.productList = [
                {description: 'test description'},
                {description: 'some other text'}
            ];
        });

        it('should set up isProductListVisible flag falsy in any case', () => {
            const row = {description: 'test'};
            sut.hideProductList(row);

            expect(row.isProductListVisible).toEqual(false);
        });
    });

    describe('#pickProductListGroup', () => {
        let row;

        beforeEach(() => {
            row = {
                name: 'name',
                description: 'description',
                commodityCode: 'commodity code',
                groupId: 'group'
            };
        });

        it('should copy all the fields from chosen group to the row', () => {
            const group = {
                name: 'other name',
                description: 'other description',
                commodityCode: 'other code',
                groupId: 'other group'
            };
            sut.pickProductListGroup(row, group);

            expect(row).toEqual(jasmine.objectContaining(group));
        });

        it('should also map countryCode to countryOfManufactureCode', () => {
            const countryCode = 'UA';
            const group = {countryCode};
            sut.pickProductListGroup(row, group);

            expect(row.countryOfManufactureCode).toEqual(countryCode);
        });
    });

    describe('#isCommodityCodesVisible', () => {
        it('should be truthy if there are all input arguments exists and list returned', () => {
            sut.commodityCodeSearchQuery = 'test';
            sut.commodityCodesCurrentCategory = {
                id: 'cat'
            };
            sut.commodityCodesCurrentSubcategory = {
                id: 'subcat'
            };
            sut.commodityCodesList = ['commodity'];

            expect(sut.isCommodityCodesVisible()).toEqual(true);
        });

        it('should be falsy if all input parameters defined, but list is empty', () => {
            sut.commodityCodeSearchQuery = 'test';
            sut.commodityCodesCurrentCategory = {
                id: 'cat'
            };
            sut.commodityCodesCurrentSubcategory = {
                id: 'subcat'
            };
            sut.commodityCodesList = [];

            expect(sut.isCommodityCodesVisible()).toEqual(false);
        });

        it('should be truthy if only search query passed and list returned', () => {
            sut.commodityCodeSearchQuery = 'test';
            sut.commodityCodesList = ['commodity'];

            expect(sut.isCommodityCodesVisible()).toEqual(true);
        });

        it('should be truthy if only category chosen and list returned', () => {
            sut.commodityCodesCurrentCategory = {
                id: 'cat'
            };
            sut.commodityCodesList = ['commodity'];

            expect(sut.isCommodityCodesVisible()).toEqual(true);
        });

        it('should be falsy if only subcategory chosen, not the category', () => {
            sut.commodityCodesCurrentSubcategory = {
                id: 'subcat'
            };
            sut.commodityCodesList = ['commodity'];

            expect(sut.isCommodityCodesVisible()).toEqual(false);
        });

        it('should be falsy if no mandatory parameters setted', () => {
            expect(sut.isCommodityCodesVisible()).toEqual(false);
        });
    });

    describe('#showCommoditiesCodeSearchPopup', () => {
        let row;

        beforeEach(() => {
            row = {
                id: 1,
                isActive: false
            };

            sut.showCommoditiesCodeSearchPopup(row);
        });

        it('should call modalService to show the popup', () => {
            expect(modalService.showDialog).toHaveBeenCalledWith(jasmine.any(Object));
        });

        it('should set active flag truthy', () => {
            expect(row.isActive).toEqual(true);
        });

        it('should set active flag falsy after popup closed', () => {
            popupDefer.resolve();
            $timeout.flush();

            expect(row.isActive).toEqual(false);
        });
    });

    describe('#pickCommodityCode', () => {
        let row;
        const commodity = {
            id: '2001',
            name: 'Android smartphones',
            description: 'Smartphones and other devices...',
            tariff: 3,
            tax: 3.5
        };

        beforeEach(() => {
            row = {id: 1};
            sut.itemAttributesModel.productList = [row];
            sut.showCommoditiesCodeSearchPopup(row);

            sut.pickCommodityCode(commodity);
        });

        it('should set active flag falsy', () => {
            expect(row.isActive).toEqual(false);
        });

        it('should apply passed commodity code to the active row', () => {
            expect(row.commodityCode).toEqual(commodity.id);
        });

        it('should apply duty from passed commodity to the active row', () => {
            expect(row.dutyPercent).toEqual(commodity.tariff);
        });

        it('should apply tax from passed commodity to the active row', () => {
            expect(row.taxPercent).toEqual(commodity.tax);
        });

        it('should close popup window', () => {
            expect(modalServiceClose).toHaveBeenCalled();
        });
    });

    describe('#getCommodityCodeSubcategories', () => {
        const categoryId = 9;
        const response = [
            'subcategory 1',
            'subcategory 2'
        ];

        beforeEach(() => {
            sut.getCommodityCodes = jasmine.createSpy('getCommodityCodes');
            sut.commodityCodesCurrentCategory = {id: categoryId};
            sut.getCommodityCodeSubcategories();
        });

        it('should get commodity codes for current category before getting subcategories', () => {
            expect(sut.getCommodityCodes).toHaveBeenCalled();
        });

        it('should unset current category subcategories before sending new request', () => {
            expect(sut.commodityCodesCurrentCategory.subcategories.length).toEqual(0);
        });

        it('should call getCommodityCodeSubcategories method of itemAttributesService', () => {
            expect(itemAttributesService.getCommodityCodeSubcategories).toHaveBeenCalled();
        });

        it('should unset current subcategory', () => {
            defer.resolve(response);
            $timeout.flush();

            expect(sut.commodityCodesCurrentSubCategory).toEqual({});
        });

        it('should set subcategories for the current category', () => {
            defer.resolve(response);
            $timeout.flush();

            expect(sut.commodityCodesCurrentCategory.subcategories).toEqual(response);
        });
    });

    describe('#getCommodityCodes', () => {
        const response = [
            'test code 1',
            'test code 2'
        ];

        beforeEach(() => {
            sut.commodityCodeSearchQuery = 'test';
            sut.commodityCodesCurrentCategory = {
                id: 'cat1'
            };
            sut.commodityCodesList = [
                    'old commodity 1',
                    'old commodity 2'
            ];
            sut.commodityCodesCurrentSubCategory = {
                id: 'subcat1'
            };

            sut.getCommodityCodes();
        });

        it('should unset commodity codes before sending request', () => {
            expect(sut.commodityCodesList.length).toEqual(0);
        });

        it('should use getCommodityCodes method from itemAttributesService with right arguments', () => {
            const query = sut.commodityCodeSearchQuery;
            const category = sut.commodityCodesCurrentCategory.id;
            const subcategory = sut.commodityCodesCurrentSubCategory.id;

            expect(itemAttributesService.getCommodityCodes).toHaveBeenCalledWith(query, category, subcategory);
        });

        it('should work even with unknown arguments', () => {
            sut.commodityCodeSearchQuery = undefined;
            sut.commodityCodesCurrentCategory = {};
            sut.commodityCodesCurrentSubCategory = {};
            sut.getCommodityCodes();

            expect(itemAttributesService.getCommodityCodes).toHaveBeenCalledWith('', '', '');
        });

        it('should set commodity codes from response', () => {
            defer.resolve(response);
            $timeout.flush();

            expect(sut.commodityCodesList).toEqual(response);
        });
    });

    describe('#showProductCatalogPopup', () => {
        let row;

        beforeEach(() => {
            row = {
                id: 1,
                isActive: false
            };

            sut.showProductCatalogPopup(row);
        });

        it('should set showProductCatalog truthy', () => {
            expect(sut.isProductCatalogVisible).toEqual(true);
        });

        it('should set active flag truthy for the current row', () => {
            expect(row.isActive).toEqual(true);
        });
    });

    describe('#hideProductCatalogPopup', () => {
        beforeEach(() => {
            sut.itemAttributesModel = {
                productList: [{
                    id: 1,
                    isActive: false
                }, {
                    id: 2,
                    isActive: true
                }]
            };

            sut.hideProductCatalogPopup();
        });

        it('should set Product Catalog visible falsy', () => {
            expect(sut.isProductCatalogVisible).toEqual(false);
        });

        it('should unset active flag for the active row', () => {
            const activeRows = sut.itemAttributesModel.productList.filter((row) => row.isActive);

            expect(activeRows.length).toEqual(0);
        });
    });

    describe('#pickProductCatalogRow', () => {
        const pickingRow = {
            name: 'some-name',
            description: 'some description',
            commodityCode: 123,
            groupId: '3'
        };

        let activeRow;

        beforeEach(() => {
            sut.itemAttributesModel.productList = [{
                id: 1,
                isActive: false
            }, {
                id: 2,
                isActive: true
            }];

            activeRow = sut.itemAttributesModel.productList[1];

            sut.pickProductCatalogRow(pickingRow);
        });

        it('should copy all the fields to the active row', () => {
            expect(activeRow).toEqual(jasmine.objectContaining(pickingRow));
        });

        it('should close Product Catalog popup', () => {
            expect(sut.isProductCatalogVisible).toEqual(false);
        });

        it('should remove isActive flag from the rows', () => {
            const activeRows = sut.itemAttributesModel.productList.filter((row) => row.isActive);

            expect(activeRows.length).toEqual(0);
        });
    });

    describe('#updateProductCatalog', () => {
        beforeEach(() => {
            sut.gridCtrl = jasmine.createSpyObj('gridCtrl', ['rebuildGrid']);

            sut.productList = [{
                description: 'good'
            }, {
                description: 'bad'
            }];
            sut.productCatalogSearchQuery = 'good';
            sut.updateProductCatalog();
        });

        it('should set filtered product list by search query', () => {
            expect(sut.productListFiltered.length).toEqual(1);
        });

        it('should set empty filtered product list if search query is invalid', () => {
            sut.productCatalogSearchQuery = 'invalid';
            sut.updateProductCatalog();

            expect(sut.productListFiltered.length).toEqual(0);
        });

        it('should rebuild grid controller', () => {
            expect(sut.gridCtrl.rebuildGrid).toHaveBeenCalled();
        });

        it('should not change product list if query is empty', () => {
            sut.productCatalogSearchQuery = '';
            sut.updateProductCatalog();

            expect(sut.productListFiltered.length).toEqual(2);
        });

        it('should not be case sensitive while searching', () => {
            sut.productCatalogSearchQuery = 'Good';
            sut.productList[0].description = 'gooD';
            sut.updateProductCatalog();

            expect(sut.productListFiltered.length).toEqual(1);
        });
    });

    describe('#updateTaxesFromCommodityCode', () => {
        let row;

        beforeEach(() => {
            sut.commodityCodesCategories = [{
                subcategories: [{
                    commodityCodes: [{
                        id: '1234',
                        tariff: 3,
                        tax: 4
                    }]
                }]
            }];

            row = {
                commodityCode: '1234'
            };

            sut.updateTaxesFromCommodityCode(row);
        });

        it('should find and set tax for the current row from commodities list', () => {
            expect(row.taxPercent).toEqual(4);
        });

        it('should also set duty for the current row from commodities list', () => {
            expect(row.dutyPercent).toEqual(3);
        });

        it(`should set zero tax for the current row
            if the commodity code is not from the available commodities list`, () => {
            row.commodityCode = '0000';
            sut.updateTaxesFromCommodityCode(row);

            expect(row.taxPercent).toEqual(0);
        });

        it('should not throw error if there is no taxes in commodity code', () => {
            const expectedZeroResult = jasmine.objectContaining({
                taxPercent: 0,
                dutyPercent: 0
            });
            sut.commodityCodesCategories = [];
            sut.updateTaxesFromCommodityCode(row);

            expect(row).toEqual(expectedZeroResult);
        });

        it('should filter empty categories or the ones without subcategories', () => {
            const expectedResult = jasmine.objectContaining({
                taxPercent: 4,
                dutyPercent: 3
            });
            sut.commodityCodesCategories.push(undefined, {});
            sut.updateTaxesFromCommodityCode(row);

            expect(row).toEqual(expectedResult);
        });
    });

    describe('#toggleShowCountriesList', () => {
        it('should turn on state of showing country list for current product', () => {
            const product = {};
            const state = true;
            sut.toggleShowCountriesList(product, state);
            expect(product.isCountriesListVisible).toEqual(state);
        });
    });

    describe('#pickCountry', () => {
        let country, product, state;

        beforeEach(() => {
            country = {
                name: 'BRAZIL',
                code2: 'BR'
            };
            product = {};
            state = false;
        });

        it('should set country code for current product', () => {
            sut.pickCountry(product, country);
            expect(product.countryOfManufactureCode).toEqual(country.code2);
        });

        it('should set country name for current product', () => {
            sut.pickCountry(product, country);
            expect(product.countryName).toEqual(country.name);
        });

        it('should hide country list for current product', () => {
            sut.toggleShowCountriesList = jasmine.createSpy('toggleShowCountriesList');
            sut.pickCountry(product, country);
            expect(sut.toggleShowCountriesList).toHaveBeenCalledWith(product, state);
        });
    });

    describe('#onNextClick', () => {
        it('should call shipment service to set customs invoices (item attribute details) to the shipment data', () => {
            shipmentService.getCustomsInvoiceType.and.returnValue('CREATE');
            sut.onNextClick();

            expect(shipmentService.setCustomsInvoice).toHaveBeenCalledWith(sut.itemAttributesModel);
        });

        it('should call shipment service to remove customs invoice', () => {
            shipmentService.getCustomsInvoiceType.and.returnValue('USE');
            sut.onNextClick();

            expect(shipmentService.setCustomsInvoice).toHaveBeenCalledWith();
        });
    });
});
