import 'angularMocks';
import MyProductFormController from './my-product-form-controller';
import EwfCrudService from './../../services/ewf-crud-service';
import AttrsService from './../../services/attrs-service';
import ProfileShipmentService from './../profile-shipment-defaults/services/profile-shipment-service';
import LocationService from './../../services/location-service';
import EwfFormController from './../../directives/ewf-form/ewf-form-controller';

describe('MyProductFormController', () => {
    let sut;
    let $scope;
    let $rootScope;
    let mockProductForm;
    let mockEwfCrudService;
    let mockAttrsService;
    let mockProfileShipmentService;
    let mockLocationService;
    let mockEwfFormCtrl;
    let mockAttrs;
    let crudDeferred;
    let $timeout;

    const productUrl = '/api/myprofile/customs/products';
    const locations = ['BRA', 'UAH'];

    beforeEach(inject((_$rootScope_, _$q_, _$timeout_) => {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;

        mockProductForm = {
            $valid: true,
            $setPristine: jasmine.createSpy()
        };

        crudDeferred = _$q_.defer();
        mockLocationService = jasmine.mockComponent(new LocationService());
        mockLocationService.loadAvailableLocations.and.returnValue(_$q_.when(locations));
        mockEwfCrudService = jasmine.mockComponent(new EwfCrudService());

        mockEwfCrudService.addElement.and.returnValue(crudDeferred.promise);
        mockEwfCrudService.getElementDetails.and.returnValue(crudDeferred.promise);
        mockEwfCrudService.changeElement.and.returnValue(crudDeferred.promise);

        mockAttrsService = jasmine.mockComponent(new AttrsService());
        mockProfileShipmentService = jasmine.mockComponent(new ProfileShipmentService());
        mockProfileShipmentService.getDefaultSomAndCurrency.and.returnValue(crudDeferred.promise);
        mockEwfFormCtrl = jasmine.mockComponent(new EwfFormController());
        sut = new MyProductFormController(
            $scope,
            mockAttrs,
            $timeout,
            mockLocationService,
            mockEwfCrudService,
            mockAttrsService,
            mockProfileShipmentService
        );
    }));

    describe('#init', () => {
        const uomCurrencyResponse = {
            defaultCurrency: 'USD',
            defaultCurrencyList: ['USD', 'UAH', 'EUR'],
            som: 'METRIC',
            somList: [{key: 'METRIC'}, {key: 'IMPERIAL'}]
        };

        beforeEach(() => {
            sut.init();
        });

        it('should load location list', () => {
            $timeout.flush();
            expect(mockLocationService.loadAvailableLocations).toHaveBeenCalledWith();
            expect(sut.availableLocations).toEqual(locations);
        });

        it('should get default UoM and Currency', () => {
            expect(mockProfileShipmentService.getDefaultSomAndCurrency).toHaveBeenCalledWith();
        });

        it('should set currencyList on successful response from server', () => {
            crudDeferred.resolve(uomCurrencyResponse);
            $rootScope.$apply();
            expect(sut.currencyList).toBe(uomCurrencyResponse.defaultCurrencyList);
            expect(sut.product.weightUnits).toBe('KG');
        });

        it('should set weightUnits to lb for imperial metric system', () => {
            uomCurrencyResponse.som = 'IMPERIAL';
            crudDeferred.resolve(uomCurrencyResponse);
            $rootScope.$apply();
            expect(sut.product.weightUnits).toBe('LB');
        });

        it('should set hasUnitsList flag is user has more than one system of measurement', () => {
            crudDeferred.resolve(uomCurrencyResponse);
            $rootScope.$apply();
            expect(sut.hasUnitsList).toBe(true);
        });

        it('should not set hasUnitsList flag is user has  less then two system of measurement', () => {
            uomCurrencyResponse.somList = [{key: 'METRIC'}];
            crudDeferred.resolve(uomCurrencyResponse);
            $rootScope.$apply();
            expect(sut.hasUnitsList).toBe(false);
        });

        it('should track changes of myProductListKey', () => {
            expect(mockAttrsService.track).toHaveBeenCalledWith(
                $scope,
                mockAttrs,
                'myProductListKey',
                sut,
                jasmine.any(Function)
            );
        });

        it('should reset product defaults', () => {
            const productDefaults = getFormDefaults();

            expect(sut.product).toEqual(productDefaults);
        });

        describe('when myProductListKey attr changed', () => {
            const key = 'aaa-bbb-ccc';
            let onProductListKeyChanged;

            beforeEach(() => {
                onProductListKeyChanged = mockAttrsService.track.calls.mostRecent().args[4];
            });

            it('should enable edit mode if product key is defined', () => {
                expect(sut.isEditMode).toBe(false);
                onProductListKeyChanged(key);
                expect(sut.isEditMode).toBe(true);
            });

            it('should load product details if product key is defined', () => {
                onProductListKeyChanged(key);
                expect(mockEwfCrudService.getElementDetails).toHaveBeenCalledWith(productUrl, key);
            });

            it('should add default commodity code if no commodity codes in server response', () => {
                onProductListKeyChanged(key);
                crudDeferred.resolve({
                    importCommodityCodesList: []
                });
                $rootScope.$apply();
                expect(sut.product.importCommodityCodesList).toEqual([{
                    key: 0,
                    commodityCode: '',
                    countryCode: ''
                }]);
            });

            it('should not make request to server if no product key is provided', () => {
                onProductListKeyChanged('');
                expect(mockEwfCrudService.getElementDetails).not.toHaveBeenCalled();
            });

            it('should not enable editMode if no product key is provided', () => {
                expect(sut.isEditMode).toBe(false);
                onProductListKeyChanged('');
                expect(sut.isEditMode).toBe(false);
            });
        });
    });

    describe('#addProduct', () => {
        const product = {
            name: 'New product',
            importCommodityCodesList: getImportCommodityCodesListDefaults()
        };

        beforeEach(() => {
            sut.product = product;
            sut.addProduct(mockEwfFormCtrl, mockProductForm);
        });

        it('should trigger validation messages on the form', () => {
            expect(mockEwfFormCtrl.ewfValidation).toHaveBeenCalledWith();
        });

        it('should add product using EwfCrudService', () => {
            expect(mockEwfCrudService.addElement).toHaveBeenCalledWith(productUrl, sut.product);
        });

        it('should reset product defaults', () => {
            const productDefaults = getFormDefaults();

            crudDeferred.resolve({});
            $rootScope.$apply();
            expect(sut.product).toEqual(productDefaults);
        });

        it('should clear ewfForm errors on next digest', () => {
            crudDeferred.resolve({});
            $timeout.flush();
            expect(mockEwfFormCtrl.cleanAllFieldErrors).toHaveBeenCalledWith();
            expect(mockEwfFormCtrl.cleanFormErrors).toHaveBeenCalledWith();
        });

        it('should set form to pristine state on next digest', () => {
            crudDeferred.resolve({});
            $rootScope.$apply();
            expect(mockProductForm.$setPristine).not.toHaveBeenCalled();
            $timeout.flush();
            expect(mockProductForm.$setPristine).toHaveBeenCalledWith();
        });

        it('should trigger attrs callback after successful response from server', () => {
            crudDeferred.resolve({});
            $rootScope.$apply();
            expect(mockAttrsService.trigger).toHaveBeenCalledWith($scope, mockAttrs, 'onProductAdded');
        });

        it('should remove empty commodity code items before add new product', () => {
            const emptyImportCommodityCode = getImportCommodityCodesListDefaults();

            crudDeferred.resolve({});
            $rootScope.$apply();
            expect(sut.product.importCommodityCodesList).toEqual(emptyImportCommodityCode);
        });

        it('should display server errors when request failed', () => {
            const errorResponse = {
                data: {
                    errors: ['errors.failed']
                }
            };
            crudDeferred.reject(errorResponse);
            $rootScope.$apply();
            expect(mockEwfFormCtrl.setErrorsFromResponse).toHaveBeenCalledWith(errorResponse.data);
        });

        it('should display generic server errors when request failed without response', () => {
            const errorResponse = {};
            crudDeferred.reject(errorResponse);
            $rootScope.$apply();
            expect(mockEwfFormCtrl.setErrorsFromResponse).toHaveBeenCalledWith({
                errors: ['errors.server_error']
            });
        });

        it('should not send request to the server for non-valid form', () => {
            mockProductForm.$valid = false;
            mockEwfCrudService.addElement.calls.reset();
            sut.addProduct(mockEwfFormCtrl, mockProductForm);
            expect(mockEwfCrudService.addElement).not.toHaveBeenCalled();
        });
    });

    describe('#updateProduct', () => {
        const product = {
            key: '123-321',
            importCommodityCodesList: getImportCommodityCodesListDefaults()
        };

        beforeEach(() => {
            sut.product = product;
            sut.addNewCommodityCode();
            sut.updateProduct(mockEwfFormCtrl, mockProductForm);
        });

        it('should trigger validation messages on the form', () => {
            expect(mockEwfFormCtrl.ewfValidation).toHaveBeenCalledWith();
        });

        it('should add product using EwfCrudService with product key', () => {
            expect(mockEwfCrudService.changeElement).toHaveBeenCalledWith(productUrl, sut.product);
        });

        it('should reset product defaults', () => {
            const productDefaults = getFormDefaults();

            crudDeferred.resolve({});
            $rootScope.$apply();
            expect(sut.product).toEqual(productDefaults);
        });

        it('should clear ewfForm errors on next digest', () => {
            crudDeferred.resolve({});
            $timeout.flush();
            expect(mockEwfFormCtrl.cleanAllFieldErrors).toHaveBeenCalledWith();
            expect(mockEwfFormCtrl.cleanFormErrors).toHaveBeenCalledWith();
        });

        it('should set form to pristine state on next digest', () => {
            crudDeferred.resolve({});
            $rootScope.$apply();
            expect(mockProductForm.$setPristine).not.toHaveBeenCalled();
            $timeout.flush();
            expect(mockProductForm.$setPristine).toHaveBeenCalledWith();
        });

        it('should trigger attrs callback after successful response from server', () => {
            crudDeferred.resolve({});
            $rootScope.$apply();
            expect(mockAttrsService.trigger).toHaveBeenCalledWith($scope, mockAttrs, 'onProductEdited');
        });

        it('should remove empty commodity code items before update product', () => {
            const emptyImportCommodityCode = getImportCommodityCodesListDefaults();

            crudDeferred.resolve({});
            $rootScope.$apply();
            expect(sut.product.importCommodityCodesList).toEqual(emptyImportCommodityCode);
        });

        it('should display server errors when request failed', () => {
            const errorResponse = {
                data: {
                    errors: ['errors.failed']
                }
            };
            crudDeferred.reject(errorResponse);
            $rootScope.$apply();
            expect(mockEwfFormCtrl.setErrorsFromResponse).toHaveBeenCalledWith(errorResponse.data);
        });

        it('should display generic server errors when request failed without response', () => {
            const errorResponse = {};
            crudDeferred.reject(errorResponse);
            $rootScope.$apply();
            expect(mockEwfFormCtrl.setErrorsFromResponse).toHaveBeenCalledWith({
                errors: ['errors.server_error']
            });
        });

        it('should not send request to the server for non-valid form', () => {
            mockProductForm.$valid = false;
            mockEwfCrudService.changeElement.calls.reset();
            sut.updateProduct(mockEwfFormCtrl, mockProductForm);
            expect(mockEwfCrudService.changeElement).not.toHaveBeenCalled();
        });
    });

    describe('#cancelForm', () => {
        it('should trigger proper attr callback', () => {
            sut.cancelForm(mockEwfFormCtrl, mockProductForm);
            expect(mockAttrsService.trigger).toHaveBeenCalledWith($scope, mockAttrs, 'onEditCanceled');
        });

        it('should set form to pristine state on next digest', () => {
            sut.cancelForm(mockEwfFormCtrl, mockProductForm);
            expect(mockProductForm.$setPristine).not.toHaveBeenCalled();
            $timeout.flush();
            expect(mockProductForm.$setPristine).toHaveBeenCalledWith();
        });

        it('should clear ewfForm errors on next digest', () => {
            sut.cancelForm(mockEwfFormCtrl, mockProductForm);
            $timeout.flush();
            expect(mockEwfFormCtrl.cleanAllFieldErrors).toHaveBeenCalledWith();
            expect(mockEwfFormCtrl.cleanFormErrors).toHaveBeenCalledWith();
        });

        it('should reset product defaults', () => {
            const productDefaults = getFormDefaults();

            sut.product.name = 'some product name';
            sut.product.currency = 'EUR';
            sut.product.importProduct = true;

            sut.cancelForm(mockEwfFormCtrl, mockProductForm);
            expect(sut.product).toEqual(productDefaults);
        });
    });

    describe('#clearCountryCode', () => {
        const event = {};
        const enterKeyCode = 13;

        it('should clear product country code if not Enter(Return) key', () => {
            const item = {countryCode: 'DE'};
            event.keyCode = 10;
            sut.clearCountryCode(item, event);
            expect(item.countryCode).toBe('');
        });

        it('should not clear product country code for Enter(Return) key', () => {
            const item = {countryCode: 'DE'};
            event.keyCode = enterKeyCode;
            sut.clearCountryCode(item, event);
            expect(item.countryCode).toBe('DE');
        });
    });


    describe('#productCountryTypeaheadOnSelect', () => {
       it('should set product country code', () => {
           const country = {code2: 'US', name: 'USA'};
           sut.productCountryTypeaheadOnSelect(country);
           expect(sut.product.countryCode).toBe(country.code2);
       });

        it('should set product country name in next digest cycle so validation is triggered', () => {
            const country = {code2: 'US', name: 'USA'};
            sut.productCountryTypeaheadOnSelect(country);
            $timeout.flush();
            expect(sut.product.countryName).toBe(country.name);
        });
    });

    describe('commodityCodes', () => {
        beforeEach(() => {
            sut.init();
            $timeout.flush();
        });

        it('should enable adding new commodity record', () => {
            expect(sut.canAddCommodityCode()).toBe(false);
        });

        it('should add new commodity record', () => {
            const commodityListLength = sut.product.importCommodityCodesList.length;
            sut.addNewCommodityCode();
            expect(sut.product.importCommodityCodesList.length).toBe(commodityListLength + 1);
        });

        it('should remove commodity record', () => {
            sut.product.importCommodityCodesList.length = 0;
            sut.product.importCommodityCodesList.push('');
            sut.removeCommodityCode(0);
            expect(sut.product.importCommodityCodesList.length).toBe(1);
        });

        it('should set country code to current model variable', () => {
            const commodityListLength = sut.product.importCommodityCodesList.length;
            const item = {code2: 'UA', name: 'Ukraine'};
            sut.addNewCommodityCode();
            sut.countryTypeaheadOnSelect(item, commodityListLength);
            expect(sut.product.importCommodityCodesList[commodityListLength].countryCode).toBe(item.code2);
            $timeout.flush();
            expect(sut.product.importCommodityCodesList[commodityListLength].countryName).toBe(item.name);
        });
    });

    function getImportCommodityCodesListDefaults() {
        return [
            {
                key: 0,
                commodityCode: '',
                countryCode: ''
            }
        ];
    }

    function getFormDefaults() {
        return {
            weightUnits: 'KG',
            currency: 'USD',
            importProduct: false,
            importCommodityCodesList: getImportCommodityCodesListDefaults()
        };
    }
});
