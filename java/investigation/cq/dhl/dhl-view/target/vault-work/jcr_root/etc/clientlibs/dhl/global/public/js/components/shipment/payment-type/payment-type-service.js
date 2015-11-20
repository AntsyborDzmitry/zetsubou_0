define(['exports', 'module', 'ewf', './../ewf-shipment-error-service'], function (exports, module, _ewf, _ewfShipmentErrorService) {
    'use strict';

    module.exports = paymentTypeService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('paymentTypeService', paymentTypeService);

    paymentTypeService.$inject = ['$http', '$q', 'logService', 'shipmentErrorService', 'nlsService'];

    function paymentTypeService($http, $q, logService, shipmentErrorService, nlsService) {
        var SHIPMENT_TYPES = {
            IMPORT: 'import',
            EXPORT: 'export',
            DOMESTIC: 'domestic'
        };

        var INCOTERMS_DEFAULTS = {
            RECEIVER_WILL_PAY: 'DAP',
            EXPORT_ACCOUNT_NUMBER: 'DTP',
            IMPORT_ACCOUNT_NUMBER: 'DAP',
            ALTERNATE_DHLACCOUNT: 'DAP'
        };

        var DUTIES_DEFAULT_TITLES = {
            IMPORT: 'importDutiesAndTaxesAccount',
            EXPORT: 'exportDutiesAndTaxesAccount',
            RETURN: 'returnDutiesAndTaxesAccount'
        };

        var USER_PROFILE_DEFAULT_VALUES = {
            DHL_ACCOUNT: 'account',
            ALTERNATE_DHLACCOUNT: 'alternate',
            RECEIVER_WILL_PAY: 'receiverPay'
        };

        var PAYMENT_TYPES = {
            DHL_ACCOUNT: 'DHL_ACCOUNT',
            ALTERNATE_DHLACCOUNT: 'ALTERNATE_DHLACCOUNT',
            CREDIT_CARD: 'CREDIT_CARD',
            PAYPAL: 'PAYPAL',
            CASH: 'CASH',
            RECEIVER_WILL_PAY: 'RECEIVER_WILL_PAY'
        };

        var publicApi = {
            getPaymentTypeList: getPaymentTypeList,
            validatePaymentAccount: validatePaymentAccount,
            getIncoterms: getIncoterms,
            getIncotermDefaultValueForDutiesAndTaxes: getIncotermDefaultValueForDutiesAndTaxes,
            getAssociatedOption: getAssociatedOption,
            hasAccounts: hasAccounts,
            isCreditCardPayment: isCreditCardPayment,
            getPaymentProducts: getPaymentProducts,
            getCreditBuffer: getCreditBuffer,
            PAYMENT_TYPES: PAYMENT_TYPES,
            SHIPMENT_TYPES: SHIPMENT_TYPES
        };

        var paymentOptionsList = [];

        function getPaymentTypeList(shipmentCountry, keys, shipmentType) {
            var filterDutiesAndTaxes = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

            var data = {
                shipmentCountry: shipmentCountry,
                fromContactKey: keys.fromContactKey || '',
                toContactKey: keys.toContactKey || ''
            };
            return $http.post('/api/shipment/payment/list', data)
            //@todo Remove credit card payment method mapping once BE is updated
            .then(function (response) {
                response.data.paymentOptions.map(function (paymentOption) {
                    if (paymentOption.paymentType === PAYMENT_TYPES.CREDIT_CARD) {
                        PAYMENT_TYPES.CREDIT_CARD = 'CRC';
                        paymentOption.paymentType = PAYMENT_TYPES.CREDIT_CARD;
                    }
                    return paymentOption;
                });
                return response;
            }).then(function (response) {
                paymentOptionsList = response.data.paymentOptions;
                return filterPaymentTypeListResponse(response.data, shipmentType, filterDutiesAndTaxes);
            })['catch'](function (response) {
                logService.log('Payment type failed with ' + response.data);
                return $q.reject(response.data);
            });
        }

        function validatePaymentAccount(data, shipmentType) {
            data.isDomestic = shipmentType === SHIPMENT_TYPES.DOMESTIC;
            data.isExport = shipmentType === SHIPMENT_TYPES.EXPORT;
            data.isImport = shipmentType === SHIPMENT_TYPES.IMPORT;

            return $http.post('/api/shipment/payment/account/validate', data).then(function (response) {
                return response.data;
            })['catch'](function (response) {
                logService.log('Validation failed ' + response.data);
                return shipmentErrorService.processErrorCode(response);
            });
        }

        function getIncoterms(shipmentCountry) {
            return $http.get('/api/shipment/payment/incoterm/list/' + shipmentCountry).then(function (response) {
                return {
                    incoterms: sortIncoterms(response.data.incoterms),
                    defaultIncotermCode: response.data.defaultIncotermCode
                };
            })['catch'](function (response) {
                logService.log('Custom terms of trade failed with ' + response.data);
            });
        }

        function sortIncoterms(list) {
            return list.sort(function (first, second) {
                if (first.code < second.code) {
                    return -1;
                } else if (first.code > second.code) {
                    return 1;
                }
                return 0;
            });
        }

        function getIncotermDefaultValueForDutiesAndTaxes(data) {
            var incotermForDuties = getAssosiatedIncoterm(data.dutiesTypeSelected);
            var incotermForTaxes = undefined;
            if (data.splitDutiesAndTaxes) {
                incotermForTaxes = getAssosiatedIncoterm(data.taxesTypeSelected);
            }
            if (!incotermForTaxes && incotermForDuties || incotermForDuties === incotermForTaxes) {
                return { code: incotermForDuties };
            }
        }

        function getAssosiatedIncoterm(option) {
            var incotermDefault = undefined;
            var dutiesPaymentType = option.paymentType;
            if (dutiesPaymentType === PAYMENT_TYPES.RECEIVER_WILL_PAY) {
                incotermDefault = INCOTERMS_DEFAULTS.RECEIVER_WILL_PAY;
            } else if (dutiesPaymentType === PAYMENT_TYPES.ALTERNATE_DHLACCOUNT) {
                incotermDefault = INCOTERMS_DEFAULTS.ALTERNATE_DHLACCOUNT;
            } else if (dutiesPaymentType === PAYMENT_TYPES.DHL_ACCOUNT) {
                if (option.isImport) {
                    incotermDefault = INCOTERMS_DEFAULTS.IMPORT_ACCOUNT_NUMBER;
                } else if (!option.isLocal) {
                    incotermDefault = INCOTERMS_DEFAULTS.EXPORT_ACCOUNT_NUMBER;
                }
            }
            return incotermDefault;
        }

        function filterPaymentTypeListResponse(data, shipmentType, filterDutiesAndTaxes) {
            var response = {};
            data.paymentOptions = getValidPaymentOptions(data.paymentOptions, shipmentType);
            if (filterDutiesAndTaxes) {
                response.defaults = getDutiesAndTaxesDefaults(data, shipmentType);
            }
            response.paymentOptions = data.paymentOptions;
            return response;
        }

        function getValidPaymentOptions(data, shipmentType) {
            return data.filter(isValidPaymentType.bind(this, shipmentType));
        }

        function isValidPaymentType(shipmentType, item) {
            return shipmentType !== SHIPMENT_TYPES.IMPORT || item.paymentType !== PAYMENT_TYPES.DHL_ACCOUNT || shipmentType === SHIPMENT_TYPES.IMPORT && item.isImport;
        }

        function formatContactSettingsDefaults(paymentSettings) {
            var settings = paymentSettings || {};
            var defaults = {};

            Object.keys(settings).forEach(function (key) {
                if (settings[key]) {
                    defaults[key] = formatContactSettingsPaymentOption(settings[key]);
                }
            });
            return defaults;
        }

        function formatContactSettingsPaymentOption(option) {
            var optionFormatted = {};
            optionFormatted.paymentType = option.type;
            if (option.type === PAYMENT_TYPES.DHL_ACCOUNT) {
                optionFormatted.key = option.key;
            }
            return optionFormatted;
        }

        function filterUserProfileDutiesAndTaxesDefaults(data, shipmentType) {
            var defaultValue = undefined;
            if (data) {
                var type = shipmentType.toUpperCase();
                defaultValue = data[DUTIES_DEFAULT_TITLES[type]];
            }
            var defaultOption = {};
            if (defaultValue && defaultValue.type === USER_PROFILE_DEFAULT_VALUES.ALTERNATE_DHLACCOUNT) {
                defaultOption.paymentType = PAYMENT_TYPES.ALTERNATE_DHLACCOUNT;
            } else if (defaultValue && defaultValue.type === USER_PROFILE_DEFAULT_VALUES.DHL_ACCOUNT) {
                defaultOption.paymentType = PAYMENT_TYPES.DHL_ACCOUNT;
                defaultOption.key = defaultValue.data.key;
            } else {
                defaultOption.paymentType = PAYMENT_TYPES.RECEIVER_WILL_PAY;
            }
            return defaultOption;
        }

        function getDutiesAndTaxesDefaults(data, shipmentType) {
            var defaults = filterResponseDefaultValues(data, shipmentType);
            var paymentOptions = data.paymentOptions;
            var dutiesAndTaxesDefaults = getDutiesAndTaxesContactDefaultValues(defaults, paymentOptions);

            if (!dutiesAndTaxesDefaults.duties && defaults.userProfile) {
                dutiesAndTaxesDefaults.duties = getAssociatedOption(paymentOptions, defaults.userProfile);
            }

            dutiesAndTaxesDefaults.duties = dutiesAndTaxesDefaults.duties || getAssociatedOption(paymentOptions, { paymentType: PAYMENT_TYPES.RECEIVER_WILL_PAY });
            dutiesAndTaxesDefaults.taxes = dutiesAndTaxesDefaults.taxes || dutiesAndTaxesDefaults.duties;

            return dutiesAndTaxesDefaults;
        }

        function getDutiesAndTaxesContactDefaultValues(defaults, paymentOptions) {
            var dutiesAndTaxesDefaults = {};
            ['toContact', 'fromContact'].forEach(function (item) {
                if (!dutiesAndTaxesDefaults.duties && defaults[item]) {
                    dutiesAndTaxesDefaults = {
                        duties: getAssociatedOption(paymentOptions, defaults[item].accountForDuties),
                        taxes: getAssociatedOption(paymentOptions, defaults[item].accountForTaxes)
                    };
                }
            });
            return dutiesAndTaxesDefaults;
        }

        function filterResponseDefaultValues(data, shipmentType) {
            return {
                toContact: formatContactSettingsDefaults(data.toPaymentSetting),
                fromContact: formatContactSettingsDefaults(data.fromPaymentSetting),
                userProfile: filterUserProfileDutiesAndTaxesDefaults(data.userDefaults, shipmentType)
            };
        }

        function getAssociatedOption(options, selectedOption) {
            if (selectedOption) {
                return options.find(function (item) {
                    return selectedOption.key && selectedOption.key === item.key || !selectedOption.key && selectedOption.paymentType === item.paymentType;
                });
            }
        }

        function hasAccounts() {
            return paymentOptionsList && paymentOptionsList.some(function (item) {
                return item.paymentType === PAYMENT_TYPES.DHL_ACCOUNT;
            });
        }

        function isCreditCardPayment(payment) {
            return payment.paymentType === PAYMENT_TYPES.CREDIT_CARD;
        }

        function getPaymentProducts(countryId) {
            return $http.get('/api/payment/list?country=' + countryId).then(function (response) {
                return Array.isArray(response.data) ? response.data : $q.reject(response);
            }).then(function (creditCards) {
                return creditCards.map(attachCreditCardLabel);
            })['catch'](function (response) {
                shipmentErrorService.processErrorCode(response);

                /** mock, to be removed */
                return [{
                    paymentProductId: '1',
                    paymentProduct: 'visa',
                    img: '/etc/clientlibs/dhl/global/public/img/credit-cards/visa.png',
                    label: 'Visa'
                }, {
                    paymentProductId: '2',
                    paymentProduct: 'maestro',
                    img: '/etc/clientlibs/dhl/global/public/img/credit-cards/maestro.png',
                    label: 'Maestro'
                }, {
                    paymentProductId: '3',
                    paymentProduct: 'amex',
                    img: '/etc/clientlibs/dhl/global/public/img/credit-cards/amex.png',
                    label: 'American Express'
                }];
            });
        }

        function attachCreditCardLabel(card) {
            card.label = nlsService.getTranslationSync('shipment.credit_card_' + card.paymentProduct);
            return card;
        }

        function getCreditBuffer(countryId) {
            var url = '/api/payment/buffer?country=' + countryId;

            return $http.get(url).then(function (response) {
                return response.data.buffer || $q.reject(response);
            })['catch'](function (response) {
                shipmentErrorService.processErrorCode(response);

                /** mock, to be removed */
                return 20;
            });
        }

        return publicApi;
    }
});
//# sourceMappingURL=payment-type-service.js.map
