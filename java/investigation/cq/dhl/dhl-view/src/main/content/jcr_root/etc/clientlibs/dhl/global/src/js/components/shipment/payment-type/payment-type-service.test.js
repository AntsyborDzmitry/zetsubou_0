import PaymentTypeService from './payment-type-service';
import ShipmentErrorService from './../ewf-shipment-error-service';
import NlsService from './../../../services/nls-service';
import 'angularMocks';

describe('paymentTypeService', () => {
    let sut, logService, shipmentErrorService, nlsService;
    let $httpBackend, $http, $q, $timeout;

    beforeEach(inject((_$http_, _$q_, _$httpBackend_, _$timeout_) => {
        $httpBackend = _$httpBackend_;
        $http = _$http_;
        $q = _$q_;
        $timeout = _$timeout_;
        logService = jasmine.createSpyObj('logService', ['log']);
        shipmentErrorService = jasmine.mockComponent(new ShipmentErrorService());
        nlsService = jasmine.mockComponent(new NlsService());

        sut = new PaymentTypeService($http, $q, logService, shipmentErrorService, nlsService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getPaymentTypeList', () => {
        const keys = {
            shipmentCountry: '',
            fromContactKey: ''
        };
        const shipmentCountry = 'US';
        let shipmentType = 'import';
        let data = {
            paymentOptions: [{
                name: 'Nick name of DHL Shipper account',
                accountNumber: '12****45',
                key: '002',
                accountId: '654987',
                shipper: true,
                isImport: true,
                paymentType: 'DHL_ACCOUNT'
            }, {
                name: 'nls-key',
                paymentType: 'RECEIVER_WILL_PAY'
            }, {
                name: 'nls-key',
                paymentType: 'ALTERNATE_DHLACCOUNT'
            }, {
                name: 'Nick name of DHL Shipper account',
                accountNumber: '11****11',
                key: '11',
                accountId: '1',
                shipper: true,
                paymentType: 'DHL_ACCOUNT'
            }
        ]
        };

        it('should make API call to proper URL', () => {
            const error = 'some error';
            $httpBackend.whenPOST('/api/shipment/payment/list').respond(422, error);
            sut.getPaymentTypeList(shipmentCountry, keys);
            $httpBackend.flush();

            expect(logService.log).toHaveBeenCalledWith(`Payment type failed with ${error}`);
        });

        it('should return filtered paymentOptions according to shipment type', () => {
            const defer = $q.defer();
            const resultExpected = [data.paymentOptions[0], data.paymentOptions[1], data.paymentOptions[2]];
            spyOn($http, 'post').and.returnValue(defer.promise);
            let promise = sut.getPaymentTypeList(shipmentCountry, keys, shipmentType);
            defer.resolve({data});
            $timeout.flush();

            promise.then((filteredData) => {
                expect(filteredData.paymentOptions).toEqual(resultExpected);
                expect(filteredData.defaults).not.toBeDefined();
            });
        });

        it('should return paymentOptions with defaults if duties and taxes are shown', () => {
            const defer = $q.defer();
            spyOn($http, 'post').and.returnValue(defer.promise);
            let promise = sut.getPaymentTypeList(shipmentCountry, keys, shipmentType, true);
            defer.resolve({data});
            $timeout.flush();

            promise.then((filteredData) => {
                expect(filteredData.defaults).toBeDefined();
            });
        });

        it('should set user profile default value \'receiver will pay\' option as default for duties and taxes', () => {
            const defer = $q.defer();
            data.userDefaults = {
                importDutiesAndTaxesAccount: {
                    type: 'receiverPay'
                }
            };
            const paymentTypeExpected = 'RECEIVER_WILL_PAY';
            spyOn($http, 'post').and.returnValue(defer.promise);
            let promise = sut.getPaymentTypeList(shipmentCountry, keys, shipmentType, true);
            defer.resolve({data});
            $timeout.flush();

            promise.then((filteredData) => {
                expect(filteredData.defaults.duties.paymentType).toEqual(paymentTypeExpected);
                expect(filteredData.defaults.taxes.paymentType).toEqual(paymentTypeExpected);
            });
        });

        it('should set user profile default value alternate dhl account option as default for duties and taxes', () => {
            const defer = $q.defer();
            data.userDefaults = {
                importDutiesAndTaxesAccount: {
                    type: 'alternate'
                }
            };
            const paymentTypeExpected = 'ALTERNATE_DHLACCOUNT';
            spyOn($http, 'post').and.returnValue(defer.promise);
            let promise = sut.getPaymentTypeList(shipmentCountry, keys, shipmentType, true);
            defer.resolve({data});
            $timeout.flush();

            promise.then((filteredData) => {
                expect(filteredData.defaults.duties.paymentType).toEqual(paymentTypeExpected);
                expect(filteredData.defaults.taxes.paymentType).toEqual(paymentTypeExpected);
            });
        });

        it(`should set user profile default value option as default for duties and taxes
                if contact settings defaults are null`, () => {
            const defer = $q.defer();
            data.userDefaults = {
                importDutiesAndTaxesAccount: {
                    type: 'receiverPay'
                }
            };
            data.toPaymentSetting = {
                accountForDuties: null
            };
            const paymentTypeExpected = 'RECEIVER_WILL_PAY';
            spyOn($http, 'post').and.returnValue(defer.promise);
            let promise = sut.getPaymentTypeList(shipmentCountry, keys, shipmentType, true);
            defer.resolve({data});
            $timeout.flush();

            promise.then((filteredData) => {
                expect(filteredData.defaults.duties.paymentType).toEqual(paymentTypeExpected);
                expect(filteredData.defaults.taxes.paymentType).toEqual(paymentTypeExpected);
            });
        });

        it('should set user profile default value dhl account option as default for duties and taxes', () => {
            const defer = $q.defer();
            data.userDefaults = {
                importDutiesAndTaxesAccount: {
                    type: 'account',
                    data: {
                        key: '002'
                    }
                }
            };
            spyOn($http, 'post').and.returnValue(defer.promise);
            let promise = sut.getPaymentTypeList(shipmentCountry, keys, shipmentType, true);
            defer.resolve({data});
            $timeout.flush();

            promise.then((filteredData) => {
                expect(filteredData.defaults.duties).toEqual(data.paymentOptions[0]);
                expect(filteredData.defaults.taxes).toEqual(data.paymentOptions[0]);
            });
        });

        it('should set toContact default values as default for duties and taxes', () => {
            const defer = $q.defer();
            data.toPaymentSetting = {
                accountForDuties: {
                    type: 'RECEIVER_WILL_PAY'
                }
            };
            const resultExpected = 'RECEIVER_WILL_PAY';
            spyOn($http, 'post').and.returnValue(defer.promise);
            let promise = sut.getPaymentTypeList(shipmentCountry, keys, shipmentType, true);
            defer.resolve({data});
            $timeout.flush();

            promise.then((filteredData) => {
                expect(filteredData.defaults.duties.paymentType).toEqual(resultExpected);
                expect(filteredData.defaults.taxes.paymentType).toEqual(resultExpected);
            });
        });

        it(`should set toContact default values as default for duties
                and taxes separately if there are accountForTaxes`, () => {
            const defer = $q.defer();
            data.toPaymentSetting = {
                accountForDuties: {
                    type: 'RECEIVER_WILL_PAY'
                },
                accountForTaxes: {
                    type: 'ALTERNATE_DHLACCOUNT'
                }
            };
            const dutiesExpected = 'RECEIVER_WILL_PAY';
            const taxesExpected = 'ALTERNATE_DHLACCOUNT';
            spyOn($http, 'post').and.returnValue(defer.promise);
            let promise = sut.getPaymentTypeList(shipmentCountry, keys, shipmentType, true);
            defer.resolve({data});
            $timeout.flush();

            promise.then((filteredData) => {
                expect(filteredData.defaults.duties.paymentType).toEqual(dutiesExpected);
                expect(filteredData.defaults.taxes.paymentType).toEqual(taxesExpected);
            });
        });

        it('should set fromContact default value as default for duties and taxes', () => {
            const defer = $q.defer();
            data.fromPaymentSetting = {
                accountForDuties: {
                    key: '002',
                    type: 'DHL_ACCOUNT'
                }
            };
            data.toPaymentSetting = {};
            spyOn($http, 'post').and.returnValue(defer.promise);
            let promise = sut.getPaymentTypeList(shipmentCountry, keys, shipmentType, true);
            defer.resolve({data});
            $timeout.flush();

            promise.then((filteredData) => {
                expect(filteredData.defaults.duties).toEqual(data.paymentOptions[0]);
                expect(filteredData.defaults.taxes).toEqual(data.paymentOptions[0]);
            });
        });

        it('should map credit card type to a new value', () => {
            const defer = $q.defer();
            spyOn($http, 'post').and.returnValue(defer.promise);
            data.paymentOptions = [{
                name: 'shipment.payment_type_credit_card',
                paymentType: 'CREDIT_CARD'
            }];
            let promise = sut.getPaymentTypeList(shipmentCountry, keys, shipmentType, true);
            defer.resolve({data});
            $timeout.flush();

            promise.then((filteredData) => {
                expect(filteredData.paymentOptions[0].paymentType).toEqual('CRC');
            });
        });
    });

    describe('#validatePaymentAccount', () => {
        it('should make API call to proper URL', () => {
            const validationError = 'validation error';
            const payment = {
                paymentType: '',
                accountNumber: ''
            };
            $httpBackend.whenPOST('/api/shipment/payment/account/validate').respond(422, validationError);
            sut.validatePaymentAccount(payment);
            $httpBackend.flush();

            expect(logService.log).toHaveBeenCalledWith(`Validation failed ${validationError}`);
        });
    });

    describe('#getIncoterms', () => {
        it('should make API call to proper URL', () => {
            const shipmentCountry = 'US';
            const endpointUrl = `/api/shipment/payment/incoterm/list/${shipmentCountry}`;
            const postDefer = $q.defer();
            spyOn($http, 'get').and.returnValue(postDefer.promise);
            sut.getIncoterms(shipmentCountry);

            expect($http.get).toHaveBeenCalledWith(endpointUrl);
        });

        it('should return sorted list of incoterms options', () => {
            const defer = $q.defer();
            const shipmentCountry = 'US';
            const incoterms = [{
                code: 'DAP'
            }, {
                code: 'EXW'
            }, {
                code: 'CIP'
            }, {
                code: 'DAT'
            }];
            const incotermsSorted = [incoterms[2], incoterms[0], incoterms[3], incoterms[1]];
            spyOn($http, 'get').and.returnValue(defer.promise);
            sut.getIncoterms(shipmentCountry);
            defer.resolve({data: {incoterms}});
            $timeout.flush();

            expect(incoterms).toEqual(incotermsSorted);
        });
    });

    describe('#getIncotermDefaultValueForDutiesAndTaxes', () => {
        it('should return default value DAP if duties payment type Receiver Will Pay is selected', () => {
            const dutiesTypeSelected = {
                paymentType: 'RECEIVER_WILL_PAY'
            };
            const data = {dutiesTypeSelected};
            const resultExpected = {code: 'DAP'};
            const result = sut.getIncotermDefaultValueForDutiesAndTaxes(data);

            expect(result).toEqual(resultExpected);
        });

        it('should return default value DAP if duties payment type Alternate DHL Account is selected', () => {
            const dutiesTypeSelected = {
                paymentType: 'ALTERNATE_DHLACCOUNT'
            };
            const data = {dutiesTypeSelected};
            const resultExpected = {code: 'DAP'};
            const result = sut.getIncotermDefaultValueForDutiesAndTaxes(data);

            expect(result).toEqual(resultExpected);
        });

        it('should return default value DAP if import account number is selected for duties payment type', () => {
            const dutiesTypeSelected = {
                paymentType: 'DHL_ACCOUNT',
                isImport: true
            };
            const data = {dutiesTypeSelected};
            const resultExpected = {code: 'DAP'};
            const result = sut.getIncotermDefaultValueForDutiesAndTaxes(data);

            expect(result).toEqual(resultExpected);
        });

        it('should return default value DTP if export account number is selected for duties payment type', () => {
            const dutiesTypeSelected = {
                paymentType: 'DHL_ACCOUNT',
                isImport: false,
                isLocal: false
            };
            const data = {dutiesTypeSelected};
            const resultExpected = {code: 'DTP'};
            const result = sut.getIncotermDefaultValueForDutiesAndTaxes(data);

            expect(result).toEqual(resultExpected);
        });

        it('should return default value if default values for duties and taxes are same and they are splitted', () => {
            const paymentType = {paymentType: 'RECEIVER_WILL_PAY'};
            const data = {
                dutiesTypeSelected: paymentType,
                taxesTypeSelected: paymentType,
                splitDutiesAndTaxes: true
            };
            const resultExpected = {code: 'DAP'};
            const result = sut.getIncotermDefaultValueForDutiesAndTaxes(data);

            expect(result).toEqual(resultExpected);
        });

        it(`should not return default value
                if default values for duties and taxes are not same and they are splitted`, () => {
            const dutiesTypeSelected = {paymentType: 'RECEIVER_WILL_PAY'};
            const taxesTypeSelected = {
                paymentType: 'DHL_ACCOUNT',
                isImport: false,
                isLocal: false
            };
            const data = {
                dutiesTypeSelected,
                taxesTypeSelected,
                splitDutiesAndTaxes: true
            };
            const result = sut.getIncotermDefaultValueForDutiesAndTaxes(data);

            expect(result).toBeUndefined();
        });
    });

    describe('#hasAccounts', () => {
        const keys = {
            shipmentCountry: '',
            fromContactKey: ''
        };
        const shipmentCountry = 'US';
        const shipmentType = 'import';
        let defer;

        beforeEach(() => {
            defer = $q.defer();
            spyOn($http, 'post').and.returnValue(defer.promise);
        });

        it('should return true if there are dhl accounts in the payment options', () => {
            const data = {
                paymentOptions: [{
                    paymentType: 'DHL_ACCOUNT'
                }, {
                    paymentType: 'RECEIVER_WILL_PAY'
                }]
            };
            sut.getPaymentTypeList(shipmentCountry, keys, shipmentType);
            defer.resolve({data});
            $timeout.flush();

            expect(sut.hasAccounts()).toBe(true);
        });

        it('should return false if there are no dhl accounts in the payment options', () => {
            const data = {
                paymentOptions: [{
                    paymentType: 'RECEIVER_WILL_PAY'
                }]
            };
            sut.getPaymentTypeList(shipmentCountry, keys, shipmentType);
            defer.resolve({data});
            $timeout.flush();

            expect(sut.hasAccounts()).toBe(false);
        });
    });

    describe('#isCreditCardPayment', () => {
        it('returns true for credit card payments', () => {
            const creditPayment = {
                paymentType: sut.PAYMENT_TYPES.CREDIT_CARD
            };
            expect(sut.isCreditCardPayment(creditPayment)).toBe(true);
        });

        it('returns false for non-credit card payments', () => {
            const dhlAccountPayment = {
                paymentType: sut.PAYMENT_TYPES.DHL_ACCOUNT
            };
            expect(sut.isCreditCardPayment(dhlAccountPayment)).toBe(false);
        });
    });

    describe('#getPaymentProducts', () => {
        beforeEach(() => {
            spyOn($http, 'get');
            $http.get.and.returnValue($q.when({}));
        });

        it('makes backend call for payment products passing countryId', () => {
            const countryId = 'GB';
            const expectedUrl = `/api/payment/list?country=${countryId}`;

            sut.getPaymentProducts(countryId);

            expect($http.get).toHaveBeenCalledWith(expectedUrl);
        });

        it('parses response', () => {
            const data = [
                {paymentProduct: 'visa'},
                {paymentProduct: 'maestro'}
            ];
            $http.get.and.returnValue($q.when({data}));
            const callback = jasmine.createSpy('callback');

            sut.getPaymentProducts().then(callback);
            $timeout.flush();

            expect(callback).toHaveBeenCalledWith(data);
        });

        it('rejects if data is not an array', () => {
            const response = {data: {}};
            $http.get.and.returnValue($q.when(response));

            sut.getPaymentProducts();
            $timeout.flush();

            expect(shipmentErrorService.processErrorCode).toHaveBeenCalledWith(response);
        });

        it('attaches labels to payment products', () => {
            const label = 'Visa';
            nlsService.getTranslationSync.and.returnValue(label);
            const product = {paymentProduct: 'visa'};
            const productWithLabel = {paymentProduct: 'visa', label};
            const data = [product];
            $http.get.and.returnValue($q.when({data}));

            const callback = jasmine.createSpy('callback');
            sut.getPaymentProducts().then(callback);
            $timeout.flush();

            expect(callback).toHaveBeenCalledWith([productWithLabel]);
        });

        it('catches and logs an error', () => {
            const deferred = $q.defer();
            $http.get.and.returnValue(deferred.promise);

            const errorData = {error: 'some error'};
            const response = {data: errorData};
            deferred.reject(response);

            sut.getPaymentProducts();
            $timeout.flush();

            expect(shipmentErrorService.processErrorCode).toHaveBeenCalledWith(response);
        });
    });

    describe('#getCreditBuffer', () => {
        const buffer = 20;
        const data = {buffer};
        const response = {data};

        beforeEach(() => {
            spyOn($http, 'get');
            $http.get.and.returnValue($q.when(response));
        });

        it('makes backend call passing countryId', () => {
            const countryId = 'GB';
            const url = `/api/payment/buffer?country=${countryId}`;

            sut.getCreditBuffer(countryId);

            expect($http.get).toHaveBeenCalledWith(url);
        });

        it('parses response', () => {
            const promise = sut.getCreditBuffer();

            const catcher = jasmine.createSpy('success');
            promise.then(catcher);

            $timeout.flush();

            expect(catcher).toHaveBeenCalledWith(data.buffer);
        });

        it('rejects if wrong data detected', () => {
            const badResponse = {data: {}};
            $http.get.and.returnValue($q.when(badResponse));

            sut.getCreditBuffer();
            $timeout.flush();

            expect(shipmentErrorService.processErrorCode).toHaveBeenCalledWith(badResponse);
        });
    });
});
