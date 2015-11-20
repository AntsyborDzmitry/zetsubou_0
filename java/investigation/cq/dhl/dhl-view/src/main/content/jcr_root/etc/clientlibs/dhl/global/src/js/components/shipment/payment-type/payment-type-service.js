import ewf from 'ewf';
import './../ewf-shipment-error-service';

ewf.service('paymentTypeService', paymentTypeService);

paymentTypeService.$inject = ['$http', '$q', 'logService', 'shipmentErrorService', 'nlsService'];

export default function paymentTypeService($http, $q, logService, shipmentErrorService, nlsService) {
    const SHIPMENT_TYPES = {
        IMPORT: 'import',
        EXPORT: 'export',
        DOMESTIC: 'domestic'
    };

    const INCOTERMS_DEFAULTS = {
        RECEIVER_WILL_PAY: 'DAP',
        EXPORT_ACCOUNT_NUMBER: 'DTP',
        IMPORT_ACCOUNT_NUMBER: 'DAP',
        ALTERNATE_DHLACCOUNT: 'DAP'
    };

    const DUTIES_DEFAULT_TITLES = {
        IMPORT: 'importDutiesAndTaxesAccount',
        EXPORT: 'exportDutiesAndTaxesAccount',
        RETURN: 'returnDutiesAndTaxesAccount'
    };

    const USER_PROFILE_DEFAULT_VALUES = {
        DHL_ACCOUNT: 'account',
        ALTERNATE_DHLACCOUNT: 'alternate',
        RECEIVER_WILL_PAY: 'receiverPay'
    };

    const PAYMENT_TYPES = {
        DHL_ACCOUNT: 'DHL_ACCOUNT',
        ALTERNATE_DHLACCOUNT: 'ALTERNATE_DHLACCOUNT',
        CREDIT_CARD: 'CREDIT_CARD',
        PAYPAL: 'PAYPAL',
        CASH: 'CASH',
        RECEIVER_WILL_PAY: 'RECEIVER_WILL_PAY'
    };

    const publicApi = {
        getPaymentTypeList,
        validatePaymentAccount,
        getIncoterms,
        getIncotermDefaultValueForDutiesAndTaxes,
        getAssociatedOption,
        hasAccounts,
        isCreditCardPayment,
        getPaymentProducts,
        getCreditBuffer,
        PAYMENT_TYPES,
        SHIPMENT_TYPES
    };

    let paymentOptionsList = [];

    function getPaymentTypeList(shipmentCountry, keys, shipmentType, filterDutiesAndTaxes = false) {
        const data = {
            shipmentCountry,
            fromContactKey: keys.fromContactKey || '',
            toContactKey: keys.toContactKey || ''
        };
        return $http.post(`/api/shipment/payment/list`, data)
            //@todo Remove credit card payment method mapping once BE is updated
            .then((response) => {
                response.data.paymentOptions.map((paymentOption) => {
                    if (paymentOption.paymentType === PAYMENT_TYPES.CREDIT_CARD) {
                        PAYMENT_TYPES.CREDIT_CARD = 'CRC';
                        paymentOption.paymentType = PAYMENT_TYPES.CREDIT_CARD;
                    }
                    return paymentOption;
                });
                return response;
            })
            .then((response) => {
                paymentOptionsList = response.data.paymentOptions;
                return filterPaymentTypeListResponse(response.data, shipmentType, filterDutiesAndTaxes);
            })
            .catch((response) => {
                logService.log(`Payment type failed with ${response.data}`);
                return $q.reject(response.data);
            });
    }

    function validatePaymentAccount(data, shipmentType) {
        data.isDomestic = shipmentType === SHIPMENT_TYPES.DOMESTIC;
        data.isExport = shipmentType === SHIPMENT_TYPES.EXPORT;
        data.isImport = shipmentType === SHIPMENT_TYPES.IMPORT;

        return $http.post('/api/shipment/payment/account/validate', data)
            .then((response) => response.data)
            .catch((response) => {
                logService.log(`Validation failed ${response.data}`);
                return shipmentErrorService.processErrorCode(response);
            });
    }

    function getIncoterms(shipmentCountry) {
        return $http.get(`/api/shipment/payment/incoterm/list/${shipmentCountry}`)
            .then((response) => ({
                incoterms: sortIncoterms(response.data.incoterms),
                defaultIncotermCode: response.data.defaultIncotermCode
            }))
            .catch((response) => {
                logService.log(`Custom terms of trade failed with ${response.data}`);
            });
    }

    function sortIncoterms(list) {
        return list.sort((first, second) => {
            if (first.code < second.code) {
                return -1;
            } else if (first.code > second.code) {
                return 1;
            }
            return 0;
        });
    }

    function getIncotermDefaultValueForDutiesAndTaxes(data) {
        const incotermForDuties = getAssosiatedIncoterm(data.dutiesTypeSelected);
        let incotermForTaxes;
        if (data.splitDutiesAndTaxes) {
            incotermForTaxes = getAssosiatedIncoterm(data.taxesTypeSelected);
        }
        if ((!incotermForTaxes && incotermForDuties) || (incotermForDuties === incotermForTaxes)) {
            return {code: incotermForDuties};
        }
    }

    function getAssosiatedIncoterm(option) {
        let incotermDefault;
        const dutiesPaymentType = option.paymentType;
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
        let response = {};
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
        return shipmentType !== SHIPMENT_TYPES.IMPORT || item.paymentType !== PAYMENT_TYPES.DHL_ACCOUNT ||
            (shipmentType === SHIPMENT_TYPES.IMPORT && item.isImport);
    }

    function formatContactSettingsDefaults(paymentSettings) {
        const settings = paymentSettings || {};
        const defaults = {};

        Object.keys(settings).forEach((key) => {
            if (settings[key]) {
                defaults[key] = formatContactSettingsPaymentOption(settings[key]);
            }
        });
        return defaults;
    }

    function formatContactSettingsPaymentOption(option) {
        let optionFormatted = {};
        optionFormatted.paymentType = option.type;
        if (option.type === PAYMENT_TYPES.DHL_ACCOUNT) {
            optionFormatted.key = option.key;
        }
        return optionFormatted;
    }

    function filterUserProfileDutiesAndTaxesDefaults(data, shipmentType) {
        let defaultValue;
        if (data) {
            const type = shipmentType.toUpperCase();
            defaultValue = data[DUTIES_DEFAULT_TITLES[type]];
        }
        let defaultOption = {};
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
        const defaults = filterResponseDefaultValues(data, shipmentType);
        const paymentOptions = data.paymentOptions;
        let dutiesAndTaxesDefaults = getDutiesAndTaxesContactDefaultValues(defaults, paymentOptions);

        if (!dutiesAndTaxesDefaults.duties && defaults.userProfile) {
            dutiesAndTaxesDefaults.duties = getAssociatedOption(paymentOptions, defaults.userProfile);
        }

        dutiesAndTaxesDefaults.duties = dutiesAndTaxesDefaults.duties ||
                getAssociatedOption(paymentOptions, {paymentType: PAYMENT_TYPES.RECEIVER_WILL_PAY});
        dutiesAndTaxesDefaults.taxes = dutiesAndTaxesDefaults.taxes || dutiesAndTaxesDefaults.duties;

        return dutiesAndTaxesDefaults;
    }

    function getDutiesAndTaxesContactDefaultValues(defaults, paymentOptions) {
        let dutiesAndTaxesDefaults = {};
        ['toContact', 'fromContact'].forEach((item) => {
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
            return options.find((item) => (selectedOption.key && selectedOption.key === item.key) ||
                (!selectedOption.key && selectedOption.paymentType === item.paymentType));
        }
    }

    function hasAccounts() {
        return paymentOptionsList && paymentOptionsList.some((item) => item.paymentType === PAYMENT_TYPES.DHL_ACCOUNT);
    }

    function isCreditCardPayment(payment) {
        return payment.paymentType === PAYMENT_TYPES.CREDIT_CARD;
    }

    function getPaymentProducts(countryId) {
        return $http.get(`/api/payment/list?country=${countryId}`)
            .then((response) => Array.isArray(response.data) ? response.data : $q.reject(response))
            .then((creditCards) => creditCards.map(attachCreditCardLabel))
            .catch((response) => {
                shipmentErrorService.processErrorCode(response);

                /** mock, to be removed */
                return [
                    {
                        paymentProductId: '1',
                        paymentProduct: 'visa',
                        img: '/etc/clientlibs/dhl/global/public/img/credit-cards/visa.png',
                        label: 'Visa'
                    },
                    {
                        paymentProductId: '2',
                        paymentProduct: 'maestro',
                        img: '/etc/clientlibs/dhl/global/public/img/credit-cards/maestro.png',
                        label: 'Maestro'
                    },
                    {
                        paymentProductId: '3',
                        paymentProduct: 'amex',
                        img: '/etc/clientlibs/dhl/global/public/img/credit-cards/amex.png',
                        label: 'American Express'
                    }
                ];
            });
    }

    function attachCreditCardLabel(card) {
        card.label = nlsService.getTranslationSync(`shipment.credit_card_${card.paymentProduct}`);
        return card;
    }

    function getCreditBuffer(countryId) {
        const url = `/api/payment/buffer?country=${countryId}`;

        return $http.get(url)
            .then((response) => response.data.buffer || $q.reject(response))
            .catch((response) => {
                shipmentErrorService.processErrorCode(response);

                /** mock, to be removed */
                return 20;
            });
    }

    return publicApi;
}
