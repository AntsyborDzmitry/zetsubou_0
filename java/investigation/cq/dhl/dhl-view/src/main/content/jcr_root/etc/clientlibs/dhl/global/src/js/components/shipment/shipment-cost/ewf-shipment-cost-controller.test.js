import EwfShipmentCostController from './ewf-shipment-cost-controller';
import EwfShipmentStepBaseController from './../ewf-shipment-step-base-controller';
import ShipmentProductPresenterFactory from './../shipment-products/shipment-product-presenter-factory';
import ShipmentService from './../ewf-shipment-service';
import ShipmentProductsService from './../shipment-products/shipment-products-service';
import NavigationService from './../../../services/navigation-service';
import NlsService from './../../../services/nls-service';
import PromoCodeService from './promo-code-service';
import RuleService from 'services/rule-service';
import PaymentTypeService from './../payment-type/payment-type-service';

import 'angularMocks';

describe('EwfShipmentCostController', () => {
    let sut;
    let $q;
    let $timeout;
    let $scope;
    let $filter;
    let $sce;
    let nlsService;
    let ruleService;
    let navigationService;
    let paymentTypeService;
    let shipmentService;
    let shipmentProductsService;
    let shipmentProductPresenterFactory;
    let promoCodeService;

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_, _$filter_, _$sce_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $scope = _$rootScope_.$new();
        $filter = _$filter_;
        $sce = _$sce_;

        nlsService = jasmine.mockComponent(new NlsService());
        ruleService = jasmine.mockComponent(new RuleService());
        navigationService = jasmine.mockComponent(new NavigationService());
        shipmentService = jasmine.mockComponent(new ShipmentService());
        shipmentProductsService = jasmine.mockComponent(new ShipmentProductsService());
        shipmentProductPresenterFactory = jasmine.mockComponent(new ShipmentProductPresenterFactory());
        promoCodeService = jasmine.mockComponent(new PromoCodeService());
        paymentTypeService = jasmine.mockComponent(new PaymentTypeService());

        nlsService.getTranslationSync.and.returnValue('asd');

        sut = new EwfShipmentCostController($scope, $filter, $q, $sce,
            nlsService,
            ruleService,
            navigationService,
            shipmentService,
            shipmentProductsService,
            shipmentProductPresenterFactory,
            promoCodeService,
            paymentTypeService);
    }));

    describe('#constructor', () => {
        it('should be instance of EwfShipmentStepBaseController', () => {
            expect(sut instanceof EwfShipmentStepBaseController).toBe(true);
        });
    });

    describe('#init', () => {
        let storedProduct;
        let productPresenter;
        let rules;
        let defer;

        beforeEach(() => {
            storedProduct = jasmine.any(Object);
            shipmentService.getShipmentProduct.and.returnValue(storedProduct);
            shipmentProductsService.getProductsByDate.and.returnValue($q.when([storedProduct]));
            shipmentService.getPaymentInfo.and.returnValue({});

            productPresenter = jasmine.any(Object);
            shipmentProductPresenterFactory.createProductPresenter.and.returnValue(productPresenter);
            paymentTypeService.getPaymentProducts.and.returnValue($q.when({}));
            paymentTypeService.getCreditBuffer.and.returnValue($q.when({}));

            defer = $q.defer();
            promoCodeService.getSavedRewardCardNumber.and.returnValue(defer.promise);

            rules = {
                upgradeNow: {
                    props: {
                        visible: true
                    }
                },
                promoCode: {
                    props: {
                        visible: true
                    }
                },
                rewardCard: {
                    props: {
                        visible: true
                    }
                }
            };
            ruleService.acquireRulesForFormFields.and.returnValue($q.when(rules));
        });

        it('should set initialized flag to true', () => {
            sut.init();
            expect(sut.initialized).toBe(true);
        });

        it('should count user time zone', () => {
            sut.init();
            expect(sut.userTimeZoneOffset).toBe(-(new Date().getTimezoneOffset() * 60 * 1000));
        });

        it('should get stored product from shipment service', () => {
            sut.init();
            $scope.$apply();

            expect(sut.productOrigin).toBe(storedProduct);
        });

        it('should apply product presenter to selected origin product', () => {
            sut.init();
            sut.userTimeZoneOffset = 3600000 * 3;
            $scope.$apply();

            expect(shipmentProductPresenterFactory.createProductPresenter)
                .toHaveBeenCalledWith(storedProduct, '+03:00');
            expect(sut.product).toBe(productPresenter);
        });

        it('should call updateUpgradeMessageState', () => {
            spyOn(sut, 'updateUpgradeMessageState');

            sut.init();
            $scope.$apply();

            expect(sut.updateUpgradeMessageState).toHaveBeenCalled();
        });

        it('fetches ruleService for rules', () => {
            const formName = 'shipmentCost';
            sut.formName = formName;

            const shipperCountry = 'UA';
            sut.shipperCountry = shipperCountry;
            shipmentService.getShipmentCountry.and.returnValue(shipperCountry);

            sut.init();
            $scope.$apply();

            expect(ruleService.acquireRulesForFormFields).toHaveBeenCalledWith(formName, shipperCountry);
        });

        it('updates upgradeMessage when rules are fetched', () => {
            spyOn(sut, 'updateUpgradeMessageState');

            sut.init();
            $scope.$apply();

            expect(sut.upgradeAllowedForShipperCountry).toBe(rules.upgradeNow.props.visible);

            expect(sut.updateUpgradeMessageState).toHaveBeenCalled();
        });

        it('updates promoCodeAvailable and rewardCardAvailable when rules are fetched', () => {
            sut.promoCodeAvailable = false;
            sut.rewardCardAvailable = false;

            const promoCodeVisible = true;
            const rewardCardVisible = true;
            rules.promoCode.props.visible = promoCodeVisible;
            rules.rewardCard.props.visible = rewardCardVisible;

            ruleService.acquireRulesForFormFields.and.returnValue($q.when(rules));

            sut.init();
            $scope.$apply();

            expect(sut.promoCodeAvailable).toBe(promoCodeVisible);
            expect(sut.rewardCardAvailable).toBe(rewardCardVisible);
        });

        it('loads payment products and buffer if it is credit card payment', () => {
            spyOn(sut, 'isCreditCardPayment');
            sut.isCreditCardPayment.and.returnValue(true);
            const countryId = 'GB';
            shipmentService.getShipmentCountry.and.returnValue(countryId);

            sut.init();
            $scope.$apply();

            expect(paymentTypeService.getCreditBuffer).toHaveBeenCalledWith(countryId);
            expect(paymentTypeService.getPaymentProducts).toHaveBeenCalledWith(countryId);
        });

        it('won\'t load payment products if it is not a credit card payment', () => {
            spyOn(sut, 'isCreditCardPayment');
            sut.isCreditCardPayment.and.returnValue(false);

            sut.init();
            $scope.$apply();

            expect(paymentTypeService.getPaymentProducts).not.toHaveBeenCalled();
        });

        it('shows payment products and buffer', () => {
            spyOn(sut, 'isCreditCardPayment');
            sut.isCreditCardPayment.and.returnValue(true);
            const paymentProducts = [
                {label: 'visa'},
                {label: 'american express'},
                {label: 'paypal'}
            ];
            paymentTypeService.getPaymentProducts.and.returnValue($q.when(paymentProducts));

            const buffer = 20;
            paymentTypeService.getCreditBuffer.and.returnValue($q.when(buffer));

            sut.init();
            $scope.$apply();

            expect(sut.paymentProducts).toEqual(paymentProducts);
            expect(sut.creditBuffer).toEqual(buffer);
        });

        it('saves payment product to shipment data', () => {
            const paymentProductId = '1';
            sut.paymentProduct = {paymentProductId};

            sut.init();
            $scope.$apply();

            expect(sut.billingAddress.paymentProduct).toEqual(paymentProductId);
            expect(shipmentService.setPaymentProductInfo).toHaveBeenCalledWith(paymentProductId);
        });

        it('should pre-select reward card number by user profile default values if reward card is visible', () => {
            const number = '51234567897';
            sut.init();
            defer.resolve(number);
            $scope.$apply();
            $timeout.flush();

            expect(sut.rewardCard.rewardCard).toBe(number);
        });
    });

    describe('#updateUpgradeMessageState', () => {
        const price = 15.50;
        const fastestPrice = 40;
        const product = {
            summary: {
                payment: {
                    total: {
                        value: price,
                        currency: 'USD'
                    }
                }
            }
        };

        const faster = {
            summary: {
                payment: {
                    total: {
                        value: fastestPrice
                    }
                }
            }
        };

        const date = 'some_date';

        beforeEach(() => {
            nlsService.getTranslationSync.and.returnValue('asdf{price}');
            shipmentService.getShipmentDate.and.returnValue(date);

            sut.isUpgradeMessageVisible = false;
            sut.upgradeMessage = null;
        });

        it('fetches product from shipmentService', () => {
            shipmentProductsService.getProductsByDate.and.returnValue($q.when([faster]));

            sut.updateUpgradeMessageState();
            $timeout.flush();

            expect(shipmentService.getShipmentProduct).toHaveBeenCalled();
        });

        it('should call shipmentProductsService.getShipmentDate', () => {
            shipmentProductsService.getProductsByDate.and.returnValue($q.when([faster]));

            sut.updateUpgradeMessageState();
            $timeout.flush();

            expect(shipmentProductsService.getProductsByDate).toHaveBeenCalledWith(date);
        });

        it('should set isUpgradeMessageVisible to true\
            and set upgradeMessage if stored product and fastest product does NOT equal\
            and set productToUpgradeTo to fastest product', () => {
            let fasterLocal = angular.copy(faster);
            shipmentProductsService.getProductsByDate.and.returnValue($q.when([fasterLocal]));

            shipmentService.getShipmentProduct.and.returnValue(product);
            sut.upgradeAllowedForShipperCountry = true;

            sut.updateUpgradeMessageState();
            $timeout.flush();

            expect(sut.isUpgradeMessageVisible).toBe(true);
            expect(sut.upgradeMessage).toEqual(`asdf${$filter('currency')(fastestPrice - price, 'asdf{price}')}`);
            expect(sut.productToUpgradeTo).toBe(fasterLocal);
        });

        it(`should set isUpgradeMessageVisible to false
                and should not change upgradeMessage if stored product and fastest product EQUAL`, () => {
            shipmentProductsService.getProductsByDate.and.returnValue($q.when([angular.copy(product)]));

            sut.updateUpgradeMessageState();
            $timeout.flush();

            expect(sut.isUpgradeMessageVisible).toBe(false);
            expect(sut.upgradeMessage).toBe(null);
        });
    });

    describe('#upgradeProduct', () => {
        beforeEach(() => {
            sut.productToUpgradeTo = jasmine.any(Object);
        });

        it('should set fastest product to shipmentService', () => {
            sut.upgradeProduct();
            expect(shipmentService.setShipmentProduct).toHaveBeenCalledWith(sut.productToUpgradeTo);
        });
    });

    describe('#applyPromoCode', () => {
        const productWithDiscount = {
            summary: {
                payment: {
                    details: [],
                    totalDiscount: {
                        value: 15
                    }
                }
            }
        };
        const validationData = {
            accountNumber: 'testAccountNumber'
        };
        const paymentInfo = {
            quotationType: 'CRC',
            quotationAccountNumber: 'CREDUSA'
        };

        const productView = {
            costDetails: []
        };

        beforeEach(() => {
            sut.promoCode = 'dhlpromo';

            promoCodeService.validatePromoCode.and.returnValue($q.when(validationData));

            shipmentProductsService.clearProductsCache.and.returnValue(shipmentProductsService);
            shipmentProductsService.getProductWithDiscount.and.returnValue($q.when(productWithDiscount));
            shipmentProductsService.getProductsByDate.and.returnValue($q.when([{}]));

            shipmentService.getPaymentInfo.and.returnValue(paymentInfo);
            shipmentService.getShipmentCountry.and.returnValue('UA');
            shipmentService.getDestinationCountry.and.returnValue('US');

            shipmentProductPresenterFactory.createProductPresenter.and.returnValue(productView);
        });

        it('should not validate empty promo code on server', () => {
            sut.promoCodeValid = true;
            sut.promoCode = '';

            sut.applyPromoCode();

            expect(sut.promoCodeValid).toBe(false);
            expect(promoCodeService.validatePromoCode).not.toHaveBeenCalled();
        });

        it('should validate non-empty promo code on server', () => {
            sut.applyPromoCode();
            $timeout.flush();

            expect(promoCodeService.validatePromoCode).toHaveBeenCalled();
            expect(sut.promoCodeValid).toBe(true);
        });

        it('should validate promo code for selected payment type and countries information', () => {
            sut.applyPromoCode();
            $timeout.flush();

            expect(promoCodeService.validatePromoCode).toHaveBeenCalledWith(sut.promoCode,
                                                                            paymentInfo.quotationAccountNumber,
                                                                            paymentInfo.quotationType,
                                                                            'UA',
                                                                            'US');
        });

        it('should retrieve the new Estimated Tariff with discount from DCT', () => {
            const data = {
                accountNumber: 'testAccountNumber'
            };

            const productOrigin = {
                code: 'D',
                estimatedDelivery: '2015-09-21T23:59:00.000Z'
            };
            sut.productOrigin = productOrigin;

            const quotesRequestData = {};
            shipmentService.getQuotesRequestData.and.returnValue(quotesRequestData);

            const shipmentDate = +new Date();
            shipmentService.getShipmentDate.and.returnValue(shipmentDate);

            sut.applyPromoCode();
            $timeout.flush();

            expect(shipmentProductsService.clearProductsCache).toHaveBeenCalled();
            expect(shipmentProductsService.getProductWithDiscount)
                .toHaveBeenCalledWith(data.accountNumber, productOrigin, shipmentDate, quotesRequestData);
        });

        it('should replace selected product with discounted product', () => {
            sut.applyPromoCode();
            $timeout.flush();
            expect(sut.productOrigin).toBe(productWithDiscount);
        });

        it('should update re-render product details', () => {
            sut.applyPromoCode();
            $timeout.flush();

            expect(shipmentProductPresenterFactory.createProductPresenter).toHaveBeenCalled();
            expect(sut.product).toBe(productView);
        });

        it('sets promocode state as non-applied', () => {
            sut.promoCodeApplied = true;

            sut.applyPromoCode();

            expect(sut.promoCodeApplied).toBe(false);
        });

        it('completes apply process', () => {
            sut.promoCodeApplied = false;

            sut.applyPromoCode();
            $timeout.flush();

            expect(sut.promoCodeApplied).toBe(true);
        });

        it('sets promo code applied message', () => {
            sut.promoAppliedMessage = '';

            sut.applyPromoCode();
            $timeout.flush();

            expect(nlsService.getTranslationSync).toHaveBeenCalled();
            expect(sut.promoAppliedMessage.$$unwrapTrustedValue).toBeDefined();
        });

        it('should show 0 discount for product if promo code is applied and the discount is 0', () => {
            const data = {
                accountNumber: 'testAccountNumber'
            };

            const productOrigin = {
                code: 'D',
                estimatedDelivery: '2015-09-21T23:59:00.000Z'
            };

            productWithDiscount.summary.payment.totalDiscount = {};
            sut.productOrigin = productOrigin;

            const quotesRequestData = {};
            shipmentService.getQuotesRequestData.and.returnValue(quotesRequestData);

            const shipmentDate = +new Date();
            shipmentService.getShipmentDate.and.returnValue(shipmentDate);

            sut.applyPromoCode();
            $timeout.flush();

            expect(shipmentProductsService.clearProductsCache).toHaveBeenCalled();
            expect(shipmentProductsService.getProductWithDiscount)
                .toHaveBeenCalledWith(data.accountNumber, productOrigin, shipmentDate, quotesRequestData);

            expect(sut.product.costDetails[sut.product.costDetails.length - 1].value).toBe('0.00');
        });
    });

    describe('#editPromoCode', () => {
        it('sets promoCodeApplied to false', () => {
            sut.promoCodeApplied = true;

            sut.editPromoCode();

            expect(sut.promoCodeApplied).toBe(false);
        });
    });

    describe('#applyRewardCard', () => {
        let defer;

        beforeEach(() => {
            defer = $q.defer();
            promoCodeService.validateRewardCard.and.returnValue(defer.promise);
        });

        it('should validate reward card', () => {
            sut.applyRewardCard();
            expect(promoCodeService.validateRewardCard).toHaveBeenCalledWith(sut.rewardCard);
        });

        it('should mark reward card as applied if valid', () => {
            sut.applyRewardCard();
            defer.resolve();
            $timeout.flush();
            expect(sut.rewardCardApplied).toBe(true);
        });

        it('should set rewardCardNumberInvalid and rewardCardNumberInvalid to false if reward card is valid', () => {
            sut.applyRewardCard();
            defer.resolve();
            $timeout.flush();
            expect(sut.rewardCardNumberInvalid).toBe(false);
            expect(sut.rewardCardPromoCodeInvalid).toBe(false);
        });

        it('should set rewardCardNumberInvalid to true if reward card number is invalid', () => {
            const data = ['rewardCard'];
            sut.applyRewardCard();
            defer.reject(data);
            $timeout.flush();
            expect(sut.rewardCardNumberInvalid).toBe(true);
        });

        it('should set rewardCardNumberInvalid to true if reward card number is invalid', () => {
            const data = ['promoCode'];
            sut.applyRewardCard();
            defer.reject(data);
            $timeout.flush();
            expect(sut.rewardCardPromoCodeInvalid).toBe(true);
        });

        it('sets reward card applied message', () => {
            sut.rewardAppliedMessage = '';

            sut.applyRewardCard();
            defer.resolve();
            $timeout.flush();

            expect(nlsService.getTranslationSync).toHaveBeenCalled();
            expect(sut.rewardAppliedMessage.$$unwrapTrustedValue).toBeDefined();
        });
    });

    describe('#editRewardCard', () => {
        it('should show edit form for reward card', () => {
            sut.rewardCardApplied = true;
            sut.editRewardCard();
            expect(sut.rewardCardApplied).toBe(false);
        });
    });

    describe('#completeShipment', () => {
        const shipmentId = 'some_shipment_id';
        const responseData = {shipmentId};

        beforeEach(() => {
            const billingAddressForm = jasmine.createSpyObj('form', ['validate', 'setErrorsFromResponse']);
            billingAddressForm.$valid = true;
            billingAddressForm.validate.and.returnValue(true);
            sut.billingAddressForm = billingAddressForm;

            spyOn(sut, 'isCreditCardPayment');
            shipmentService.saveShipment.and.returnValue($q.when(responseData));
            shipmentService.chargeShipment.and.returnValue($q.when(''));
        });

        it('should navigate to shipment print page it is not a credit card payment', () => {
            sut.isCreditCardPayment.and.returnValue(false);

            sut.completeShipment();
            $timeout.flush();

            expect(navigationService.location).toHaveBeenCalledWith(`shipment-print.html?shipmentId=${shipmentId}`);
        });

        it('should go to payment system page if credit card payment is happening', () => {
            sut.isCreditCardPayment.and.returnValue(true);

            const paymentSystemUrl = 'http://some.url';
            shipmentService.chargeShipment.and.returnValue($q.when(paymentSystemUrl));

            sut.completeShipment();
            $timeout.flush();

            expect(shipmentService.chargeShipment).toHaveBeenCalled();
            expect(navigationService.redirect).toHaveBeenCalledWith(paymentSystemUrl);
        });

        it('should set reward card info to shipment service if it was applied', () => {
            const data = {
                promotionCode: 'promotion code',
                rewardCode: 'reward_code',
                rewardCard: '9826300051234567897'
            };
            sut.rewardCardApplied = true;
            sut.rewardCard = {
                rewardCard: 51234567897,
                promoCode: 'promotion code'
            };
            sut.completeShipment();
            expect(shipmentService.setRewardCard).toHaveBeenCalledWith(data);
        });

        it('stores billing info to shipment dto for credit card payment', () => {
            sut.isCreditCardPayment.and.returnValue(true);
            const billingAddress = {
                addressDifferent: true,
                billingAddress: {
                    phone: {}
                }
            };
            sut.billingAddress = billingAddress;

            sut.completeShipment();

            expect(shipmentService.setCreditCardPaymentInfo).toHaveBeenCalledWith(billingAddress);
        });

        it('stores only payment product data if billing address is not custom', () => {
            const paymentProduct = '1';
            const addressDifferent = false;
            const billingAddress = {};
            const phoneNumber = '123123';
            sut.isCreditCardPayment.and.returnValue(true);
            Object.assign(sut.billingAddress, {paymentProduct, addressDifferent, phoneNumber, billingAddress});

            sut.completeShipment();

            expect(shipmentService.setCreditCardPaymentInfo).toHaveBeenCalledWith({addressDifferent, paymentProduct});
        });

        it('won\'t charge shipment if billing address form in invalid', () => {
            sut.isCreditCardPayment.and.returnValue(true);
            sut.billingAddressForm.$valid = false;
            sut.billingAddress.addressDifferent = true;

            sut.completeShipment();

            expect(shipmentService.chargeShipment).not.toHaveBeenCalled();
        });

        it('won\'t care about invalid billing address form if  is not custom', () => {
            sut.isCreditCardPayment.and.returnValue(true);
            sut.billingAddress.addressDifferent = false;
            sut.billingAddressForm.validate.and.returnValue(false);
            sut.billingAddressForm.$valid = false;
        });

        it('ignores billing form state while charging shipment with default billing address', () => {
            sut.isCreditCardPayment.and.returnValue(true);
            sut.billingAddress.addressDifferent = false;
            sut.billingAddressForm = null;

            sut.completeShipment();

            expect(shipmentService.chargeShipment).toHaveBeenCalled();
        });

        it('shows backend validation errors after charging shipment with custom billing address', () => {
            sut.isCreditCardPayment.and.returnValue(true);
            sut.billingAddress.addressDifferent = true;

            const data = {fieldErrors: []};
            const response = {data};
            const deferred = $q.defer();
            shipmentService.chargeShipment.and.returnValue(deferred.promise);
            deferred.reject(response);

            sut.completeShipment();
            $timeout.flush();

            expect(sut.billingAddressForm.setErrorsFromResponse).toHaveBeenCalledWith(data);
        });

        it('returns promise for non-credit-paid shipment', () => {
            sut.isCreditCardPayment.and.returnValue(false);

            expect(sut.completeShipment().then).toEqual(jasmine.any(Function));
        });

        it('returns promise for credit-paid shipment', () => {
            sut.isCreditCardPayment.and.returnValue(true);

            expect(sut.completeShipment().then).toEqual(jasmine.any(Function));
        });
    });

    describe('#getPromotionCodeAppliedMessage', () => {
        it('fetches message from nlsService and formats it via $sce.trustAsHtml', () => {
            const message = 'Promotion code {promotion_code} applied';
            const formattedMessage = 'Promotion code <b>11</b> applied';
            const trustedMessage = {};
            spyOn($sce, 'trustAsHtml');
            $sce.trustAsHtml.and.returnValue(trustedMessage);
            nlsService.getTranslationSync.and.returnValue(message);
            sut.promoCode = '11';

            const result = sut.getPromotionCodeAppliedMessage();

            expect(nlsService.getTranslationSync).toHaveBeenCalled();
            expect($sce.trustAsHtml).toHaveBeenCalledWith(formattedMessage);
            expect(result).toBe(trustedMessage);
        });
    });

    describe('#getRewardCardAppliedMessage', () => {
        it('fetches message from nlsService and formats it via $sce.trustAsHtml', () => {
            const message = 'Nectar Rewards Card {reward_card} applied';
            const formattedMessage = 'Nectar Rewards Card <b>9826300011</b> applied';
            const trustedMessage = {};
            spyOn($sce, 'trustAsHtml');
            $sce.trustAsHtml.and.returnValue(trustedMessage);
            nlsService.getTranslationSync.and.returnValue(message);
            sut.rewardCard = {
                rewardCard: '11'
            };

            const result = sut.getRewardCardAppliedMessage();

            expect(nlsService.getTranslationSync).toHaveBeenCalled();
            expect($sce.trustAsHtml).toHaveBeenCalledWith(formattedMessage);
            expect(result).toBe(trustedMessage);
        });
    });

    describe('#isPromoCodeVisible', () => {
        it('returns true if user has no dhl account and if country allows promos', () => {
            paymentTypeService.hasAccounts.and.returnValue(false);

            sut.promoCodeAvailable = true;

            expect(sut.isPromoCodeVisible()).toBe(true);

            sut.promoCodeAvailable = false;

            expect(sut.isPromoCodeVisible()).toBe(false);
        });
    });

    describe('#isRewardCardVisible', () => {
        it('returns true if user has no dhl account and if country allows reward card', () => {
            paymentTypeService.hasAccounts.and.returnValue(false);

            sut.rewardCardAvailable = true;

            expect(sut.isRewardCardVisible()).toBe(true);

            sut.rewardCardAvailable = false;

            expect(sut.isRewardCardVisible()).toBe(false);
        });
    });

    describe('#isCreditCardPayment', () => {
        const paymentType = 'CREDIT_CARD';
        let paymentInfo;

        beforeEach(() => {
            paymentInfo = {
                transportationPaymentType: paymentType
            };
            shipmentService.getPaymentInfo.and.returnValue(paymentInfo);
        });

        it('calls shipmentService to get payment info', () => {
            sut.isCreditCardPayment();

            expect(shipmentService.getPaymentInfo).toHaveBeenCalled();
        });

        it('passes transportationPaymentType to paymentTypeService.isCreditCardPayment', () => {
            const isCredit = true;
            paymentTypeService.isCreditCardPayment.and.returnValue(isCredit);

            const isCreditPayment = sut.isCreditCardPayment();

            expect(paymentTypeService.isCreditCardPayment).toHaveBeenCalledWith({paymentType});
            expect(isCreditPayment).toBe(isCredit);
        });

        it('returns false if transportationPaymentType is empty', () => {
            paymentInfo.transportationPaymentType = '';

            expect(sut.isCreditCardPayment()).toBeFalsy();
        });
    });

    describe('#getCompleteShipmentLabel', () => {
        const translatedText = 'asd';

        beforeEach(() => {
            spyOn(sut, 'isCreditCardPayment');
            nlsService.getTranslationSync.and.returnValue(translatedText);
        });

        it('calls isCreditCardPayment', () => {
            sut.getCompleteShipmentLabel();

            expect(sut.isCreditCardPayment).toHaveBeenCalled();
        });

        it('returns "agree and continue" label from nlsService if payment type is not credit card', () => {
            sut.isCreditCardPayment.and.returnValue(false);

            const result = sut.getCompleteShipmentLabel();

            expect(nlsService.getTranslationSync).toHaveBeenCalledWith('shipment.shipment_cost_agree_and_continue');
            expect(result).toEqual(translatedText);
        });

        it('returns "agree and pay" label from nlsService if payment type is credit card', () => {
            sut.isCreditCardPayment.and.returnValue(true);

            const result = sut.getCompleteShipmentLabel();

            expect(nlsService.getTranslationSync).toHaveBeenCalledWith('shipment.shipment_cost_agree_and_pay');
            expect(result).toEqual(translatedText);
        });
    });

    describe('#getCreditBufferNotification', () => {
        it('returns empty string if creditBuffer is empty', () => {
            sut.creditBuffer = '';

            expect(sut.getCreditBufferNotification()).toEqual('');
        });

        it('calls nlsService to get localized message and formats it', () => {
            const buffer = 20;
            sut.creditBuffer = buffer;
            const localizedMsg = 'bla bla {creditBuffer}%';
            const expectedMsg = `bla bla ${buffer}%`;
            nlsService.getTranslationSync.and.returnValue(localizedMsg);

            const msg = sut.getCreditBufferNotification();

            expect(nlsService.getTranslationSync).toHaveBeenCalledWith('shipment.credit_buffer_notification');
            expect(msg).toEqual(expectedMsg);
        });
    });

    describe('#saveRewardCardNumber', () => {
       it('should save reward card number to user profile', () => {
           sut.saveRewardCardNumber();
           expect(promoCodeService.saveRewardCardNumber).toHaveBeenCalledWith(sut.rewardCard.rewardCard);
       });
    });

    describe('#onRewardCardNumberChanges', () => {
        beforeEach(() => {
            sut.rewardCard = {
                rewardCard: '11111111111'
            };
            promoCodeService.validateByLuhnFormula.and.returnValue(true);
        });

        it('should display save reward card option on number validation success', () => {
            sut.onRewardCardNumberChanges();
            expect(sut.isSaveRewardCardOptionShown).toBe(true);
        });

        it('should hide save reward card option on number validation fail', () => {
            sut.rewardCard = {
                rewardCard: '12'
            };
            sut.onRewardCardNumberChanges();
            expect(sut.isSaveRewardCardOptionShown).toBe(false);
        });

        it('should display no error message about reward card number on number validation success', () => {
            sut.onRewardCardNumberChanges();
            expect(sut.rewardCardNumberInvalid).toBe(false);
        });

        it('should display error message about reward card number on number validation fail', () => {
            sut.rewardCard = {
                rewardCard: '12'
            };
            sut.onRewardCardNumberChanges();
            expect(sut.rewardCardNumberInvalid).toBe(true);
        });
    });

    describe('#onContactSelect', () => {
        it('formats and saves contact credentials', () => {
            const name = 'Mr. Smith';
            const company = 'EPAM';
            const email = 'some@email.com';
            const phoneNumber = '1231231231233';
            const phoneCountryCode = '+35';

            const contact = {
                contactName: name,
                companyName: company,
                email,
                phoneNumber,
                phoneCountryCode
            };
            const formatted = {
                name,
                company,
                email,
                phone: {
                    phoneDetails: {phoneNumber, phoneCountryCode}
                }
            };

            sut.onContactSelect(contact);

            expect(sut.billingAddress).toEqual(jasmine.objectContaining(formatted));
        });

        it('formats and saves address details', () => {
            const addrLine1 = '123, 5th Ave';
            const addrLine2 = 'asd';
            const countryName = 'United States';
            const countryCode = 'US';
            const zipOrPostCode = '123123';
            const city = 'New York';
            const stateOrProvince = 'New York';

            const contact = {
                address: addrLine1,
                address2: addrLine2,
                country: countryName,
                countryCode,
                zipOrPostCode,
                city,
                stateOrProvince
            };
            const formatted = {
                addrLine1,
                addrLine2,
                countryName,
                countryCode,
                zipOrPostCode,
                city,
                stateOrProvince
            };

            sut.onContactSelect(contact);

            expect(sut.billingAddress.addressDetails).toEqual(jasmine.objectContaining(formatted));
        });
    });
});
