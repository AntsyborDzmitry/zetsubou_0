import EwfShipmentProductsController from './ewf-shipment-products-controller';
import EwfShipmentStepBaseController from './../ewf-shipment-step-base-controller';
import EwfShipmentService from './../ewf-shipment-service';
import ShipmentProductsService from './shipment-products-service';
import NlsService from './../../../services/nls-service';
import DateTimeService from './../../../services/date-time-service';
import 'angularMocks';

describe('EwfShipmentProductsController', () => {
    let sut;
    let shipmentService;
    let productsService;
    let nlsService;
    let shipmentProductPresenterFactory;
    let dateTimeService;
    let $q;
    let $timeout;
    let $filter;
    let $scope;
    let $document;

    beforeEach(inject((_$rootScope_, _$document_, _$q_, _$timeout_, _$filter_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $filter = _$filter_;
        $scope = _$rootScope_.$new();
        $document = _$document_;

        shipmentService = jasmine.mockComponent(new EwfShipmentService());

        productsService = jasmine.mockComponent(new ShipmentProductsService());
        productsService.getShipmentDates.and.returnValue($q.defer().promise);
        productsService.getProductsByDate.and.returnValue($q.defer().promise);
        productsService.getFavoriteProduct.and.returnValue($q.defer().promise);

        nlsService = jasmine.mockComponent(new NlsService());
        nlsService.getTranslationSync.and.returnValue('asdf');

        dateTimeService = jasmine.mockComponent(new DateTimeService());

        shipmentProductPresenterFactory = jasmine.createSpyObj(
            'shipmentProductPresenterFactory',
            ['createProductPresenter']
        );

        sut = new EwfShipmentProductsController($scope, $filter, $timeout, $document,
            shipmentService,
            productsService,
            shipmentProductPresenterFactory,
            nlsService,
            dateTimeService);
    }));

    it('should be instance of EwfShipmentStepBaseController', () => {
        expect(sut instanceof EwfShipmentStepBaseController).toBe(true);
    });

    describe('#init', () => {
        it('should set initialized flag to true', () => {
            sut.init();
            expect(sut.initialized).toBe(true);
        });

        it('should call addWatchers', () => {
            spyOn(sut, 'addWatchers');
            sut.init();
            expect(sut.addWatchers).toHaveBeenCalled();
        });

        it('should set timeMask value to localized time mask', () => {
            const timeMaskExpected = 'shortTime';
            nlsService.getTranslationSync.and.returnValue(timeMaskExpected);
            sut.init();
            expect(sut.timeMask).toBe(timeMaskExpected);
        });

        it('should set max shipment date', () => {
            spyOn(sut, 'countMaxDate');
            sut.init();
            expect(sut.countMaxDate).toHaveBeenCalled();
        });

        it('should pre-load localization dictionary for datetime', () => {
            sut.init();
            expect(nlsService.getDictionary).toHaveBeenCalledWith('datetime');
        });
    });

    describe('#countMaxDate', () => {
        it('should return (date + N days) date', () => {
            const numberOfDays = 90;
            const date = new Date();

            const result = sut.countMaxDate(date, numberOfDays);

            result.setDate(result.getDate() - numberOfDays);
            expect(date).toEqual(result);
        });
    });

    describe('#loadShipmentDates', () => {
        it('should load delivery dates', () => {
            const countryCode = 'US';
            const postCode = '1';
            const cityName = 'New York';
            shipmentService.getShipmentCountry.and.returnValue(countryCode);
            shipmentService.getShipmentPostCode.and.returnValue(postCode);
            shipmentService.getShipmentCityName.and.returnValue(cityName);

            sut.loadShipmentDates();
            expect(shipmentService.getShipmentCountry).toHaveBeenCalled();
            expect(shipmentService.getShipmentCityName).toHaveBeenCalled();
            expect(shipmentService.getShipmentPostCode).toHaveBeenCalled();

            expect(productsService.getShipmentDates).toHaveBeenCalledWith(countryCode, postCode, cityName);
        });

        it('should translate negative timezoneOffset to string with leading minus', () => {
            const defer = $q.defer();
            const timezoneOffset = -18000000;

            productsService.getShipmentDates.and.returnValue(defer.promise);

            sut.loadShipmentDates();

            defer.resolve({timeZoneOffset: timezoneOffset});
            $timeout.flush();

            expect(sut.shipmentTimeZone).toEqual('-05:00');
        });

        it('should translate positive timezoneOffset to string with leading plus', () => {
            const defer = $q.defer();
            const timezoneOffset = 9000000;

            productsService.getShipmentDates.and.returnValue(defer.promise);

            sut.loadShipmentDates();

            defer.resolve({timeZoneOffset: timezoneOffset});
            $timeout.flush();

            expect(sut.shipmentTimeZone).toEqual('+02:30');
        });

        it('should call generateShipmentDates ', () => {
            const defer = $q.defer();

            sut.generateShipmentDates = jasmine.createSpy('generateShipmentDates');
            sut.generateShipmentDates.and.returnValue([new Date()]);

            productsService.getShipmentDates.and.returnValue(defer.promise);

            sut.loadShipmentDates();

            defer.resolve({});
            $timeout.flush();

            expect(sut.generateShipmentDates).toHaveBeenCalled();
        });

        it('should call displayProductsByDate with first generated date if there is no active date', () => {
            const defer = $q.defer();
            const previewCount = 7;
            const date = new Date();

            sut.generateShipmentDates = jasmine.createSpy('generateShipmentDates');
            sut.generateShipmentDates.and.returnValue([date]);

            sut.displayProductsByDate = jasmine.createSpy('displayProductsByDate');

            productsService.getShipmentDates.and.returnValue(defer.promise);

            sut.loadShipmentDates();

            defer.resolve({previewCount});
            $timeout.flush();

            expect(sut.displayProductsByDate).toHaveBeenCalledWith(date);
        });

        it('should call displayProductsByDate with active date if it\'s defined', () => {
            const defer = $q.defer();
            const previewCount = 7;
            const date = new Date();
            sut.activeDate = new Date();

            sut.generateShipmentDates = jasmine.createSpy('generateShipmentDates');
            sut.generateShipmentDates.and.returnValue([date]);

            sut.displayProductsByDate = jasmine.createSpy('displayProductsByDate');

            productsService.getShipmentDates.and.returnValue(defer.promise);

            sut.loadShipmentDates();

            defer.resolve({previewCount});
            $timeout.flush();

            expect(sut.displayProductsByDate).toHaveBeenCalledWith(sut.activeDate);
        });

        it('should add date selected from calendar previously to just loaded shipmentDates', () => {
            const defer = $q.defer();
            const PREVIEW_COUNT = 6;
            let date = new Date();
            date.setDate(date.getDate() + 10);
            sut.shipmentDates = [];
            sut.shipmentDates[PREVIEW_COUNT] = date;

            sut.generateShipmentDates = jasmine.createSpy('generateShipmentDates');
            sut.generateShipmentDates.and.returnValue([new Date()]);

            productsService.getShipmentDates.and.returnValue(defer.promise);

            sut.loadShipmentDates();

            defer.resolve({});
            $timeout.flush();

            expect(sut.shipmentDates[sut.shipmentDates.length - 1]).toBe(date);
        });
    });

    describe('#displayProductsByDate', () => {
        const date = 1438635600021;

        it('should set active date', () => {
            sut.activeDate = null;
            sut.displayProductsByDate(date);
            expect(sut.activeDate).toBe(date);
        });

        it('should close all opened product details', () => {
            spyOn(sut, 'toggleDetails');
            sut.displayProductsByDate(date);
            expect(sut.toggleDetails).toHaveBeenCalledWith(null);
        });

        it('should clear current products list before loading next set', () => {
            sut.products = [{}, {}];
            sut.displayProductsByDate(date);
            expect(sut.products).toEqual([]);
        });

        it(`should call shipmentProductsService.getProductsByDate
                with nullified date correctly formatted and quotation request data`, () => {
            const timeZone = '-05:00';
            const strDate = '2015-09-24T19:30:00.000';
            const checkStrDate = '2015-09-24T00:00:00.000' + timeZone;
            const readyTime = new Date(strDate);

            const quotesRequestData = {readyTime};
            shipmentService.getQuotesRequestData.and.returnValue(quotesRequestData);

            sut.shipmentTimeZone = timeZone;

            sut.displayProductsByDate(readyTime);
            expect(productsService.getProductsByDate).toHaveBeenCalledWith(checkStrDate, quotesRequestData);
        });


        it('should apply presenter for each product', () => {
            const defer = $q.defer();
            const productPresenter = {};
            const productOne = {};
            const products = [
                productOne
            ];
            sut.userTimeZone = 'asdf';
            productsService.getProductsByDate.and.returnValue(defer.promise);
            shipmentProductPresenterFactory.createProductPresenter.and.returnValue(productPresenter);

            sut.displayProductsByDate(date);
            defer.resolve(products);
            $timeout.flush();

            expect(shipmentProductPresenterFactory.createProductPresenter)
                .toHaveBeenCalledWith(productOne, sut.userTimeZone);
            expect(sut.products[0]).toBe(productPresenter);
        });

        it('should show error message if geting of products failed with error from 500 to 599', () => {
            const promise1 = $q.reject({status: 500});
            const promise2 = $q.reject({status: 599});

            shipmentService.getQuotesRequestData.and.returnValue(jasmine.any(Object));

            sut.dctErrorMessageShown = false;
            productsService.getProductsByDate.and.returnValue(promise1);
            sut.displayProductsByDate(new Date());
            $timeout.flush();
            expect(sut.dctErrorMessageShown).toBe(true);

            sut.dctErrorMessageShown = false;
            productsService.getProductsByDate.and.returnValue(promise2);
            sut.displayProductsByDate(new Date());
            $timeout.flush();
            expect(sut.dctErrorMessageShown).toBe(true);
        });

        it('should show error message if no products were found', () => {
            productsService.getProductsByDate.and.returnValue($q.when());
            sut.displayProductsByDate(date);
            $timeout.flush();
            expect(sut.dctNotFoundMessageShown).toBe(true);
        });

        it('should not show error message if geting of products failed with error under 400 or above 599', () => {
            const promise1 = $q.reject({status: 399});
            shipmentService.getQuotesRequestData.and.returnValue(jasmine.any(Object));

            sut.dctErrorMessageShown = false;
            productsService.getProductsByDate.and.returnValue(promise1);
            sut.displayProductsByDate(new Date());
            $timeout.flush();
            expect(sut.dctErrorMessageShown).toBe(false);
        });

        it('should not show error message if geting of products failed with any error but 500', () => {
            const response = {status: 'any but not 500'};
            const defer = $q.defer();
            defer.reject(response);

            sut.dctErrorMessageShown = false;
            sut.productsOrigin = [jasmine.any(Object)];
            sut.products = [jasmine.any(Object)];

            shipmentService.getQuotesRequestData.and.returnValue(jasmine.any(Object));
            productsService.getProductsByDate.and.returnValue(defer.promise);

            sut.displayProductsByDate(new Date());
            $timeout.flush();

            expect(sut.dctErrorMessageShown).toBe(false);
            expect(sut.productsOrigin.length).toBe(0);
            expect(sut.products.length).toBe(0);
        });

        it('should clear error messages before getting new shipment products', () => {
            sut.displayProductsByDate(new Date());
            expect(sut.dctErrorMessageShown).toBe(false);
            expect(sut.dctNotFoundMessageShown).toBe(false);
        });
    });

    describe('#selectProduct', () => {
        let product;
        let productOrigin;
        const formattedDate = 'asdf';

        beforeEach(() => {
            product = {name: 'product'};
            productOrigin = {name: 'productOrigin'};
            sut.products = [product];
            sut.productsOrigin = [productOrigin];
            sut.activeDate = new Date();

            spyOn(sut, 'formatDateFull');
            sut.formatDateFull.and.returnValue(formattedDate);

        });

        it('should set product into shipment service', () => {
            sut.selectProduct(product, 0);
            expect(shipmentService.setShipmentProduct).toHaveBeenCalledWith(productOrigin);
            expect(sut.selectedProduct).toBe(product);
        });

        it('should set shipmentDate into shipment service', () => {
            sut.selectProduct(product, 0);
            expect(shipmentService.setShipmentDate).toHaveBeenCalledWith(formattedDate);
        });
    });

    describe('#showDisclaimer', () => {
        it('should set flag for showing disclaimer to true', () => {
            sut.showDisclaimer();
            expect(sut.disclaimerVisible).toBe(true);
        });
    });

    describe('#toggleDetails', () => {
        it('should set index of visible details', () => {
            const index = 0;
            sut.visibleDetailsIndex = null;
            sut.toggleDetails(index);
            expect(sut.visibleDetailsIndex).toBe(index);
        });

        it('should set index to null for currently visible details', () => {
            const index = 1;
            sut.visibleDetailsIndex = index;
            sut.toggleDetails(index);
            expect(sut.visibleDetailsIndex).toBe(null);
        });
    });

    describe('#isDetailsVisible', () => {
        it('should return true if details is visible', () => {
            const index = 1;
            sut.visibleDetailsIndex = index;
            const result = sut.isDetailsVisible(index);
            expect(result).toBe(true);
        });

        it('should return false if details is not visible', () => {
            const index = 1;
            sut.visibleDetailsIndex = 2;
            const result = sut.isDetailsVisible(index);
            expect(result).toBe(false);
        });
    });

    describe('#getCurrentFastestProductName', () => {
        it('should return first product name from current shipment products', () => {
            const productName = 'product_1';
            sut.products = [
                {
                    name: productName
                }
            ];
            sut.activeDate = 10;

            const result = sut.getCurrentFastestProductName();

            expect(result).toBe(productName);
        });
    });

    describe('#getFasterMessageTranslation', () => {
        it('should translate get it faster message', () => {
            const nlsKey = 'shipment.shipment_products_get_it_there_faster_message';
            const productName = 'DHL EXPRESS';
            const messageTemplate = 'With {product_name}, you can get your shipment delivered faster.';
            const messageExpected = 'With DHL EXPRESS, you can get your shipment delivered faster.';
            nlsService.getTranslationSync.and.returnValue(messageTemplate);
            spyOn(sut, 'getCurrentFastestProductName').and.returnValue(productName);

            const result = sut.getFasterMessageTranslation();

            expect(nlsService.getTranslationSync).toHaveBeenCalledWith(nlsKey);
            expect(result).toBe(messageExpected);
        });
    });

    describe('#onEdit', () => {
        it('should clear products cache from previous edit', () => {
            sut.onEdit();
            expect(productsService.clearProductsCache).toHaveBeenCalled();
        });

        it('should display products for latest selected date', () => {
            sut.activeDate = 1438635600021;
            spyOn(sut, 'displayProductsByDate');
            sut.onEdit();
            expect(sut.displayProductsByDate).toHaveBeenCalledWith(sut.activeDate);
        });

        it('should close disclaimer text', () => {
            sut.disclaimerVisible = true;
            sut.onEdit();
            expect(sut.disclaimerVisible).toBe(false);
        });

        it('should pre-load delivery dates', () => {
            spyOn(sut, 'loadShipmentDates');
            sut.onEdit();
            expect(sut.loadShipmentDates).toHaveBeenCalled();
        });

        it('should set favorite product', () => {
            spyOn(sut, 'getFavoriteProduct');
            sut.onEdit();
            expect(sut.getFavoriteProduct).toHaveBeenCalled();
        });
    });

    describe('#formatShipmentDate', () => {
        let shipmentDate;
        beforeEach(() => {
            sut.shipmentTimeZoneOffset = -(new Date().getTimezoneOffset() * 60 * 1000);
            shipmentDate = new Date();
        });

        it('should return localization of week day', () => {
            const resultExpected = 'Monday';
            dateTimeService.getFormattedDay.and.returnValue(resultExpected);
            const result = sut.formatShipmentDate(shipmentDate);
            expect(result).toBe(resultExpected);
        });
    });

    describe('#normalizeDate', () => {
        it('should normalize date', () => {
            let date = '2015-09-24T19:00:00.000-05:00';
            date = new Date(date);
            sut.shipmentTimeZoneOffset = -3600000 * 5;

            dateTimeService.normalizeDate.and.returnValue(100);
            const result = sut.normalizeDate(date);
            expect(result).toBe(100);
        });
    });

    describe('#isDateDisabled', () => {
        it('should return true if date is disabled', () => {
            sut.disabledDates = ['2015-09-24T00:00:00.000-04:00'];

            expect(sut.isDateDisabled(sut.disabledDates[0])).toEqual(true);
        });

        it('should return false if date is disabled and enabled at the same time', () => {
            sut.enabledDates = sut.disabledDates = ['2015-09-24T00:00:00.000-04:00'];

            expect(sut.isDateDisabled(sut.disabledDates[0])).toEqual(false);
        });
    });

    describe('#datesEquals', () => {
        it('should return true for the same date', () => {
            let date = new Date();
            expect(sut.datesEquals(date, date)).toEqual(true);
        });

        it('should return false for different dates', () => {
            let date = new Date();
            let date2 = new Date();
            date2.setDate(date2.getDate() + 1);

            expect(sut.datesEquals(date, date2)).toEqual(false);
        });

        it('should return true for dates with equal dates and different time', () => {
            let date = new Date('2015-09-24T12:00:00.000');
            let date2 = new Date('2015-09-24T12:00:00.000');
            date2.setHours(date2.getHours() + 2);

            expect(sut.datesEquals(date, date2)).toEqual(true);
        });
    });

    describe('#updateShipmentEstimateMessage', () => {
        it('should derive localized message and add current date to it', () => {
            let date = 'Aug 27, 2015, 11:46 AM';
            nlsService.getTranslationSync.and.returnValue('asdf{date}');
            sut.updateShipmentEstimateMessage(date);
            expect(sut.shipmentEstimateMessage).toBe('asdf' + 'Aug 27, 2015, 11:46 AM');
        });
    });

    describe('#onCalendarSelectedDateChanged', () => {
        let date;
        beforeEach(() => {
            sut.calendarOpened = true;

            sut.init();
            date = new Date();
            sut.calendarSelectedDate = date;
            spyOn(sut, 'displayProductsByDate');
        });


        it('should close calendar', () => {
            $scope.$apply();

            expect(sut.calendarOpened).toBe(false);
        });

        it('should display products for selected date', () => {
            $scope.$apply();

            expect(sut.displayProductsByDate).toHaveBeenCalledWith(date);
        });
    });

    describe('#getFavoriteProduct', () => {
        it('should set favoriteProduct with favorite product code', () => {
            const response = 'D';
            const defer = $q.defer();

            productsService.getFavoriteProduct.and.returnValue(defer.promise);

            sut.getFavoriteProduct();
            defer.resolve(response);
            $timeout.flush();
            expect(sut.favoriteProduct).toEqual(response);
        });

        it('should clear favoriteProduct if there is no favorite code', () => {
            const expectedResult = '';
            const defer = $q.defer();
            sut.favoriteProduct = 'D';
            productsService.getFavoriteProduct.and.returnValue(defer.promise);

            sut.getFavoriteProduct();
            defer.reject();
            $timeout.flush();
            expect(sut.favoriteProduct).toEqual(expectedResult);
        });
    });

    describe('#formatShipmentMonth', () => {
        it('should get localized month from date', () => {
            const resultExpected = 'October';
            const timestamp = '2015-09-24T10:30:00.000Z';
            dateTimeService.getLocalizedMonth.and.returnValue(resultExpected);
            const result = sut.formatShipmentMonth(timestamp);
            expect(result).toBe(resultExpected);
        });
    });

    describe('#loadShipmentData', () => {
        const shipmentData = {
            date: '2015-10-29T00:00:00.000Z'
        };
        const shipmentProductsData = {
            activeDate: new Date('2015-10-29T00:00:00.000Z')
        };

        beforeEach(() => {
            shipmentService.getShipmentProductsModelData.and.returnValue(shipmentProductsData);
            sut.loadShipmentData(shipmentData);
        });

        it('should populate controller with products data', () => {
            expect(shipmentService.getShipmentProductsModelData).toHaveBeenCalledWith(shipmentData);
            expect(sut).toEqual(jasmine.objectContaining(shipmentProductsData));
        });
    });
});
