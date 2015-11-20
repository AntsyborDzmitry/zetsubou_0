import ShipmentProductsService from './shipment-products-service';
import 'angularMocks';

describe('shipmentProductsService', () => {
    let sut;
    let logService;
    let $q;
    let $http;
    let $httpBackend;
    let $timeout;
    let quotationRequestData = {
        accountNumber: '',
        fromPhone: '123',
        toName: '123',
        fromName: '123',
        toCity: '123',
        toPostalCode: '123',
        fromAddress: '123',
        fromCity: '123',
        toAddress: '123',
        fromPostalCode: '123',
        fromEmail: 'test@gmail.com',
        shipmentType: 'DOCUMENT'
    };


    beforeEach(inject((_$http_, _$q_, _$httpBackend_, _$timeout_) => {
        $http = _$http_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        logService = jasmine.createSpyObj('logService', ['log', 'error']);

        sut = new ShipmentProductsService($http, $q, logService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getShipmentDates', () => {
        it('should make API call to proper URL', () => {
            const countryCode = 'US';
            const postCode = '1';
            const cityName = 'New York';
            const endpointUrl = `/api/shipment/products/shipmentDates/${countryCode}/${postCode}/${cityName}`;
            spyOn($http, 'get').and.returnValue($q.defer().promise);

            sut.getShipmentDates(countryCode, postCode, cityName);

            expect($http.get).toHaveBeenCalledWith(endpointUrl);
        });

        it('should resolve promise with response data', () => {
            const data = ['item1', 'item2'];
            const response = {data};
            const deferred = $q.defer();
            spyOn($http, 'get').and.returnValue(deferred.promise);
            const callback = jasmine.createSpy('callback');

            sut.getShipmentDates().then(callback);

            deferred.resolve(response);
            $timeout.flush();

            expect(callback).toHaveBeenCalledWith(data);
        });

        it('should log error with logService if failed', () => {
            const deferred = $q.defer();
            spyOn($http, 'get').and.returnValue(deferred.promise);

            sut.getShipmentDates();

            deferred.reject({});
            $timeout.flush();

            expect(logService.error).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Object));
        });
    });

    describe('#getProductsByDate', () => {
        const dateTimestamp = 1438635600021;
        let postDefer;

        beforeEach(() => {
            postDefer = $q.defer();
            spyOn($http, 'post').and.returnValue(postDefer.promise);
        });

        it('should make API call to proper URL with quotation request data', () => {
            const endpointUrl = '/api/shipment/products/list';
            sut.getProductsByDate(dateTimestamp, quotationRequestData);
            expect(quotationRequestData.readyTime).toBe(dateTimestamp);
            expect($http.post).toHaveBeenCalledWith(endpointUrl, quotationRequestData);
        });

        it('should cache geted products by date', () => {
            const products = [{}];
            const response = {
                data: {
                    products
                }
            };
            const callbackSpy = jasmine.createSpy('callbackSpy');

            sut.getProductsByDate(dateTimestamp, quotationRequestData);
            postDefer.resolve(response);
            $timeout.flush();

            sut.getProductsByDate(dateTimestamp, quotationRequestData)
                .then(callbackSpy);
            $timeout.flush();

            expect($http.post.calls.count()).toBe(1);
            expect(callbackSpy).toHaveBeenCalledWith(products);
        });

        it('should sort products descended by estimated delivery time', () => {
            const productOne = {
                estimatedDelivery: 20
            };
            const productTwo = {
                estimatedDelivery: 10
            };
            const products = [productOne, productTwo];
            const response = {
                data: {
                    products
                }
            };

            sut.getProductsByDate(dateTimestamp, quotationRequestData);
            postDefer.resolve(response);
            $timeout.flush();

            expect(products[0]).toBe(productTwo);
        });
    });

    describe('#clearProductsCache', () => {
        it('should remove all cached products', () => {
            const dateTimestamp = 1438635600021;
            const postDefer = $q.defer();
            spyOn($http, 'post').and.returnValue(postDefer.promise);

            sut.getProductsByDate(dateTimestamp, quotationRequestData);
            postDefer.resolve({});
            $timeout.flush();

            sut.clearProductsCache();

            sut.getProductsByDate(dateTimestamp, quotationRequestData);

            expect($http.post.calls.count()).toBe(2);
        });
    });

    describe('#getFavoriteProduct', () => {
        it('should make API call to proper URL', () => {
            const endpointUrl = '/api/shipment/products/favoriteCode';
            spyOn($http, 'get').and.returnValue($q.defer().promise);

            sut.getFavoriteProduct();

            expect($http.get).toHaveBeenCalledWith(endpointUrl);
        });

        it('should return product code on success', () => {
            const data = 'D';
            const response = {data};
            const deferred = $q.defer();
            spyOn($http, 'get').and.returnValue(deferred.promise);
            const callback = jasmine.createSpy('callback');

            sut.getFavoriteProduct().then(callback);

            deferred.resolve(response);
            $timeout.flush();

            expect(callback).toHaveBeenCalledWith(data);
        });

        it('should log error with logService if failed', () => {
            const deferred = $q.defer();
            spyOn($http, 'get').and.returnValue(deferred.promise);

            sut.getFavoriteProduct();

            deferred.reject({});
            $timeout.flush();

            expect(logService.error).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Object));
        });
    });

    describe('#getProductWithDiscount', () => {
        let accountNumber = '';
        const code = '123';
        const products = [
            {code},
            {code: '234'}
        ];
        const targetProduct = {code};
        const shipmentDate = +new Date();

        beforeEach(() => {
            spyOn(sut, 'getProductsByDate');
            sut.getProductsByDate.and.returnValue($q.when(products));
        });

        it('assigned accountNumber to quotationRequestData', () => {
            accountNumber = 'expectedAccountNumber';

            sut.getProductWithDiscount(accountNumber, targetProduct, shipmentDate, quotationRequestData);

            expect(quotationRequestData.accountNumber).toEqual(accountNumber);
        });

        it('fetches products by calling getProductsByDate', () => {
            sut.getProductWithDiscount(accountNumber, targetProduct, shipmentDate, quotationRequestData);

            expect(sut.getProductsByDate)
                .toHaveBeenCalledWith(shipmentDate, quotationRequestData);
        });

        it('filters target product from fetched products', () => {
            const promise =
                sut.getProductWithDiscount(accountNumber, targetProduct, shipmentDate, quotationRequestData);
            $timeout.flush();

            promise.then((product) => {
                expect(product.code).toEqual(targetProduct.code);
            });
        });
    });

    describe('#getShipmentTimezoneOffset', () => {
        it('should return timezone offset', () => {
            const timeZoneOffset = '800';
            const response = {data: {timeZoneOffset}};
            const deferred = $q.defer();
            spyOn($http, 'get').and.returnValue(deferred.promise);
            sut.getShipmentDates();
            deferred.resolve(response);
            $timeout.flush();

            expect(sut.getShipmentTimezoneOffset()).toBe(timeZoneOffset);
        });
    });
});
