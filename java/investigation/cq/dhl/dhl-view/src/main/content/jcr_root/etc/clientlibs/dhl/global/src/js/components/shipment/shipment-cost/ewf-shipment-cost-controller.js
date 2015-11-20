import ewf from 'ewf';
import EwfShipmentStepBaseController from './../ewf-shipment-step-base-controller';
import './../ewf-shipment-service';
import './../shipment-products/shipment-product-presenter-factory';
import './../shipment-products/shipment-products-service';
import './promo-code-service';
import 'services/rule-service';
import './../payment-type/payment-type-service';

EwfShipmentCostController.prototype = new EwfShipmentStepBaseController('shipment-cost');
EwfShipmentCostController.$inject = ['$scope',
                                    '$filter',
                                    '$q',
                                    '$sce',
                                    'nlsService',
                                    'ruleService',
                                    'navigationService',
                                    'shipmentService',
                                    'shipmentProductsService',
                                    'shipmentProductPresenterFactory',
                                    'promoCodeService',
                                    'paymentTypeService'];

ewf.controller('EwfShipmentCostController', EwfShipmentCostController);
export default function EwfShipmentCostController($scope,
                                                  $filter,
                                                  $q,
                                                  $sce,
                                                  nlsService,
                                                  ruleService,
                                                  navigationService,
                                                  shipmentService,
                                                  shipmentProductsService,
                                                  shipmentProductPresenterFactory,
                                                  promoCodeService,
                                                  paymentTypeService) {
    const vm = this;

    Object.assign(vm, {
        onInit,
        completeShipment,
        updateUpgradeMessageState,
        upgradeProduct,
        getPromotionCodeAppliedMessage,
        getRewardCardAppliedMessage,
        applyPromoCode,
        editPromoCode,
        applyRewardCard,
        editRewardCard,
        isPromoCodeVisible,
        isRewardCardVisible,
        isCreditCardPayment,
        getCompleteShipmentLabel,
        getCreditBufferNotification,
        saveRewardCardNumber,
        onRewardCardNumberChanges,
        onContactSelect,

        product: null,
        productOrigin: null,
        isUpgradeMessageVisible: false,
        productToUpgradeTo: null,
        promoCode: null,
        promoAccountNumber: null,
        promoCodeShown: false,
        promoCodeApplied: false,
        promoCodeValid: true,
        rewardCardShown: false,
        rewardCardApplied: false,
        rewardCard: {
            rewardCard: null,
            promoCode: ''
        },
        formName: 'shipmentCost',
        shipperCountry: null,
        upgradeAllowedForShipperCountry: false,
        promoCodeAvailable: false,
        promoAppliedMessage: '',
        rewardCardAvailable: false,
        rewardAppliedMessage: '',
        paymentProducts: [],
        paymentProduct: null,
        creditBuffer: null,
        isSaveRewardCardOptionShown: false,
        billingAddress: {
            phone: {}
        }
    });

    function onInit() {
        vm.productOrigin = shipmentService.getShipmentProduct();
        vm.userTimeZoneOffset = -(new Date().getTimezoneOffset() * 60 * 1000);

        $scope.$watch(() => shipmentService.getShipmentCountry(), onShipperCountryUpdate);
        $scope.$watch(() => shipmentService.getShipmentProduct(), onProductUpdate);
        $scope.$watch(() => vm.paymentProduct, onPaymentProductUpdate);

        setRewardCardNumberDefaultValue();
    }

    function onShipperCountryUpdate(shipperCountry) {
        vm.shipperCountry = shipperCountry;

        if (vm.isCreditCardPayment()) {
            paymentTypeService
                .getPaymentProducts(vm.shipperCountry)
                .then(onPaymentProductsLoad);

            paymentTypeService
                .getCreditBuffer(vm.shipperCountry)
                .then(onCreditBufferLoad);
        }

        return fetchRules().then(updateUpgradeMessageState);
    }

    function onCreditBufferLoad(buffer) {
        vm.creditBuffer = buffer;
    }

    function onPaymentProductsLoad(paymentProducts) {
        vm.paymentProducts = paymentProducts;
    }

    function onPaymentProductUpdate() {
        const paymentProductId = vm.paymentProduct ? vm.paymentProduct.paymentProductId : null;

        if (paymentProductId) {
            vm.billingAddress.paymentProduct = paymentProductId;
            shipmentService.setPaymentProductInfo(paymentProductId);
        }
    }

    function fetchRules() {
        return ruleService.acquireRulesForFormFields(vm.formName, vm.shipperCountry)
            .then(formatRules)
            .then(updateAccordingToRules);
    }

    function formatRules(rawRules) {
        let rules = {};

        Object.keys(rawRules).forEach((ruleName) => {
            rules[ruleName] = rawRules[ruleName].props;
        });

        return rules;
    }

    function updateAccordingToRules(rules) {
        vm.upgradeAllowedForShipperCountry = rules.upgradeNow && rules.upgradeNow.visible;
        vm.promoCodeAvailable = rules.promoCode && rules.promoCode.visible;
        vm.rewardCardAvailable = rules.rewardCard && rules.rewardCard.visible;
    }

    function onProductUpdate(product) {
        updateProductView(product);
    }

    function updateProductView(productOrigin) {
        vm.productOrigin = productOrigin;

        let timeZone = formatTZOffsetToStrTZ(vm.userTimeZoneOffset);
        vm.product = shipmentProductPresenterFactory.createProductPresenter(vm.productOrigin, timeZone);

        if (vm.promoCodeApplied) {
            vm.product.costDetails.push({
                name: nlsService.getTranslationSync('shipment.details_promotion_code').replace('{label}', vm.promoCode),
                value: vm.productOrigin.summary.payment.totalDiscount.value * (-1) || '0.00'
            });
        }

        vm.updateUpgradeMessageState();
    }

    //todo move function to separate service /copied from products-controller.js
    function formatTZOffsetToStrTZ(timezoneOffset = 0) {
        let date = new Date(Math.abs(timezoneOffset));
        date.setTime(date.getTime() + date.getTimezoneOffset() / 60 * 3600000);
        let strTime = $filter('date')(date, 'HH:mm');
        return timezoneOffset < 0
            ? `-${strTime}`
            : `+${strTime}`;
    }

    function updateUpgradeMessageState() {
        shipmentProductsService.getProductsByDate(shipmentService.getShipmentDate())
            .then(([fastest]) => {
                const product = shipmentService.getShipmentProduct();
                vm.isUpgradeMessageVisible = vm.upgradeAllowedForShipperCountry && !angular.equals(fastest, product);

                if (vm.isUpgradeMessageVisible) {
                    let {summary: {payment: {total: {value: fastPrice}}}} = fastest;
                    let {summary: {payment: {total: {value: price, currency}}}} = product;

                    let msg = nlsService.getTranslationSync('shipment.shipment_cost_upgrade_now_message');
                    currency = nlsService.getTranslationSync(`shipment.shipment_currency_${currency.toLowerCase()}`);

                    vm.upgradeMessage = msg.replace(/{price}/g, $filter('currency')(fastPrice - price, currency));
                    vm.productToUpgradeTo = fastest;
                }
            });
    }

    function completeShipment() {
        //@todo: validate all steps
        if (vm.rewardCardApplied) {
            setRewardCardToShipment();
        }

        if (vm.isCreditCardPayment()) {
            const noBillingAddress = !vm.billingAddress.addressDifferent;

            if (noBillingAddress || validateBillingForm()) {
                shipmentService.setCreditCardPaymentInfo(getBillingInfoPayload(noBillingAddress));
                return shipmentService.chargeShipment()
                    .then(navigationService.redirect)
                    .catch((response) => {
                        if (!noBillingAddress) {
                            vm.billingAddressForm.setErrorsFromResponse(response.data);
                        }
                    });
            }
        } else {
            return shipmentService.saveShipment().then(onSaveShipmentSuccess);
        }
    }

    function validateBillingForm() {
        const billingForm = vm.billingAddressForm;

        return billingForm.validate() && billingForm.$valid;
    }

    function getBillingInfoPayload(noBillingAddress) {
        const {paymentProduct, addressDifferent} = vm.billingAddress;

        return noBillingAddress ? {paymentProduct, addressDifferent} : vm.billingAddress;
    }

    function setRewardCardToShipment() {
        const data = {
            promotionCode: vm.rewardCard.promoCode,
            rewardCode: 'reward_code',
            rewardCard: `${promoCodeService.NECTAR_CODE_PREFIX}${vm.rewardCard.rewardCard}`
        };
        shipmentService.setRewardCard(data);
    }

    function onSaveShipmentSuccess(data = {}) {
        const shipmentId = data.shipmentId;

        navigationService.location(`shipment-print.html?shipmentId=${shipmentId}`);
    }

    function upgradeProduct() {
        shipmentService.setShipmentProduct(vm.productToUpgradeTo);
    }

    function setRewardCardNumberDefaultValue() {
        promoCodeService.getSavedRewardCardNumber()
            .then((number) => {
                vm.rewardCard.rewardCard = number;
            });
    }

    function applyPromoCode() {
        if (!vm.promoCode) {
            vm.promoCodeValid = false;
            return;
        }

        vm.promoCodeApplied = false;

        // @todo Remove mocked payment info once UC-SHP-18 is implemented and integrated with ADT
        const paymentType = 'CRC'; //shipmentService.getPaymentInfo().quotationType;
        const accountNumber = 'CREDUSA'; // shipmentService.getPaymentInfo().quotationAccountNumber;
        const shipperCountryCode = shipmentService.getShipmentCountry();
        const destinationCountryCode = shipmentService.getDestinationCountry();

        promoCodeService.validatePromoCode(vm.promoCode,
                                           accountNumber,
                                           paymentType,
                                           shipperCountryCode,
                                           destinationCountryCode)
            .then((data) => data.accountNumber)
            .then(onPromoCodeValid)
            .catch(onPromoCodeInvalid);
    }

    function onPromoCodeValid(accountNumber) {
        vm.promoCodeValid = true;
        processPromoAccount(accountNumber);
    }

    function onPromoCodeInvalid() {
        vm.promoCodeValid = false;
    }

    function processPromoAccount(accountNumber) {
        const quoteRequestData = shipmentService.getQuotesRequestData();
        const shipmentDate = shipmentService.getShipmentDate();

        shipmentProductsService.clearProductsCache()
            .getProductWithDiscount(accountNumber, vm.productOrigin, shipmentDate, quoteRequestData)
            .then((discountedProduct) => {
                vm.promoCodeApplied = true;
                vm.promoAppliedMessage = getPromotionCodeAppliedMessage();
                updateProductView(discountedProduct);
            });
    }

    function applyRewardCard() {
        promoCodeService.validateRewardCard(vm.rewardCard)
            .then(() => {
                vm.rewardCardApplied = true;
                vm.rewardAppliedMessage = getRewardCardAppliedMessage();
                clearRewardCardErrors();
            })
            .catch(onValidationError);
    }

    function clearRewardCardErrors() {
        vm.rewardCardNumberInvalid = false;
        vm.rewardCardPromoCodeInvalid = false;
    }

    // TODO: add validation with ewf-input for reward card fields
    function onValidationError(errors) {
        const rewardCardNum = 'rewardCard';
        const rewardCardPromoCode = 'promoCode';

        vm.rewardCardNumberInvalid = errors.includes(rewardCardNum);
        vm.rewardCardPromoCodeInvalid = errors.includes(rewardCardPromoCode);
    }

    function editPromoCode() {
        vm.promoCodeApplied = false;
    }

    function editRewardCard() {
        vm.rewardCardApplied = false;
    }

    function getPromotionCodeAppliedMessage() {
        const message = nlsService.getTranslationSync('shipment.shipment_cost_promotion_code_applied');
        const formatted = message.replace(/{promotion_code}/g, `<b>${vm.promoCode}</b>`);

        return $sce.trustAsHtml(formatted);
    }

    function getRewardCardAppliedMessage() {
        const rewardCard = `${promoCodeService.NECTAR_CODE_PREFIX}${vm.rewardCard.rewardCard}`;
        const message = nlsService.getTranslationSync('shipment.shipment_cost_reward_card_applied');
        const formatted = message.replace(/{reward_card}/g, `<b>${rewardCard}</b>`);

        return $sce.trustAsHtml(formatted);
    }

    function isPromoCodeVisible() {
        return vm.promoCodeAvailable && !paymentTypeService.hasAccounts();
    }

    function isRewardCardVisible() {
        return vm.rewardCardAvailable && !paymentTypeService.hasAccounts();
    }

    function isCreditCardPayment() {
        const paymentInfo = shipmentService.getPaymentInfo();
        const paymentType = paymentInfo.transportationPaymentType;

        return paymentTypeService.isCreditCardPayment({paymentType});
    }

    function getCompleteShipmentLabel() {
        const actionName = vm.isCreditCardPayment() ? 'pay' : 'continue';

        return nlsService.getTranslationSync(`shipment.shipment_cost_agree_and_${actionName}`);
    }

    function getCreditBufferNotification() {
        if (!vm.creditBuffer) {
            return '';
        }

        return nlsService
            .getTranslationSync('shipment.credit_buffer_notification')
            .replace(/{creditBuffer}/g, vm.creditBuffer);
    }

    function saveRewardCardNumber() {
        promoCodeService.saveRewardCardNumber(vm.rewardCard.rewardCard);
    }

    function onRewardCardNumberChanges() {
        const validNumber = validateRewardCardNumber();
        vm.rewardCardNumberInvalid = !validNumber;
        vm.isSaveRewardCardOptionShown = validNumber;
    }

    function validateRewardCardNumber() {
        const REWARD_CARD_NUMBER_PATTERN = /[0-9]{11}/;

       return REWARD_CARD_NUMBER_PATTERN.test(vm.rewardCard.rewardCard) &&
            promoCodeService.validateByLuhnFormula(vm.rewardCard.rewardCard);
    }

    function onContactSelect(contact) {
        const {email, zipOrPostCode, city, stateOrProvince, phoneNumber, phoneCountryCode, countryCode} = contact;

        Object.assign(vm.billingAddress, {
            name: contact.contactName,
            company: contact.companyName,
            email,
            phone: {
                phoneDetails: {phoneNumber, phoneCountryCode}
            },
            addressDetails: {
                addrLine1: contact.address,
                addrLine2: contact.address2,
                countryName: contact.country,
                countryCode,
                zipOrPostCode,
                city,
                stateOrProvince
            }
        });
    }
}
