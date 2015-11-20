define(['exports', 'module', 'ewf', './../ewf-shipment-step-base-controller', './../ewf-shipment-service', './../shipment-products/shipment-product-presenter-factory', './../shipment-products/shipment-products-service', './promo-code-service', 'services/rule-service', './../payment-type/payment-type-service'], function (exports, module, _ewf, _ewfShipmentStepBaseController, _ewfShipmentService, _shipmentProductsShipmentProductPresenterFactory, _shipmentProductsShipmentProductsService, _promoCodeService, _servicesRuleService, _paymentTypePaymentTypeService) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = EwfShipmentCostController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfShipmentStepBaseController = _interopRequireDefault(_ewfShipmentStepBaseController);

    EwfShipmentCostController.prototype = new _EwfShipmentStepBaseController['default']('shipment-cost');
    EwfShipmentCostController.$inject = ['$scope', '$filter', '$q', '$sce', 'nlsService', 'ruleService', 'navigationService', 'shipmentService', 'shipmentProductsService', 'shipmentProductPresenterFactory', 'promoCodeService', 'paymentTypeService'];

    _ewf2['default'].controller('EwfShipmentCostController', EwfShipmentCostController);

    function EwfShipmentCostController($scope, $filter, $q, $sce, nlsService, ruleService, navigationService, shipmentService, shipmentProductsService, shipmentProductPresenterFactory, promoCodeService, paymentTypeService) {
        var vm = this;

        Object.assign(vm, {
            onInit: onInit,
            completeShipment: completeShipment,
            updateUpgradeMessageState: updateUpgradeMessageState,
            upgradeProduct: upgradeProduct,
            getPromotionCodeAppliedMessage: getPromotionCodeAppliedMessage,
            getRewardCardAppliedMessage: getRewardCardAppliedMessage,
            applyPromoCode: applyPromoCode,
            editPromoCode: editPromoCode,
            applyRewardCard: applyRewardCard,
            editRewardCard: editRewardCard,
            isPromoCodeVisible: isPromoCodeVisible,
            isRewardCardVisible: isRewardCardVisible,
            isCreditCardPayment: isCreditCardPayment,
            getCompleteShipmentLabel: getCompleteShipmentLabel,
            getCreditBufferNotification: getCreditBufferNotification,
            saveRewardCardNumber: saveRewardCardNumber,
            onRewardCardNumberChanges: onRewardCardNumberChanges,
            onContactSelect: onContactSelect,

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

            $scope.$watch(function () {
                return shipmentService.getShipmentCountry();
            }, onShipperCountryUpdate);
            $scope.$watch(function () {
                return shipmentService.getShipmentProduct();
            }, onProductUpdate);
            $scope.$watch(function () {
                return vm.paymentProduct;
            }, onPaymentProductUpdate);

            setRewardCardNumberDefaultValue();
        }

        function onShipperCountryUpdate(shipperCountry) {
            vm.shipperCountry = shipperCountry;

            if (vm.isCreditCardPayment()) {
                paymentTypeService.getPaymentProducts(vm.shipperCountry).then(onPaymentProductsLoad);

                paymentTypeService.getCreditBuffer(vm.shipperCountry).then(onCreditBufferLoad);
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
            var paymentProductId = vm.paymentProduct ? vm.paymentProduct.paymentProductId : null;

            if (paymentProductId) {
                vm.billingAddress.paymentProduct = paymentProductId;
                shipmentService.setPaymentProductInfo(paymentProductId);
            }
        }

        function fetchRules() {
            return ruleService.acquireRulesForFormFields(vm.formName, vm.shipperCountry).then(formatRules).then(updateAccordingToRules);
        }

        function formatRules(rawRules) {
            var rules = {};

            Object.keys(rawRules).forEach(function (ruleName) {
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

            var timeZone = formatTZOffsetToStrTZ(vm.userTimeZoneOffset);
            vm.product = shipmentProductPresenterFactory.createProductPresenter(vm.productOrigin, timeZone);

            if (vm.promoCodeApplied) {
                vm.product.costDetails.push({
                    name: nlsService.getTranslationSync('shipment.details_promotion_code').replace('{label}', vm.promoCode),
                    value: vm.productOrigin.summary.payment.totalDiscount.value * -1 || '0.00'
                });
            }

            vm.updateUpgradeMessageState();
        }

        //todo move function to separate service /copied from products-controller.js
        function formatTZOffsetToStrTZ() {
            var timezoneOffset = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            var date = new Date(Math.abs(timezoneOffset));
            date.setTime(date.getTime() + date.getTimezoneOffset() / 60 * 3600000);
            var strTime = $filter('date')(date, 'HH:mm');
            return timezoneOffset < 0 ? '-' + strTime : '+' + strTime;
        }

        function updateUpgradeMessageState() {
            shipmentProductsService.getProductsByDate(shipmentService.getShipmentDate()).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 1);

                var fastest = _ref2[0];

                var product = shipmentService.getShipmentProduct();
                vm.isUpgradeMessageVisible = vm.upgradeAllowedForShipperCountry && !angular.equals(fastest, product);

                if (vm.isUpgradeMessageVisible) {
                    var fastPrice = fastest.summary.payment.total.value;
                    var _product$summary$payment$total = product.summary.payment.total;
                    var price = _product$summary$payment$total.value;
                    var currency = _product$summary$payment$total.currency;

                    var msg = nlsService.getTranslationSync('shipment.shipment_cost_upgrade_now_message');
                    currency = nlsService.getTranslationSync('shipment.shipment_currency_' + currency.toLowerCase());

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
                var _ret = (function () {
                    var noBillingAddress = !vm.billingAddress.addressDifferent;

                    if (noBillingAddress || validateBillingForm()) {
                        shipmentService.setCreditCardPaymentInfo(getBillingInfoPayload(noBillingAddress));
                        return {
                            v: shipmentService.chargeShipment().then(navigationService.redirect)['catch'](function (response) {
                                if (!noBillingAddress) {
                                    vm.billingAddressForm.setErrorsFromResponse(response.data);
                                }
                            })
                        };
                    }
                })();

                if (typeof _ret === 'object') return _ret.v;
            } else {
                return shipmentService.saveShipment().then(onSaveShipmentSuccess);
            }
        }

        function validateBillingForm() {
            var billingForm = vm.billingAddressForm;

            return billingForm.validate() && billingForm.$valid;
        }

        function getBillingInfoPayload(noBillingAddress) {
            var _vm$billingAddress = vm.billingAddress;
            var paymentProduct = _vm$billingAddress.paymentProduct;
            var addressDifferent = _vm$billingAddress.addressDifferent;

            return noBillingAddress ? { paymentProduct: paymentProduct, addressDifferent: addressDifferent } : vm.billingAddress;
        }

        function setRewardCardToShipment() {
            var data = {
                promotionCode: vm.rewardCard.promoCode,
                rewardCode: 'reward_code',
                rewardCard: '' + promoCodeService.NECTAR_CODE_PREFIX + vm.rewardCard.rewardCard
            };
            shipmentService.setRewardCard(data);
        }

        function onSaveShipmentSuccess() {
            var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var shipmentId = data.shipmentId;

            navigationService.location('shipment-print.html?shipmentId=' + shipmentId);
        }

        function upgradeProduct() {
            shipmentService.setShipmentProduct(vm.productToUpgradeTo);
        }

        function setRewardCardNumberDefaultValue() {
            promoCodeService.getSavedRewardCardNumber().then(function (number) {
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
            var paymentType = 'CRC'; //shipmentService.getPaymentInfo().quotationType;
            var accountNumber = 'CREDUSA'; // shipmentService.getPaymentInfo().quotationAccountNumber;
            var shipperCountryCode = shipmentService.getShipmentCountry();
            var destinationCountryCode = shipmentService.getDestinationCountry();

            promoCodeService.validatePromoCode(vm.promoCode, accountNumber, paymentType, shipperCountryCode, destinationCountryCode).then(function (data) {
                return data.accountNumber;
            }).then(onPromoCodeValid)['catch'](onPromoCodeInvalid);
        }

        function onPromoCodeValid(accountNumber) {
            vm.promoCodeValid = true;
            processPromoAccount(accountNumber);
        }

        function onPromoCodeInvalid() {
            vm.promoCodeValid = false;
        }

        function processPromoAccount(accountNumber) {
            var quoteRequestData = shipmentService.getQuotesRequestData();
            var shipmentDate = shipmentService.getShipmentDate();

            shipmentProductsService.clearProductsCache().getProductWithDiscount(accountNumber, vm.productOrigin, shipmentDate, quoteRequestData).then(function (discountedProduct) {
                vm.promoCodeApplied = true;
                vm.promoAppliedMessage = getPromotionCodeAppliedMessage();
                updateProductView(discountedProduct);
            });
        }

        function applyRewardCard() {
            promoCodeService.validateRewardCard(vm.rewardCard).then(function () {
                vm.rewardCardApplied = true;
                vm.rewardAppliedMessage = getRewardCardAppliedMessage();
                clearRewardCardErrors();
            })['catch'](onValidationError);
        }

        function clearRewardCardErrors() {
            vm.rewardCardNumberInvalid = false;
            vm.rewardCardPromoCodeInvalid = false;
        }

        // TODO: add validation with ewf-input for reward card fields
        function onValidationError(errors) {
            var rewardCardNum = 'rewardCard';
            var rewardCardPromoCode = 'promoCode';

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
            var message = nlsService.getTranslationSync('shipment.shipment_cost_promotion_code_applied');
            var formatted = message.replace(/{promotion_code}/g, '<b>' + vm.promoCode + '</b>');

            return $sce.trustAsHtml(formatted);
        }

        function getRewardCardAppliedMessage() {
            var rewardCard = '' + promoCodeService.NECTAR_CODE_PREFIX + vm.rewardCard.rewardCard;
            var message = nlsService.getTranslationSync('shipment.shipment_cost_reward_card_applied');
            var formatted = message.replace(/{reward_card}/g, '<b>' + rewardCard + '</b>');

            return $sce.trustAsHtml(formatted);
        }

        function isPromoCodeVisible() {
            return vm.promoCodeAvailable && !paymentTypeService.hasAccounts();
        }

        function isRewardCardVisible() {
            return vm.rewardCardAvailable && !paymentTypeService.hasAccounts();
        }

        function isCreditCardPayment() {
            var paymentInfo = shipmentService.getPaymentInfo();
            var paymentType = paymentInfo.transportationPaymentType;

            return paymentTypeService.isCreditCardPayment({ paymentType: paymentType });
        }

        function getCompleteShipmentLabel() {
            var actionName = vm.isCreditCardPayment() ? 'pay' : 'continue';

            return nlsService.getTranslationSync('shipment.shipment_cost_agree_and_' + actionName);
        }

        function getCreditBufferNotification() {
            if (!vm.creditBuffer) {
                return '';
            }

            return nlsService.getTranslationSync('shipment.credit_buffer_notification').replace(/{creditBuffer}/g, vm.creditBuffer);
        }

        function saveRewardCardNumber() {
            promoCodeService.saveRewardCardNumber(vm.rewardCard.rewardCard);
        }

        function onRewardCardNumberChanges() {
            var validNumber = validateRewardCardNumber();
            vm.rewardCardNumberInvalid = !validNumber;
            vm.isSaveRewardCardOptionShown = validNumber;
        }

        function validateRewardCardNumber() {
            var REWARD_CARD_NUMBER_PATTERN = /[0-9]{11}/;

            return REWARD_CARD_NUMBER_PATTERN.test(vm.rewardCard.rewardCard) && promoCodeService.validateByLuhnFormula(vm.rewardCard.rewardCard);
        }

        function onContactSelect(contact) {
            var email = contact.email;
            var zipOrPostCode = contact.zipOrPostCode;
            var city = contact.city;
            var stateOrProvince = contact.stateOrProvince;
            var phoneNumber = contact.phoneNumber;
            var phoneCountryCode = contact.phoneCountryCode;
            var countryCode = contact.countryCode;

            Object.assign(vm.billingAddress, {
                name: contact.contactName,
                company: contact.companyName,
                email: email,
                phone: {
                    phoneDetails: { phoneNumber: phoneNumber, phoneCountryCode: phoneCountryCode }
                },
                addressDetails: {
                    addrLine1: contact.address,
                    addrLine2: contact.address2,
                    countryName: contact.country,
                    countryCode: countryCode,
                    zipOrPostCode: zipOrPostCode,
                    city: city,
                    stateOrProvince: stateOrProvince
                }
            });
        }
    }
});
//# sourceMappingURL=ewf-shipment-cost-controller.js.map
