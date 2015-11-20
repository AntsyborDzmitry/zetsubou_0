import PaymentTypeController from './payment-type-controller';
import ShipmentService from './../ewf-shipment-service';
import NlsService from './../../../services/nls-service';
import PaymentTypeService from './payment-type-service';
import UserService from './../../../services/user-service';
import RuleService from 'services/rule-service';
import 'angularMocks';

describe('PaymentTypeController', () => {
    let sut, $q, $timeout;
    let logService, paymentTypeService, shipmentService, nlsService, userService, ruleService;
    let paymentFormField;
    let deferred, rulesDeferred;

    beforeEach(module('ewf'));
    beforeEach(inject(function(_$q_, _$timeout_) {
        $q = _$q_;
        $timeout = _$timeout_;
        deferred = $q.defer();
        rulesDeferred = $q.defer();

        logService = jasmine.createSpyObj('logService', ['log']);
        userService = jasmine.mockComponent(new UserService());
        paymentTypeService = jasmine.mockComponent(new PaymentTypeService());
        nlsService = jasmine.mockComponent(new NlsService());
        ruleService = jasmine.mockComponent(new RuleService());

        shipmentService = jasmine.mockComponent(new ShipmentService());
        shipmentService.setPaymentInfo.and.callThrough();
        shipmentService.setIncoterm.and.callThrough();

        paymentTypeService.getPaymentTypeList.and.returnValue(deferred.promise);
        paymentTypeService.validatePaymentAccount.and.returnValue(deferred.promise);
        paymentTypeService.getIncoterms.and.returnValue(deferred.promise);
        ruleService.acquireRulesForFormFields.and.returnValue(rulesDeferred.promise);
        shipmentService.getShipmentCountry.and.returnValue('US');

        sut = new PaymentTypeController(
            $q,
            $timeout,
            logService,
            nlsService,
            userService,
            shipmentService,
            paymentTypeService,
            ruleService
        );

        paymentFormField = jasmine.createSpyObj('quotationType', ['$setViewValue']);
        sut.paymentTypeForm = {
            quotationType: paymentFormField,
            transportationPaymentType: paymentFormField
        };

        sut.paymentTypeList = [{
            name: 'My Export Account',
            description: '',
            number: '2141242412',
            type: 'account'
        }];
    }));

    describe('#onInit', () => {
        it('should pre-load localization dictionary for common', () => {
            sut.init();
            expect(nlsService.getDictionary).toHaveBeenCalledWith('common');
        });
    });

    describe('#onEdit', () => {
        const response = {
            paymentOptions: [{
                name: 'Nick name of DHL Shipper account',
                accountNumber: '12****45',
                key: '002',
                accountId: '654987',
                shipper: true,
                paymentType: 'DHL_ACCOUNT'
            }, {
                name: 'Nick name of DHL Shipper account',
                accountNumber: '33****44',
                key: '003',
                accountId: '102371',
                shipper: true,
                paymentType: 'DHL_ACCOUNT'
            }, {
                name: 'Nick name of DHL nonShipper account',
                accountNumber: '34****56',
                key: '004',
                accountId: '223344',
                shipper: false,
                isImport: true,
                paymentType: 'DHL_ACCOUNT'
            }, {
                name: 'nls-key',
                paymentType: 'CREDIT_CARD'
            }, {
                name: 'nls-key',
                paymentType: 'PAYPAL'
            }, {
                name: 'nls-key',
                paymentType: 'CASH'
            }, {
                name: 'nls-key',
                paymentType: 'RECEIVER_WILL_PAY'
            }, {
                name: 'nls-key',
                paymentType: 'ALTERNATE_DHLACCOUNT'
            }],
            defaults: {}
        };

        beforeEach(() => {
            shipmentService.getShipmentCountry.and.returnValue('US');
            shipmentService.getDestinationCountry.and.returnValue('UK');
            userService.getUserCountry.and.returnValue('UA');
            shipmentService.isPackage.and.returnValue(true);
        });

        it('should call getPaymentTypeList service method to get available payment types for current country', () => {
            sut.onEdit();
            expect(shipmentService.getShipmentCountry).toHaveBeenCalled();
            expect(paymentTypeService.getPaymentTypeList).toHaveBeenCalled();
        });

        it('should clear previously loaded payment options and show loading message in options', () => {
            sut.onEdit();
            expect(sut.paymentAccounts.others).toEqual([sut.LOADING_OPTION]);
            expect(sut.paymentAccounts.shippers).toEqual([]);
        });

        it(`should add to and from contact keys to contacts
                and set associationContact to first option from contacts`, () => {
            const contacts = {
                fromContactKey: '01',
                toContactKey: '01'
            };
            const contactsExpected = [
                {
                    id: '01',
                    name: 'Ship To Address'
                },
                {
                    id: '01',
                    name: 'Ship From Address'
                }
            ];
            nlsService.getTranslationSync = function(option) {
                if (option === 'shipment.payment_type_ship_to_address') {
                    return 'Ship To Address';
                } else if (option === 'shipment.payment_type_ship_from_address') {
                    return 'Ship From Address';
                }
            };
            userService.isAuthorized.and.returnValue(true);
            shipmentService.getContactsKeys.and.returnValue(contacts);
            sut.onEdit();
            expect(sut.associateWithContacts).toEqual(contactsExpected);
            expect(sut.associatedContact).toEqual(contactsExpected[0]);
        });

        it('should filter NOT shipper accounts and put it to separate array', () => {
            const resultExpected = 5;
            sut.onEdit();
            deferred.resolve(response);
            $timeout.flush();

            expect(sut.paymentAccounts.others.length).toEqual(resultExpected);
        });

        it('should filter NOT shipper import accounts and put it to separate array if the shipment is import', () => {
            const resultExpected = 5;
            const country = 'UA';
            shipmentService.getDestinationCountry.and.returnValue(country);
            userService.getUserCountry.and.returnValue(country);
            sut.onEdit();
            deferred.resolve(response);
            $timeout.flush();

            expect(sut.paymentAccounts.others.length).toEqual(resultExpected);
        });

        it('should filter DHL shipper accounts and put it to separate array', () => {
            const resultExpected = 2;
            sut.onEdit();
            deferred.resolve(response);
            $timeout.flush();

            expect(sut.paymentAccounts.shippers.length).toEqual(resultExpected);
        });

        it('should filter DHL shipper accounts and put it into single array id there is only 1 shipper account', () => {
            const shippersLengthExpected = 0;
            const othersLengthExpected = 7;
            response.paymentOptions[1].shipper = false;
            sut.onEdit();
            deferred.resolve(response);
            $timeout.flush();

            expect(sut.paymentAccounts.shippers.length).toEqual(shippersLengthExpected);
            expect(sut.paymentAccounts.others.length).toEqual(othersLengthExpected);
        });

        it('should filter duties and taxes payment options and put it to separate array', () => {
            const resultExpected = 5;
            sut.onEdit();
            deferred.resolve(response);
            $timeout.flush();

            expect(sut.paymentAccounts.duties.length).toEqual(resultExpected);
        });

        it('should set shipmentType to domestic if from, to and user profile countries are same', () => {
            const resultExpected = 'domestic';
            shipmentService.getDestinationCountry.and.returnValue('US');
            userService.getUserCountry.and.returnValue('US');

            sut.onEdit();
            expect(sut.shipmentType).toBe(resultExpected);
        });

        it(`should set shipmentType to import
                if country to and user profile countries are same, from is different`, () => {
            const resultExpected = 'import';
            shipmentService.getDestinationCountry.and.returnValue('UK');
            userService.getUserCountry.and.returnValue('UK');

            sut.onEdit();
            expect(sut.shipmentType).toBe(resultExpected);
        });

        it(`should set shipmentType to export
                if country from and user profile countries are same, to is different`, () => {
            const resultExpected = 'export';
            shipmentService.getDestinationCountry.and.returnValue('UK');
            userService.getUserCountry.and.returnValue('US');

            sut.onEdit();
            expect(sut.shipmentType).toBe(resultExpected);
        });

        it('should set shipmentType to empty value if all countries are different', () => {
            const resultExpected = '';
            shipmentService.getDestinationCountry.and.returnValue('UK');
            shipmentService.getShipmentCountry.and.returnValue('UA');
            userService.getUserCountry.and.returnValue('US');

            sut.onEdit();
            expect(sut.shipmentType).toBe(resultExpected);
        });

        it('should set default duties option to dutiesDefaultOption', () => {
            const expectedResult = response.paymentOptions[7];
            shipmentService.isPackage.and.returnValue(false);
            response.defaults = {
                duties: expectedResult
            };
            sut.onEdit();
            deferred.resolve(response);
            $timeout.flush();
            expect(sut.dutiesDefaultOption).toEqual(expectedResult);
        });

        it('should set default taxes option to taxesDefaultOption', () => {
            const expectedResult = response.paymentOptions[7];
            shipmentService.isPackage.and.returnValue(false);
            response.defaults = {
                taxes: expectedResult
            };
            sut.onEdit();
            deferred.resolve(response);
            $timeout.flush();
            expect(sut.taxesDefaultOption).toEqual(expectedResult);
        });

        it('should update dutiesPaymentType according to duties default value', () => {
            const expectedResult = {
                name: 'nls-key',
                paymentType: 'RECEIVER_WILL_PAY'
            };
            response.defaults = {
                duties: expectedResult
            };
            shipmentService.isPackage.and.returnValue(true);
            sut.onEdit();
            deferred.resolve(response);
            $timeout.flush();
            expect(sut.dutiesPaymentType).toEqual(expectedResult);
        });

        it('should update taxesPaymentType according to taxes default value', () => {
            const expectedResult = {
                name: 'nls-key',
                paymentType: 'ALTERNATE_DHLACCOUNT'
            };
            response.defaults = {
                taxes: expectedResult
            };
            shipmentService.isPackage.and.returnValue(true);
            sut.splitDutyAndTaxPayment = false;
            sut.onEdit();
            deferred.resolve(response);
            $timeout.flush();
            expect(sut.taxesPaymentType).toEqual(expectedResult);
        });

        it(`should set duties option to default value
                if payment types do not have duties type selected previously`, () => {
            const expectedResult = response.paymentOptions[1];
            response.defaults.duties = expectedResult;
            sut.dutiesPaymentType = {
                name: 'Nick name of DHL Shipper account',
                accountNumber: '33****55',
                key: '444',
                accountId: '1',
                shipper: true,
                paymentType: 'DHL_ACCOUNT'
            };
            shipmentService.isPackage.and.returnValue(true);
            sut.onEdit();
            deferred.resolve(response);
            $timeout.flush();
            expect(sut.dutiesPaymentType).toEqual(expectedResult);
        });

        it(`should set taxes option to default value
                if payment types do not have taxes type selected previously`, () => {
            const expectedResult = response.paymentOptions[1];
            response.defaults.taxes = expectedResult;
            sut.taxesPaymentType = {
                name: 'Nick name of DHL Shipper account',
                accountNumber: '33****55',
                key: '444',
                accountId: '1',
                shipper: true,
                paymentType: 'DHL_ACCOUNT'
            };
            shipmentService.isPackage.and.returnValue(true);
            sut.onEdit();
            deferred.resolve(response);
            $timeout.flush();
            expect(sut.taxesPaymentType).toEqual(expectedResult);
        });

        it('should get available incoterms for current country if incoterms dropdown is shown', () => {
            const shipmentCountry = 'UK';
            shipmentService.isShipmentWithInvoice.and.returnValue(true);
            shipmentService.getShipmentCountry.and.returnValue(shipmentCountry);
            sut.onEdit();
            expect(paymentTypeService.getIncoterms).toHaveBeenCalledWith(shipmentCountry);
        });

        it('should clear previously loaded incoterms options and show loading message in options', () => {
            shipmentService.isShipmentWithInvoice.and.returnValue(true);
            sut.onEdit();
            expect(sut.incoterms).toEqual([sut.LOADING_OPTION]);
        });

        it('should set incoterm default from response to defaultIncoterm and selected incoterm', () => {
            const defaultIncotermCode = 'DAP';
            const incoterms = [{
                code: 'EXW'
            }, {
                code: 'DAP'
            }];
            const resultExpected = {code: 'DAP'};
            const def = $q.defer();
            shipmentService.isShipmentWithInvoice.and.returnValue(true);
            paymentTypeService.getIncoterms.and.returnValue(def.promise);
            sut.onEdit();
            deferred.resolve(response);
            def.resolve({incoterms, defaultIncotermCode});
            $timeout.flush();

            expect(sut.defaultIncoterm).toEqual(resultExpected);
            expect(sut.incoterm).toEqual(resultExpected);
        });

        it('should default incoterm according to duties and taxes selected value', () => {
            const resultExpected = {code: 'DAP'};
            const incoterms = [{
                code: 'CIP'
            }, {
                code: 'EXW'
            }, {
                code: 'CIP'
            }, {
                code: 'DAP'
            }];
            const def = $q.defer();
            shipmentService.isShipmentWithInvoice.and.returnValue(true);
            paymentTypeService.getIncoterms.and.returnValue(def.promise);
            paymentTypeService.getIncotermDefaultValueForDutiesAndTaxes.and.returnValue(resultExpected);
            sut.isDefaultIncotermSet = $q.defer();
            sut.onEdit();
            sut.isDefaultIncotermSet.resolve();
            deferred.resolve(response);
            def.resolve({incoterms});
            $timeout.flush();

            expect(sut.incoterm).toEqual(resultExpected);
        });

        it('should set incoterm to already selected value', () => {
            const resultExpected = {code: 'CIP'};
            const incoterms = [{
                code: 'CIP'
            }, {
                code: 'EXW'
            }, {
                code: 'CIP'
            }, {
                code: 'DAP'
            }];
            const def = $q.defer();
            shipmentService.isShipmentWithInvoice.and.returnValue(true);
            paymentTypeService.getIncoterms.and.returnValue(def.promise);
            sut.incoterm = resultExpected;
            sut.dutiesPaymentType = {
                paymentType: 'RECEIVER_WILL_PAY'
            };
            sut.onEdit();
            deferred.resolve(response);
            def.resolve({incoterms});
            $timeout.flush();

            expect(sut.incoterm).toEqual(resultExpected);
        });

        it(`should default incoterm according to defaultIncoterm
                if incoterms list does not have value previously selected`, () => {
            const defaultIncotermCode = 'DAP';
            const incoterms = [{
                code: 'EXW'
            }, {
                code: 'DAP'
            }];
            const resultExpected = {code: 'DAP'};
            const def = $q.defer();
            sut.incoterm = {code: 'CIP'};
            shipmentService.isShipmentWithInvoice.and.returnValue(true);
            paymentTypeService.getIncoterms.and.returnValue(def.promise);
            sut.onEdit();
            deferred.resolve(response);
            def.resolve({incoterms, defaultIncotermCode});
            $timeout.flush();

            expect(sut.defaultIncoterm).toEqual(resultExpected);
            expect(sut.incoterm).toEqual(resultExpected);
        });

        it(`should default incoterm according to duties selected value
                if incoterms list does not have value previously selected`, () => {
            const resultExpected = {code: 'DAP'};
            const incoterms = [{
                code: 'EXW'
            }, {
                code: 'DAP'
            }];
            const def = $q.defer();
            shipmentService.isShipmentWithInvoice.and.returnValue(true);
            paymentTypeService.getIncotermDefaultValueForDutiesAndTaxes.and.returnValue(resultExpected);
            paymentTypeService.getIncoterms.and.returnValue(def.promise);
            sut.incoterm = {code: 'CIP'};
            sut.isDefaultIncotermSet = $q.defer();
            sut.onEdit();
            deferred.resolve(response);
            def.resolve({incoterms});
            sut.isDefaultIncotermSet.resolve();
            $timeout.flush();

            expect(sut.incoterm).toEqual(resultExpected);
        });

        it('calls ruleService passing formName and shipper country to it', () => {
            const shipperCountry = 'UA';
            const formName = 'paymentType';

            shipmentService.getShipmentCountry.and.returnValue(shipperCountry);

            sut.formName = formName;

            sut.onEdit();

            expect(ruleService.acquireRulesForFormFields).toHaveBeenCalledWith(formName, shipperCountry);
        });

        it('sets isPaymentSplitterShown property according to processed rules', () => {
            const visible = true;
            const rules = {
                splitDutyAndTaxPayment: {
                    props: {visible}
                }
            };

            sut.onEdit();

            rulesDeferred.resolve(rules);
            $timeout.flush();

            expect(sut.isPaymentSplitterShown).toBe(visible);
        });

        it('should clear paymentTypesErrors', () => {
            sut.paymentTypesErrors = {
                CASH: 'error'
            };
            sut.onEdit();

            expect(sut.paymentTypesErrors).toEqual({});
        });

        it('should validate not empty alternate dhl account', () => {
            sut.alternateDhlAccount = {
                accountNumber: 1111
            };
            const type = {
                paymentType: 'ALTERNATE_DHLACCOUNT',
                accountNumber: sut.alternateDhlAccount.accountNumber
            };
            sut.onEdit();
            expect(paymentTypeService.validatePaymentAccount).toHaveBeenCalledWith(jasmine.objectContaining(type), '');
        });

        it('should validate not empty duties and taxes alternate dhl accounts when they are shown', () => {
            sut.dutiesAlternateDhlAccount = {
                accountNumber: 1111
            };
            sut.taxesAlternateDhlAccount = {
                accountNumber: 222
            };
            const type = {
                paymentType: 'ALTERNATE_DHLACCOUNT',
                accountNumber: sut.dutiesAlternateDhlAccount.accountNumber
            };
            const taxes = {
                paymentType: 'ALTERNATE_DHLACCOUNT',
                accountNumber: sut.taxesAlternateDhlAccount.accountNumber
            };
            shipmentService.isPackage.and.returnValue(true);
            sut.onEdit();
            expect(paymentTypeService.validatePaymentAccount).toHaveBeenCalledWith(jasmine.objectContaining(type), '');
            expect(paymentTypeService.validatePaymentAccount).toHaveBeenCalledWith(jasmine.objectContaining(taxes), '');
        });
    });

    describe('#onQuotationTypeSelectorChanged', () => {
        it('should call validatePaymentAccount service method to validate quotation type', () => {
            sut.quotationType = {
                name: 'Some name',
                paymentType: 'DHL_ACCOUNT',
                title: '23**35 account'
            };
            sut.onQuotationTypeSelectorChanged();
            expect(paymentTypeService.validatePaymentAccount).toHaveBeenCalledWith(sut.quotationType, sut.shipmentType);
        });

        it('should log error in case if validation failed', () => {
            sut.quotationType = {
                number: '2332535',
                paymentType: 'DHL_ACCOUNT',
                title: '23**35 account'
            };
            const error = 'Payment account invalid';
            sut.onQuotationTypeSelectorChanged();

            deferred.reject(error);
            $timeout.flush();

            expect(sut.paymentTypesErrors[sut.quotationType.title]).toEqual(error);
        });

        it('should clear errors on validation success', () => {
            sut.quotationType = {
                number: '2332535',
                paymentType: 'DHL_ACCOUNT',
                title: '23**35 account'
            };
            sut.paymentTypesErrors[sut.quotationType.title] = 'error';
            sut.onQuotationTypeSelectorChanged();

            deferred.resolve();
            $timeout.flush();

            expect(sut.paymentTypesErrors[sut.quotationType.title]).toBe(false);
        });
    });

    describe('#onTransportationPaymentTypeSelectorChanged', () => {
        it('should call validatePaymentAccount service method to validate transportation payment type', () => {
            sut.transportationPaymentType = {
                name: 'Some name',
                paymentType: 'DHL_ACCOUNT',
                title: '23**35 account'
            };
            sut.onTransportationPaymentTypeSelectorChanged();
            expect(paymentTypeService.validatePaymentAccount)
                .toHaveBeenCalledWith(sut.transportationPaymentType, sut.shipmentType);
        });

        it('should log error in case if validation failed', () => {
            sut.transportationPaymentType = {
                number: '2332535',
                paymentType: 'DHL_ACCOUNT',
                title: '23**35 account'
            };
            const error = 'Payment account invalid';
            sut.onTransportationPaymentTypeSelectorChanged();

            deferred.reject(error);
            $timeout.flush();

            expect(sut.paymentTypesErrors[sut.transportationPaymentType.title]).toEqual(error);
        });

        it('should clear errors on validation success', () => {
            sut.transportationPaymentType = {
                number: '2332535',
                paymentType: 'DHL_ACCOUNT',
                title: '23**35 account'
            };
            sut.paymentTypesErrors[sut.transportationPaymentType.title] = 'error';
            sut.onTransportationPaymentTypeSelectorChanged();

            deferred.resolve();
            $timeout.flush();

            expect(sut.paymentTypesErrors[sut.transportationPaymentType.title]).toBe(false);
        });

        it('should clear selection if selected option is loading', () => {
            sut.transportationPaymentType = sut.LOADING_OPTION;
            sut.onTransportationPaymentTypeSelectorChanged();
            expect(sut.transportationPaymentType).toBe('');
        });

        it('should not call validatePaymentAccount service method if field is undefined', () => {
            sut.transportationPaymentType = {
                name: 'Some name',
                paymentType: 'DHL_ACCOUNT',
                title: '23**35 account'
            };
            sut.paymentTypeForm.transportationPaymentType = undefined;
            sut.onTransportationPaymentTypeSelectorChanged();
            expect(paymentTypeService.validatePaymentAccount).not.toHaveBeenCalled();
        });
    });

    describe('#onDutiesPaymentTypeSelectorChanged', () => {
        const seViewValue = function() {};

        beforeEach(() => {
            sut.paymentTypeForm.dutiesPaymentType = {
                $dirty: false,
                $viewValue: '',
                $setViewValue: seViewValue
            };
        });

        it('should call validatePaymentAccount service method to validate duties payment type', () => {
            sut.dutiesPaymentType = {
                name: 'Some name',
                paymentType: 'DHL_ACCOUNT',
                title: '23**35 account'
            };
            sut.onDutiesPaymentTypeSelectorChanged();
            expect(paymentTypeService.validatePaymentAccount)
                .toHaveBeenCalledWith(sut.dutiesPaymentType, sut.shipmentType);
        });

        it('should clear selection if selected option is loading', () => {
            sut.dutiesPaymentType = sut.LOADING_OPTION;
            sut.onDutiesPaymentTypeSelectorChanged();
            expect(sut.dutiesPaymentType).toBe('');
        });

        it('should log error in case if validation failed', () => {
            sut.dutiesPaymentType = {
                number: '2332535',
                paymentType: 'DHL_ACCOUNT',
                title: '23**35 account'
            };
            const error = 'Payment account invalid';
            sut.onDutiesPaymentTypeSelectorChanged();

            deferred.reject(error);
            $timeout.flush();

            expect(sut.paymentTypesErrors[sut.dutiesPaymentType.title]).toEqual(error);
        });

        it('should clear errors on validation success', () => {
            sut.dutiesPaymentType = {
                number: '2332535',
                paymentType: 'DHL_ACCOUNT',
                title: '23**35 account'
            };
            sut.paymentTypesErrors[sut.dutiesPaymentType.title] = 'error';
            sut.onDutiesPaymentTypeSelectorChanged();

            deferred.resolve();
            $timeout.flush();

            expect(sut.paymentTypesErrors[sut.dutiesPaymentType.title]).toBe(false);
        });

        it('should not call validatePaymentAccount service method if field is undefined', () => {
            sut.dutiesPaymentType = {
                number: '2332535',
                paymentType: 'DHL_ACCOUNT',
                title: '23**35 account'
            };
            sut.paymentTypeForm.dutiesPaymentType = undefined;
            sut.onDutiesPaymentTypeSelectorChanged();
            expect(paymentTypeService.validatePaymentAccount).not.toHaveBeenCalled();
        });

        it('should set incoterm to default value if it is shown', () => {
            const defaultValue = {code: 'DAP'};
            sut.incoterms = [
                {
                    code: 'DTP'
                }, {
                    code: 'DAP'
                }
            ];
            shipmentService.isShipmentWithInvoice.and.returnValue(true);
            paymentTypeService.getIncotermDefaultValueForDutiesAndTaxes.and.returnValue(defaultValue);
            sut.onDutiesPaymentTypeSelectorChanged();
            expect(sut.incoterm).toEqual(sut.incoterms[1]);
        });
    });

    describe('#onNextClick', () => {
        let processNextClick;

        beforeAll(() => {
            processNextClick = function(options) {
                sut.pendingPaymentTypes = false;
                sut.showOthers = true;

                sut.nextStepDeferred = $q.defer();

                sut.onNextClick(options);

                sut.nextStepDeferred.resolve();

                $timeout.flush();
            };
        });

        beforeEach(() => {
            sut.quotationType = {
                accountId: '4321',
                paymentType: 'DHL_ACCOUNT'
            };
            sut.transportationPaymentType = {
                paymentType: 'ALTERNATE_DHLACCOUNT'
            };
            sut.alternateDhlAccount = {
                accountNumber: '1111'
            };
            sut.dutiesAlternateDhlAccount = {
                accountNumber: '2222'
            };
            sut.taxesAlternateDhlAccount = {
                accountNumber: '1234'
            };
            sut.dutiesPaymentType = {
                paymentType: 'ALTERNATE_DHLACCOUNT'
            };
            sut.taxesPaymentType = {
                paymentType: 'ALTERNATE_DHLACCOUNT'
            };
            sut.splitDutyAndTaxPayment = false;

            sut.paymentAccounts = {
                duties: [{
                    name: 'nls-key',
                    paymentType: 'RECEIVER_WILL_PAY'
                }, {
                    name: 'nls-key',
                    paymentType: 'ALTERNATE_DHLACCOUNT'
                }],
                shippers: [{
                    accountId: '654987',
                    shipper: true,
                    paymentType: 'DHL_ACCOUNT'
                }, {
                    accountId: '102371',
                    shipper: true,
                    paymentType: 'DHL_ACCOUNT'
                }]
            };

            sut.dutiesDefaultOption = {
                paymentType: 'RECEIVER_WILL_PAY'
            };
        });

        it('should call next click callback', () => {
            let nextCallback = jasmine.createSpy('nextCallback');

            sut.setNextCallback(nextCallback);

            processNextClick({$valid: true});

            expect(nextCallback).toHaveBeenCalled();
        });

        it('should not call next click callback if there form is not valid', () => {
            let nextCallback = jasmine.createSpy('nextCallback');

            sut.setNextCallback(nextCallback);

            processNextClick({$valid: false});

            expect(nextCallback).not.toHaveBeenCalled();
        });

        it('should set payment data to shipment service', () => {
            const expectedData = {
                transportationPaymentType: 'ALTERNATE_DHLACCOUNT',
                transportationPaymentAccountNumber: '1111',
                dutiesPaymentType: 'ALTERNATE_DHLACCOUNT',
                dutiesPaymentAccountNumber: '2222',
                quotationType: 'DHL_ACCOUNT',
                quotationAccountNumber: '4321',
                splitDutyAndTaxPayment: true,
                taxesPaymentType: 'ALTERNATE_DHLACCOUNT',
                taxesPaymentAccountNumber: '1234'
            };

            sut.splitDutyAndTaxPayment = true;

            processNextClick({$valid: true});

            expect(shipmentService.setPaymentInfo).toHaveBeenCalledWith(expectedData);
        });

        it('should omit setting taxes data if splitDutyAndTaxPayment is falsy', () => {
            const expectedData = {
                transportationPaymentType: 'ALTERNATE_DHLACCOUNT',
                transportationPaymentAccountNumber: '1111',
                dutiesPaymentType: 'ALTERNATE_DHLACCOUNT',
                dutiesPaymentAccountNumber: '2222',
                quotationType: 'DHL_ACCOUNT',
                quotationAccountNumber: '4321',
                splitDutyAndTaxPayment: false,
                taxesPaymentType: null,
                taxesPaymentAccountNumber: null
            };

            processNextClick({$valid: true});

            expect(shipmentService.setPaymentInfo).toHaveBeenCalledWith(expectedData);
        });

        it('should reset alternate dhl account to empty value for taxes if splitDutyAndTaxPayment is false', () => {
            const value = '';
            sut.taxesAlternateDhlAccount.accountNumber = 'someValue';
            sut.splitDutyAndTaxPayment = false;
            processNextClick({$valid: true});
            expect(sut.taxesAlternateDhlAccount.accountNumber).toBe(value);
        });

        it(`should reset alternate dhl account to empty value for duties
                if alternate dhl account is not selected for duties`, () => {
            const value = '';
            sut.dutiesAlternateDhlAccount.accountNumber = 'someValue';
            sut.dutiesPaymentType = {
                paymentType: 'RECEIVER_WILL_PAY'
            };
            sut.splitDutyAndTaxPayment = true;
            processNextClick({$valid: true});
            expect(sut.dutiesAlternateDhlAccount.accountNumber).toBe(value);
        });

        it(`should reset alternate dhl account to empty value for taxes
                if alternate dhl account is not selected for duties`, () => {
            const value = '';
            sut.taxesAlternateDhlAccount.accountNumber = 'someValue';
            sut.taxesPaymentType = {
                paymentType: 'RECEIVER_WILL_PAY'
            };
            sut.splitDutyAndTaxPayment = true;
            processNextClick({$valid: true});
            expect(sut.taxesAlternateDhlAccount.accountNumber).toBe(value);
        });

        it('should reset taxesPaymentType to default if splitDutyAndTaxPayment is false', () => {
            const resultExpected = {paymentType: 'ALTERNATE_DHLACCOUNT'};
            sut.taxesDefaultOption = resultExpected;
            paymentTypeService.getAssociatedOption.and.returnValue(resultExpected);
            sut.splitDutyAndTaxPayment = false;
            processNextClick({$valid: true});
            expect(sut.taxesPaymentType.paymentType).toBe(sut.taxesDefaultOption.paymentType);
        });

        it('should not reset taxesPaymentType to default  if splitDutyAndTaxPayment is true', () => {
            const paymentType = {
                paymentType: 'DHL_ACCOUNT',
                accountId: '12'
            };
            sut.taxesPaymentType = paymentType;
            sut.splitDutyAndTaxPayment = true;
            processNextClick({$valid: true});
            expect(sut.taxesPaymentType).toEqual(paymentType);
        });

        it('should clear all payment types if pendingPaymentTypes is true', () => {
            const resultExpected = '';
            const value = 'someValue';

            sut.pendingPaymentTypes = true;
            sut.quotationType = value;
            sut.transportationPaymentType = value;
            sut.dutiesPaymentType = value;
            sut.taxesPaymentType = value;

            sut.onNextClick({});

            expect(sut.quotationType).toBe(resultExpected);
            expect(sut.transportationPaymentType).toBe(resultExpected);
            expect(sut.dutiesPaymentType).toBe(resultExpected);
            expect(sut.taxesPaymentType).toBe(resultExpected);
        });

        it('should not clear incoterm selection', () => {
            const value = 'someValue';
            sut.pendingPaymentTypes = false;
            sut.incoterm = value;
            sut.onNextClick();
            expect(sut.incoterm).toBe(value);
        });

        it('should not clear all payment types if pendingPaymentTypes is false', () => {
            const value = 'someValue';

            sut.pendingPaymentTypes = false;
            sut.quotationType = value;
            sut.transportationPaymentType = value;
            sut.dutiesPaymentType = value;
            sut.taxesPaymentType = value;

            sut.onNextClick();

            expect(sut.quotationType).toBe(value);
            expect(sut.transportationPaymentType).toBe(value);
            expect(sut.dutiesPaymentType).toBe(value);
            expect(sut.taxesPaymentType).toBe(value);
        });

        it('should set incoterm to shipment service is incoterms are shown', () => {
            const expectedData = 'CIP';
            sut.incoterm = {code: 'CIP'};
            shipmentService.isShipmentWithInvoice.and.returnValue(true);

            processNextClick({$valid: true});

            expect(shipmentService.setIncoterm).toHaveBeenCalledWith(expectedData);
        });

        it('should set quotation payment type by transportation type if there are no option to select quotation type',
            () => {
                sut.paymentAccounts.shippers = [];
                processNextClick({$valid: true});
                expect(sut.quotationType).toEqual(sut.transportationPaymentType);
            });
    });

    describe('#validateAlternateDhlAccount', () => {
        const field = {
            $viewValue: '',
            $setViewValue: () => {}
        };

        beforeEach(() => {
            sut.transportationPaymentType = {
                paymentType: 'some type'
            };
            sut.alternateDhlAccount.accountNumber = '111';
            sut.showOthers = false;
        });

        it('should set alternate dhl account as valid after validation success', () => {
            sut.validateAlternateDhlAccount(sut.alternateDhlAccount, field);
            deferred.resolve();
            $timeout.flush();

            expect(sut.alternateDhlAccount.valid).toBe(true);
        });

        it(`should set alternate dhl account as invalid
                and add message to message attribute after validation fail`, () => {
            const error = 'The account in invalid';
            sut.validateAlternateDhlAccount(sut.alternateDhlAccount, field);
            deferred.reject(error);
            $timeout.flush();

            expect(sut.alternateDhlAccount.valid).toBe(false);
            expect(sut.alternateDhlAccount.message).toBe(error);
        });

        it(`should call validatePaymentAccount service method with alternate dhl account type
                and corresponding account number`, () => {
            const typeExpected = {
                paymentType: 'ALTERNATE_DHLACCOUNT',
                accountNumber: '111'
            };
            sut.alternateDhlAccount.accountNumber = '111';
            sut.validateAlternateDhlAccount(sut.alternateDhlAccount, field);
            expect(paymentTypeService.validatePaymentAccount).toHaveBeenCalledWith(typeExpected, sut.shipmentType);
        });

        it('should not call validatePaymentAccount service method to validate empty account', () => {
            sut.alternateDhlAccount.accountNumber = '';
            sut.validateAlternateDhlAccount(sut.alternateDhlAccount, field);
            expect(paymentTypeService.validatePaymentAccount).not.toHaveBeenCalled();
        });
    });

    describe('#clearError', () => {
        it('should clear error if other item choosen', () => {
            sut.clearError();
            expect(sut.paymentTypesErrors).toEqual({});
        });
    });

    describe('#howPayCheckboxChanged', () => {
        it('should show other payment options if transportation charges is unchecked', () => {
            sut.showOthers = false;
            sut.checkedForTransportationCharges = false;

            sut.howPayCheckboxChanged();

            expect(sut.showOthers).toEqual(true);
        });
    });

    describe('#onAssociationCheckboxChanged', () => {
        it('should set selected associateWithContactId to shipment service', () => {
            const idExpected = '11';
            sut.checkedForPaymentAssociation = true;
            sut.associatedContact = {
                id: '11',
                name: ''
            };
            sut.onAssociationCheckboxChanged();
            expect(shipmentService.setAssociateWithContactId).toHaveBeenCalledWith(idExpected);
        });
    });

    describe('#isDutiesAndTaxesShown', () => {
        it('should return true if shipment type is package', () => {
            shipmentService.isPackage.and.returnValue(true);
            const result = sut.isDutiesAndTaxesShown();
            expect(result).toBe(true);
        });
    });

    describe('#resolvePaymentTypeName', () => {
        it('should return name and account number for DHL account', () => {
            const option = {
                paymentType: 'DHL_ACCOUNT',
                accountNumber: '22****44',
                name: 'name'
            };
            const resultExpected = 'name 22****44';
            const result = sut.resolvePaymentTypeName(option, true);
            expect(result).toBe(resultExpected);
        });

        it('should return only account number for DHL account without name', () => {
            const option = {
                paymentType: 'DHL_ACCOUNT',
                accountNumber: '22****44'
            };
            const resultExpected = '22****44';
            const result = sut.resolvePaymentTypeName(option, true);
            expect(result).toBe(resultExpected);
        });

        it('should mark corresponding option as default one', () => {
            const option = {
                paymentType: 'DHL_ACCOUNT',
                accountNumber: '22****44',
                name: 'name'
            };
            const resultExpected = 'name 22****44 (default)';
            sut.dutiesDefaultOption = option;
            const result = sut.resolvePaymentTypeName(option, true);
            expect(result).toBe(resultExpected);
        });
    });

    describe('#isPaymentTypeAlternateAccountShown', () => {
        it('returns true if alternate dhl account was selected', () => {
            sut.taxesPaymentType = {
                paymentType: 'ALTERNATE_DHLACCOUNT'
            };

            expect(sut.isPaymentTypeAlternateAccountShown('taxes')).toBe(true);
        });

        it('returns false if either non-alternate or no account was selected', () => {
            sut.dutiesPaymentType = {
                paymentType: 'DHL_ACCOUNT',
                accountId: '2222'
            };

            expect(sut.isPaymentTypeAlternateAccountShown('duties')).toBe(false);

            sut.dutiesPaymentType = null;

            expect(sut.isPaymentTypeAlternateAccountShown('duties')).toBe(false);
        });
    });

    describe('#getDutiesAndTaxesLabel', () => {
        it('should return duties-and-taxes nls key if payment is splitted', () => {
            sut.splitDutyAndTaxPayment = true;

            expect(sut.getDutiesAndTaxesLabel()).toBe('shipment.payment_type_duties_title');
        });

        it('should return duties-only nls key if payment is not splitted', () => {
            sut.splitDutyAndTaxPayment = false;

            expect(sut.getDutiesAndTaxesLabel()).toBe('shipment.payment_type_duties_and_taxes_title');
        });
    });

    describe('#isIncotermShown', () => {
        it('should return true if shipment is with invoice', () => {
            shipmentService.isShipmentWithInvoice.and.returnValue(true);
            const result = sut.isIncotermShown();
            expect(result).toBe(true);
        });
    });

    describe('#resolveIncotermName', () => {
        it('should add to three letters name full description', () => {
            const option = {
                code: 'CIP'
            };
            const resultExpected = 'shipment.payment_type_incoterm_cip';
            sut.resolveIncotermName(option);
            expect(nlsService.getTranslationSync).toHaveBeenCalledWith(resultExpected);
        });
    });

    describe('#isCreditCardPayment', () => {
        it('returns falsy if transportationPaymentType is not defined', () => {
            sut.transportationPaymentType = undefined;
            expect(sut.isCreditCardPayment()).toBeFalsy();
        });

        it('calls paymentTypeService passing transportationPaymentType to it', () => {
            const payment = {paymentType: 'CREDIT_CARD'};
            const isCreditType = true;
            sut.transportationPaymentType = payment;
            paymentTypeService.isCreditCardPayment.and.returnValue(isCreditType);

            const result = sut.isCreditCardPayment();

            expect(paymentTypeService.isCreditCardPayment).toHaveBeenCalledWith(payment);
            expect(result).toBe(isCreditType);
        });
    });

    describe('#getCurrentIncompleteData', () => {
        beforeEach(() => {
            sut.init();
            sut.showOthers = true;
        });

        it('should get current payment data without validation', () => {
            sut.getCurrentIncompleteData();

            expect(shipmentService.setPaymentInfo).toHaveBeenCalled();
        });

        it('should get current incoterm data without validation', () => {
            shipmentService.isShipmentWithInvoice.and.returnValue(true);
            sut.getCurrentIncompleteData();

            expect(shipmentService.setIncoterm).toHaveBeenCalled();
        });
    });

    describe('#loadShipmentData', () => {
        const shipmentData = {
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
        const paymentTypeData = {
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

        beforeEach(() => {
            shipmentService.getPaymentTypeModelData.and.returnValue(paymentTypeData);
            sut.loadShipmentData(shipmentData);
        });

        it('should populate controller with shipment data', () => {
            expect(shipmentService.getPaymentTypeModelData).toHaveBeenCalledWith(shipmentData);
            expect(sut).toEqual(jasmine.objectContaining(paymentTypeData));
        });
    });

    describe('#isQuotationTypeShown', () => {
        it('should return true if there are more than 1 shipper account', () => {
            sut.paymentAccounts = {
                shippers: [{
                    accountId: '654987',
                    shipper: true,
                    paymentType: 'DHL_ACCOUNT'
                }, {
                    accountId: '102371',
                    shipper: true,
                    paymentType: 'DHL_ACCOUNT'
                }]
            };
            expect(sut.isQuotationTypeShown()).toBe(true);
        });

        it('should return false if there only 1 shipper account', () => {
            sut.paymentAccounts = {
                shippers: [{
                    accountId: '654987',
                    shipper: true,
                    paymentType: 'DHL_ACCOUNT'
                }]
            };
            expect(sut.isQuotationTypeShown()).toBe(false);
        });
    });
});
