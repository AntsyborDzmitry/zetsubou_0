import ShipmentService from './ewf-shipment-service';
import DateTimeService from './../../services/date-time-service';
import PaymentTypeService from './payment-type/payment-type-service';
import 'angularMocks';

describe('shipmentService', () => {
    let sut;
    let $q;
    let $http;
    let $timeout;
    let logService;

    beforeEach(inject((_$q_, _$http_, _$timeout_) => {
        $q = _$q_;
        $http = _$http_;
        $timeout = _$timeout_;

        logService = jasmine.createSpyObj('logService', ['error']);

        sut = new ShipmentService($http, $q, logService, new DateTimeService(), new PaymentTypeService());
    }));

    describe('setters', () => {
        it('should define setAddressDetails setter', () => {
            expect(sut.setAddressDetails).toBeDefined();
        });

        it('should define setPackageDetails setter', () => {
            expect(sut.setPackageDetails).toBeDefined();
        });
        it('should define setAssociateWithContactId setter', () => {
            expect(sut.setAssociateWithContactId).toBeDefined();
        });
    });

    describe('#setCountrySomParameters', () => {
        it('should set country systems of measurement and return them', () => {
            const expectedResult = {
                shipperCountrySom: 'IMPERIAL',
                userProfileCountrySom: 'METRIC',
                weightConvertionRate: 2.5,
                dimensionConvertionRate: 2.3,
                shipperCountryConversionPrecision: 3,
                userProfileCountryConversionPrecision: 3
            };
            sut.setCountrySomParameters('IMPERIAL', 'METRIC', 2.5, 2.3, 3, 3);

            expect(sut.getCountrySomParameters()).toEqual(jasmine.objectContaining(expectedResult));
        });

        it('should set default convertion rates and precisions if they are not passed', () => {
            const expectedResult = {
                shipperCountrySom: 'IMPERIAL',
                userProfileCountrySom: 'METRIC',
                weightConvertionRate: 1,
                dimensionConvertionRate: 1,
                shipperCountryConversionPrecision: 2,
                userProfileCountryConversionPrecision: 2
            };
            sut.setCountrySomParameters('IMPERIAL', 'METRIC');

            expect(sut.getCountrySomParameters().toString()).toEqual(expectedResult.toString());
        });
    });

    describe('#setCurrencies', () => {
        it('should set currencies list and get it', () => {
            const currenciesList = [{
                type: 'USD',
                symbol: '$'
            }];
            sut.setCurrencies(currenciesList);

            expect(sut.getCurrencies().toString()).toEqual(currenciesList.toString());
        });
    });

    describe('#getShipmentCountry', () => {
        const toData = {name: 'some name', email: 'some email'};
        it('should get shipment country', () => {
            const addressDetailsFrom = {
                addressDetails: {
                    countryCode: 'US'
                }
            };
            sut.setAddressDetails(addressDetailsFrom, toData);

            const country = sut.getShipmentCountry();
            expect(country).toEqual(addressDetailsFrom.addressDetails.countryCode);
        });

        it('should return null if address details from is not set', () => {
            const country = sut.getShipmentCountry();

            expect(country).toEqual(null);
        });

        it('should return null if country is not set', () => {
            const addressDetailsFrom = {};
            sut.setAddressDetails(addressDetailsFrom, toData);

            const country = sut.getShipmentCountry();
            expect(country).toEqual(null);
        });

    });

    describe('#getContactsKeys', function() {
        it('should return contact keys that was set before)', function() {
            const contactsKeys = {
                fromContactKey: '005',
                toContactKey: '004'
            };

            sut.setContactsKeys(contactsKeys);
            const keys = sut.getContactsKeys();

            expect(keys).toEqual(contactsKeys);
        });
    });

    describe('#getShipmentType', function() {
        it('should return shipment type that was set before)', function() {
            const shipmentType = 'DOCUMENT';

            sut.setShipmentType(shipmentType);
            const type = sut.getShipmentType();

            expect(type).toEqual(shipmentType);
        });
    });

    describe('#getShipmentData - returns object with', function() {
        let model;
        beforeEach(function() {
            model = sut.getShipmentData();
        });

        it('fields fromAddress and toAddress', function() {
            expect(model).toEqual(jasmine.objectContaining({
                fromAddress: jasmine.any(Object),
                toAddress: jasmine.any(Object)
            }));
        });
    });

    describe('#getQuotesRequestData', function() {
        it('should return shipment data for quotes request(aka shipment products request)', function() {
            const data = sut.getQuotesRequestData();
            expect(data).toEqual(jasmine.any(Object));
        });
    });

    describe('#saveShipment', function() {
        it('should send shipment data to API by right URL', function() {
            const endpointUrl = '/api/shipment';
            const deferred = $q.defer();
            spyOn($http, 'post').and.returnValue(deferred.promise);

            sut.saveShipment();

            expect($http.post).toHaveBeenCalledWith(endpointUrl, jasmine.any(Object));
        });
    });

    describe('#setCustomsInvoice', () => {
        it('should iterate item attribute rows list and set it to the shipment data', () => {
            const inputData = {
                invoiceDescription: 'customs invoice summarization',
                totalQuantity: 12,
                totalNetWeight: 132,
                totalGrossWeight: 108,
                totalDeclareValue: 100,
                currentCurrency: {
                    type: 'USD'
                },
                productList: [{
                    commodityCode: '123',
                    countryOfManufactureCode: 'US',
                    grossWeight: 9,
                    netWeight: 11,
                    quantity: 12,
                    quantityUnits: 'Pieces',
                    description: 'some text'
                }]
            };
            const expectedResult = {
                type: 'COMMERCIAL_PURPOSES',
                description: 'customs invoice summarization',
                totalPiece: 12,
                totalWeight: 132,
                totalGrossWeight: 108,
                totalDeclareValue: 100,
                currencyCode: 'USD',
                items: [{
                    commodityCode: '123',
                    countryOfManufactureCode: 'US',
                    grossWeight: 9,
                    netWeight: 11,
                    quantity: 12,
                    quantityUnits: 'Pieces',
                    description: 'some text'
                }]
            };

            sut.setCustomsInvoice(inputData);
            expect(sut.getCustomsInvoice().toString()).toEqual(expectedResult.toString());
        });

        it('should set customs invoice to null if no argument passed', () => {
            sut.setCustomsInvoice();
            expect(sut.getCustomsInvoice()).toBeNull();
        });
    });

    describe('#setCustomsInvoicePurpose', () => {
        const reasonForExport = 'some shipment purpose';

        it('should set reason for export', () => {
            sut.setCustomsInvoicePurpose(reasonForExport);
            expect(sut.getCustomsInvoice()).toEqual(jasmine.objectContaining({reasonForExport}));
        });

        it('should set reason for export even if customs invoice is null', () => {
            sut.setCustomsInvoice();
            sut.setCustomsInvoicePurpose(reasonForExport);

            expect(sut.getCustomsInvoice()).toEqual(jasmine.objectContaining({reasonForExport}));
        });
    });

    describe('#setCustomsInvoiceType', () => {
        it('should set customs invoice type', () => {
            const type = 'test';
            sut.setCustomsInvoiceType(type);

            expect(sut.getCustomsInvoiceType()).toEqual(type);
        });
    });

    describe('#setPackageDetails', function() {
        let packagesRows, pieces;
        // TODO: such big test datat makes test hard to read. should use simplified test data
        beforeEach(function() {
            packagesRows = [{
                rowId: 1,
                packageId: 3,
                quantity: 1,
                weight: 5,
                unit: 'METRIC',
                reference: '',
                width: 80,
                height: 80,
                length: 120
            }, {
                rowId: 1,
                packageId: 4,
                quantity: 4,
                weight: 5,
                unit: 'METRIC',
                reference: '',
                width: 80,
                height: 80,
                length: 120
            }];

            pieces = [{
                height: 80,
                width: 80,
                length: 120,
                weight: 5,
                unit: 'METRIC',
                quantity: 1,
                packageId: 3,
                reference: ''
            }, {
                height: 80,
                width: 80,
                length: 120,
                weight: 5,
                unit: 'METRIC',
                quantity: 4,
                packageId: 4,
                reference: ''
            }];
        });

        it('should iterate format packages rows data and set it to shipmentData', function() {
            sut.setPackageDetails(packagesRows);
            expect(sut.getShipmentData().pieces.toString()).toEqual(pieces.toString());
        });
    });

    describe('#setPaymentInfo', () => {
        it('should set payment type to shipmentData', () => {
            const data = {
                transportationPaymentType: 'ALTERNATE_DHLACCOUNT',
                transportationPaymentAccountNumber: '1111',
                quotationAccountNumber: '1',
                quotationType: 'DHL_ACCOUNT',
                splitDutyAndTaxPayment: false,
                dutiesPaymentType: 'DHL_ACCOUNT',
                dutiesPaymentAccountNumber: '4321',
                taxesPaymentType: 'DHL_ACCOUNT',
                taxesPaymentAccountNumber: '1234'
            };

            sut.setPaymentInfo(data);

            expect(sut.getPaymentInfo()).toEqual(data);
        });
    });

    describe('#setIncoterm', () => {
        it('should set incoterm to shipmentdata', () => {
            const data = 'CIP';
            sut.setIncoterm(data);
            expect(sut.getIncoterm()).toEqual(data);
        });
    });

    describe('#setTotalWeight', () => {
       it('should set total weight to shipment data', () => {
            const value = '20';
            const unit = 'shipment.package_details_kg';
            const data = {value, unit};
            sut.setTotalWeight(value, unit);
            expect(sut.getTotalWeight()).toEqual(data);
       });
    });

    describe('#setPickupData', () => {
        it('should set pickup data to shipment data', () => {
            const data = {
                pickupDetails: {
                    pickupLocation: {
                        name: 'Terry Smith',
                        company: 'Acme Company',
                        pickupAddress: {
                            countryCode: 'US',
                            addressLine1: '620 Park Avenue',
                            postCode: '10011',
                            cityName: 'New York',
                            stateOrProvince: 'New York'
                        }
                    },
                    pickupLocationType: 'FRONT DOOR',
                    pickupLocationOtherDescription: '',
                    instructions: 'instructions',
                    pickupDate: '01-01-2015',
                    pickupWindow: {
                        earliestTime: '800',
                        latestTime: '1200'
                    }
                },
                totalWeight: {
                    unit: 'KG',
                    value: 3.0
                }
            };
            sut.setPickupData(data);
            expect(sut.getPickupData()).toEqual(data);
        });
    });

    describe('#setRewardCard', () => {
        it('should set reward card to shipment data', () => {
            const data = {
                promotionCode: 'promotion code',
                rewardCode: 'reward_code',
                rewardCard: '9826300051234567897'
            };
            sut.setRewardCard(data);
            expect(sut.getRewardCard()).toEqual(data);
        });
    });

    describe('#setTotalWeight', () => {
       it('should save total weight', () => {
            const value = '20';
            const unit = 'shipment.package_details_kg';
            const data = {value, unit};
            sut.setTotalWeight(value, unit);
            expect(sut.getTotalWeight()).toEqual(data);
       });
    });

    describe('#isPackage', () => {
        it('should return true if shipment type is Package', () => {
            const shipmentType = 'PACKAGE';
            sut.setShipmentType(shipmentType);
            const result = sut.isPackage();
            expect(result).toBe(true);
        });

        it('should return false if shipment type isn\'t Package', () => {
            const shipmentType = 'DOCUMENT';
            sut.setShipmentType(shipmentType);
            const result = sut.isPackage();
            expect(result).toBe(false);
        });
    });

    describe('#getQuotesRequestData', () => {
        it('should set account account number to quotation account number', () => {
            const quotationAccountNumber = 'testAccountNumber';
            sut.setPaymentInfo({
                quotationAccountNumber
            });
            const result = sut.getQuotesRequestData(new Date());
            expect(result.accountNumber).toBe(quotationAccountNumber);
        });

        it('should set account id to quotation account number if its type is DHL account', () => {
            const quotationAccountNumber = 'testAccountId';
            const quotationType = 'DHL_ACCOUNT';
            sut.setPaymentInfo({
                quotationAccountNumber,
                quotationType
            });
            const result = sut.getQuotesRequestData(new Date());
            expect(result.accountNumber).toBe('');
            expect(result.accountId).toBe('testAccountId');
        });
    });

    describe('#isShipmentWithInvoice', () => {
        it('should be falsy if there is no customs invoice in shipment', () => {
            expect(sut.isShipmentWithInvoice()).toBe(false);
        });

        it('should be truthy if the shipment with customs invoice', () => {
            sut.setCustomsInvoice({
                currentCurrency: {},
                productList: []
            });

            expect(sut.isShipmentWithInvoice()).toBe(true);
        });
    });

    describe('#chargeShipment', () => {
        const paymentSystemUrl = 'some_url';
        const requestData = {callbackUrl: paymentSystemUrl};

        beforeEach(() => {
            spyOn($http, 'post');
            $http.post.and.returnValue($q.when({data: requestData}));
        });

        it('makes a call to backend passing shipmentData', () => {
            sut.chargeShipment();

            expect($http.post).toHaveBeenCalledWith(`/api/shipment/payment/register`, jasmine.any(Object));
        });

        it('parses response', () => {
            const callback = jasmine.createSpy('callback');

            const promise = sut.chargeShipment();
            promise.then(callback);
            $timeout.flush();

            expect(callback).toHaveBeenCalledWith(paymentSystemUrl);
        });

        it('rejects if url is undefined', () => {
            const wrongData = {
                callbackUrl: ''
            };
            $http.post.and.returnValue($q.when({data: wrongData}));

            const promise = sut.chargeShipment();
            const catcher = jasmine.createSpy('catcher');
            promise.catch(catcher);
            $timeout.flush();

            expect(catcher).toHaveBeenCalled();
        });
    });

    describe('#saveShipmentForLater', () => {
       it('should send shipment data to save it for later', () => {
           const name = 'some name';

           spyOn($http, 'post').and.returnValue($q.when());
           sut.saveShipmentForLater(name);

           expect($http.post).toHaveBeenCalledWith('/api/shipment/partial', jasmine.objectContaining({name}));
       });

       it('should log when error happend', () => {
         const errorResponse = {
             data: {
                 errors: ['dictionary.message_key']
             }
         };
         spyOn($http, 'post').and.returnValue($q.reject(errorResponse));
         sut.saveShipmentForLater('');
         $timeout.flush();

         expect(logService.error).toHaveBeenCalledWith(errorResponse);
       });
    });

    describe('#setPaymentProductInfo', () => {
        it('saves payment product to payment data', () => {
            const paymentProduct = '1';
            sut.setPaymentProductInfo(paymentProduct);

            expect(sut.getPaymentInfo().paymentProduct).toBe(paymentProduct);
        });
    });

    describe('#completeShipmentPayment', () => {
        const url = '/api/shipment/payment/complete';
        const shipmentId = '123';
        const hostedCheckoutId = '234';

        beforeEach(() => {
            spyOn($http, 'post');
            $http.post.and.returnValue($q.when({}));
        });

        it('makes backend call for shipment payment status', () => {
            sut.completeShipmentPayment(shipmentId, hostedCheckoutId);

            expect($http.post).toHaveBeenCalledWith(url, {hostedCheckoutId, shipmentId});
        });

        it('parses response', () => {
            const spy = jasmine.createSpy('spy');
            const data = {};
            $http.post.and.returnValue($q.when({data}));

            const promise = sut.completeShipmentPayment();
            promise.then(spy);
            $timeout.flush();

            expect(spy).toHaveBeenCalledWith(data);
        });
    });

    describe('#getSavedShipmentData', () => {
        const shipmentId = 1;
        const url = `/api/shipment/${shipmentId}`;

        beforeEach(() => {
            spyOn($http, 'get');
            $http.get.and.returnValue($q.when({}));
        });

        it('should get saved shipment from API by shipment id', () => {
            sut.getSavedShipmentData(shipmentId);
            expect($http.get).toHaveBeenCalledWith(url);
        });
    });

    describe('#getAddressDetails', () => {
        it('should convert address data to step model data', () => {
            const initialData = {
                countryCode: 'Country Code',
                stateOrProvince: 'State Or Province',
                cityName: 'City',
                postCode: 'Zip Or Post Code',
                addressLine1: 'Address Line 1',
                addressLine2: 'Address Line 2',
                addressLine3: 'Address Line 3'
            };

            const expectedData = {
                countryCode: 'Country Code',
                city: 'City',
                stateOrProvince: 'State Or Province',
                zipOrPostCode: 'Zip Or Post Code',
                addrLine1: 'Address Line 1',
                addrLine2: 'Address Line 2',
                addrLine3: 'Address Line 3'
            };

            expect(sut.getAddressDetails(initialData)).toEqual(expectedData);
        });
    });

    describe('#setPhoneDetails', () => {
        it('should set model data to shipment data', () => {
            const fromModelData = {
                phoneDetails: {
                    phoneType: 'OFFICE',
                    phoneCountryCode: '+38',
                    phone: '044 324 5673',
                    phoneExt: '233',
                    smsEnabled: false,
                    fax: 'FAX'
                }
            };
            const toModelData = {
                phoneDetails: {
                    phoneType: 'MOBILE',
                    phoneCountryCode: '+38',
                    phone: '093 555 1234',
                    phoneExt: null,
                    smsEnabled: false,
                    fax: null
                }
            };
            const shipmentData = {
                fromPhone: {
                    phoneType: 'OFFICE',
                    phoneCountryCode: '+38',
                    phone: '0443245673',
                    phoneExt: '233',
                    smsEnabled: false
                },
                toPhone: {
                    phoneType: 'MOBILE',
                    phoneCountryCode: '+38',
                    phone: '0935551234',
                    phoneExt: null,
                    smsEnabled: false
                }
            };

            sut.setPhoneDetails(fromModelData, toModelData);
            expect(sut.getShipmentData()).toEqual(jasmine.objectContaining(shipmentData));
        });

        it('should set empty phone as null', () => {
            const receiverPhoneData = {
                phoneDetails: {
                    phoneType: 'MOBILE',
                    phoneCountryCode: '+38',
                    phone: '',
                    phoneExt: null,
                    smsEnabled: false,
                    fax: null
                }
            };
            const shipmentData = {
                toPhone: {
                    phoneType: 'MOBILE',
                    phoneCountryCode: '+38',
                    phone: null,
                    phoneExt: null,
                    smsEnabled: false
                }
            };

            sut.setPhoneDetails({}, receiverPhoneData);
            expect(sut.getShipmentData()).toEqual(jasmine.objectContaining(shipmentData));
        });
    });

    describe('#getFromContactFields', () => {
        it('should convert shipment data to step model data', () => {
            const initialData = {
                fromName: 'Name',
                fromEmail: 'Email',
                fromCompany: 'Company',
                fromVatTax: 'Vat Tax',
                fromContactKey: 'Contact Key',
                fromAddress: {},
                fromPhone: {
                    phoneType: 'OFFICE',
                    phoneCountryCode: '+38',
                    phone: '0443245673',
                    phoneExt: '233',
                    smsEnabled: false
                }
            };
            const expectedData = {
                name: 'Name',
                email: 'Email',
                company: 'Company',
                vatTax: 'Vat Tax',
                addressDetails: {
                    key: 'Contact Key'
                },
                phoneDetails: {
                    phoneType: 'OFFICE',
                    phoneCountryCode: '+38',
                    phone: '0443245673',
                    phoneExt: '233',
                    smsEnabled: false
                }
            };
            spyOn(sut, 'getAddressDetails').and.returnValue(expectedData.addressDetails);

            expect(sut.getFromContactFields(initialData)).toEqual(expectedData);
            expect(sut.getAddressDetails).toHaveBeenCalledWith(initialData.fromAddress);
        });
    });

    describe('#getToContactFields', () => {
        it('should convert shipment data to step model data', () => {
            const initialData = {
                toName: 'Name',
                toEmail: 'Email',
                toCompany: 'Company',
                toVatTax: 'Vat Tax',
                toContactKey: 'Contact Key',
                toAddress: {},
                toPhone: {
                    phoneType: 'OFFICE',
                    phoneCountryCode: '+38',
                    phone: '0443245673',
                    phoneExt: '233',
                    smsEnabled: false
                }
            };
            const expectedData = {
                name: 'Name',
                email: 'Email',
                company: 'Company',
                vatTax: 'Vat Tax',
                addressDetails: {
                    key: 'Contact Key'
                },
                phoneDetails: {
                    phoneType: 'OFFICE',
                    phoneCountryCode: '+38',
                    phone: '0443245673',
                    phoneExt: '233',
                    smsEnabled: false
                }
            };
            spyOn(sut, 'getAddressDetails').and.returnValue(expectedData.addressDetails);

            expect(sut.getToContactFields(initialData)).toEqual(expectedData);
            expect(sut.getAddressDetails).toHaveBeenCalledWith(initialData.toAddress);
        });
    });

    describe('#getReceiverContactDetails', () => {
        it('should convert shipment data receiver contact data', () => {
            const toData = {
                name: 'Name',
                email: 'Email',
                company: 'Company',
                vatTax: 'Vat Tax',
                nickname: 'nickname',
                addressDetails: {
                    residentialAddress: true,
                    countryName: 'USA'
                }
            };
            const toPhone = {
                phoneType: 'mobile',
                phoneCountryCode: '11',
                phone: '12345',
                phoneExt: '038',
                smsEnabled: true
            };
            const contactData = {
                name: 'Name',
                email: 'Email',
                company: 'Company',
                vatTax: 'Vat Tax',
                addressDetails: {
                    key: 'Contact Key',
                    countryName: 'USA',
                    residentialAddress: true
                },
                phone: {
                    phoneDetails: toPhone
                },
                nickName: 'nickname'
            };

            spyOn(sut, 'getAddressDetails').and.returnValue(contactData.addressDetails);
            sut.setAddressDetails({}, toData);
            sut.setPhoneDetails({}, {phoneDetails: toPhone});

            expect(sut.getReceiverContactDetails()).toEqual(contactData);
        });
    });

    describe('#getInvolvedPartiesAddressDetails', () => {
        let fromData, toData;
        beforeEach(() => {
            fromData = {
                addressDetails: {
                    addrLine1: 'fromAddress',
                    cityName: 'cityNameFrom',
                    countryName: 'countryNameFrom'
                },
                name: 'fromName',
                email: 'fromEmail',
                company: 'fromCompany',
                vatTax: 'fromVatTax'
            };
            toData = {
                addressDetails: {
                    addrLine1: 'toAddress',
                    cityName: 'cityNameFrom',
                    countryName: 'countryNameFrom'
                },
                name: 'toName',
                email: 'toEmail',
                company: 'toCompany',
                vatTax: 'toVatTax'
            };

            sut.setAddressDetails(fromData, toData);
        });

        it('should return data about shipper and receiver', () => {
            const expectedData = {
                shipper: {
                    name: fromData.name,
                    company: fromData.company,
                    address: fromData.addressDetails.city + ' ' + fromData.addressDetails.addrLine1,
                    country: fromData.addressDetails.countryName,
                    email: fromData.email,
                    vat: fromData.vatTax
                },
                receiver: {
                    name: toData.name,
                    company: toData.company,
                    address: toData.addressDetails.city + ' ' + toData.addressDetails.addrLine1,
                    country: toData.addressDetails.countryName,
                    email: toData.email,
                    vat: toData.vatTax
                }
            };

            const result = sut.getInvolvedPartiesAddressDetails();

            expect(result).toEqual(expectedData);
        });
    });

    describe('#getShipmentTypeData', () => {
        it('should convert document shipment data', () => {
            const initialData = {
                type: 'DOCUMENT',
                documentDescription: 'Document description',
                extendedLiability: true,
                references: [
                    {
                        name: 'Name 1',
                        group: 'Group 1',
                        type: 'Type 1'
                    },
                    {
                        name: 'Name 2',
                        group: 'Group 2',
                        type: 'Type 2'
                    }
                ]
            };
            const expectedData = {
                shipmentType: 'DOCUMENT',
                documentDescription: 'Document description',
                extendedLiability: true,
                primaryReference: {
                    name: 'Name 1',
                    group: 'Group 1',
                    type: 'Type 1'
                },
                additionalReferences: [
                    {
                        name: 'Name 2',
                        group: 'Group 2',
                        type: 'Type 2'
                    }
                ]
            };

            expect(sut.getShipmentTypeData(initialData)).toEqual(expectedData);
        });

        it('should convert package shipment data with invoice creation', () => {
            // saving logic needs to be refactored before implementation of this task
            // more info here https://jira.epam.com/jira/browse/DHLEWFCON-6783
        });

        it('should convert package shipment data with own invoice', () => {
            // this is not implemented for saving, so it is not implemented for loading
        });
    });

    describe('#getPickupModelData', () => {
        it('should convert pickup data', () => {
            const initialData = {
                pickup: {
                    pickupDetails: {
                        pickupLocationType: 'Location Type',
                        pickupLocationOtherDescription: 'Location Description',
                        instructions: 'Instructions',
                        pickupWindow: {
                            earliestTime: 43200000,
                            latestTime: 72000000
                        }
                    },
                    totalWeight: {
                        unit: 'KG',
                        value: 3
                    }
                }
            };
            const expectedData = {
                pickupLocation: {
                    name: 'Location Type'
                },
                pickupLocationOtherDescription: 'Location Description',
                pickupSpecialInstructions: 'Instructions',
                pickupTime: {
                    readyTime: 720,
                    closeTime: 1200
                },
                totalPickupWeight: {
                    unit: 'KG',
                    value: 3
                }
            };

            expect(sut.getPickupModelData(initialData)).toEqual(expectedData);
        });
    });

    describe('#getPaymentTypeModelData', () => {
        it('should convert payment type data', () => {
            const initialData = {
                paymentInfo: {
                    transportationPaymentType: 'TRANSP TYPE',
                    transportationPaymentAccountNumber: 4,
                    quotationType: 'QUOT TYPE',
                    quotationAccountNumber: 1,
                    splitDutyAndTaxPayment: true,
                    dutiesPaymentType: 'DUT TYPE',
                    dutiesPaymentAccountNumber: 3,
                    taxesPaymentType: 'TAX TYPE',
                    taxesPaymentAccountNumber: 2
                }
            };
            const expectedData = {
                transportationPaymentType: {
                    paymentType: 'TRANSP TYPE',
                    accountId: 4
                },
                quotationType: {
                    paymentType: 'QUOT TYPE',
                    accountId: 1
                },
                splitDutyAndTaxPayment: true,
                dutiesPaymentType: {
                    paymentType: 'DUT TYPE',
                    accountId: 3
                },
                taxesPaymentType: {
                    paymentType: 'TAX TYPE',
                    accountId: 2
                }
            };

            expect(sut.getPaymentTypeModelData(initialData)).toEqual(expectedData);
        });
    });

    describe('#getPackageDetailsModelData', () => {
        it('should convert package details data', () => {
            const initialData = {
                fromAddress: {
                    countryCode: 'JP'
                },
                type: 'DOCUMENT',
                pieces: [
                    {
                        height: 80,
                        width: 90,
                        length: 120,
                        weight: 5,
                        unit: 'METRIC',
                        quantity: 1,
                        packageId: 3,
                        refNum: 'Ref'
                    }
                ]
            };
            const expectedData = {
                shipmentCountry: 'JP',
                shipmentType: 'DOCUMENT',
                packagesRows: [
                    {
                        height: 80,
                        width: 90,
                        length: 120,
                        weight: 5,
                        unit: 'METRIC',
                        quantity: 1,
                        packageId: 3,
                        reference: 'Ref',
                        rowId: 1
                    }
                ]
            };

            expect(sut.getPackageDetailsModelData(initialData)).toEqual(expectedData);
        });
    });

    describe('#getShipmentProductsModelData', () => {
        it('should convert shipment products data', () => {
            const initialData = {
                date: '2015-10-29T00:00:00.000Z'
            };
            const expectedData = {
                activeDate: new Date('2015-10-29T00:00:00.000Z')
            };

            expect(sut.getShipmentProductsModelData(initialData)).toEqual(expectedData);
        });
    });

    describe('#setCreditCardPaymentInfo', () => {
        it('formats and saves billing info', () => {
            const name = 'Anrai Thorsted';
            const company = 'Bibendum Sed Inc.';
            const email = 'athorsted@bibendum-sed.com';
            const phoneNumber = '123123123';
            const phoneCountryCode = '+12';
            const addrLine1 = '1147 Seaton Gardens';
            const addrLine2 = null;
            const countryCode = 'US';
            const zipOrPostCode = 'ASD 123';
            const city = 'New York';
            const stateOrProvince = 'Oklahoma';
            const addressDifferent = true;
            const paymentProduct = '1';

            const billingInfo = {name, company, email, addressDifferent, paymentProduct,
                phone: {
                    phoneDetails: {phoneNumber, phoneCountryCode}
                },
                addressDetails: {
                    addrLine1,
                    addrLine2,
                    countryCode,
                    zipOrPostCode,
                    city,
                    stateOrProvince
                }
            };

            const formatted = {name, company, email, phoneCountryCode, phoneNumber, addressDifferent, paymentProduct,
                billingAddress: {
                    countryCode,
                    cityName: city,
                    stateOrProvince,
                    postCode: zipOrPostCode,
                    addressLine1: addrLine1,
                    addressLine2: addrLine2
                }
            };

            sut.setCreditCardPaymentInfo(billingInfo);

            expect(sut.getCreditCardPaymentInfo()).toEqual(formatted);
        });
    });

    describe('#getFormattedShipperAddress', () => {
        it('should return formatted shipper address details', () => {
            const fromData = {
                addressDetails: {
                    addrLine1: '1147 Seaton Gardens',
                    city: 'Ruislip',
                    countryCode: 'GB',
                    countryName: 'United Kingdom',
                    key: '003',
                    province: 'Middlesex',
                    state: 'Middlesex',
                    stateOrProvince: 'Middlesex',
                    zipOrPostCode: 'HA40BA'
                },
                company: 'Bibendum Sed Inc.',
                name: 'Anrai Thorsted'
            };
            const resultExpected = {
                countryCode: 'GB',
                zipOrPostCode: 'HA40BA',
                city: 'Ruislip',
                addrLine1: '1147 Seaton Gardens',
                contactName: 'Anrai Thorsted',
                companyName: 'Bibendum Sed Inc.',
                stateOrProvince: 'Middlesex'
            };
            sut.setAddressDetails(fromData, {});
            expect(sut.getFormattedShipperAddress()).toEqual(jasmine.objectContaining(resultExpected));
        });
    });

    describe('#getShipperAddress', () => {
        it('should return all shipper address details', () => {
            const fromData = {
                addressDetails: {
                    addrLine1: '1147 Seaton Gardens',
                    city: 'Ruislip',
                    countryCode: 'GB',
                    countryName: 'USA',
                    stateOrProvince: 'Middlesex',
                    zipOrPostCode: 'HA40BA'
                },
                company: 'Bibendum Sed Inc.',
                name: 'Anrai Thorsted'
            };
            sut.setAddressDetails(fromData, {});
            expect(sut.getShipperAddress()).toEqual(jasmine.objectContaining(fromData));
        });
    });
});
