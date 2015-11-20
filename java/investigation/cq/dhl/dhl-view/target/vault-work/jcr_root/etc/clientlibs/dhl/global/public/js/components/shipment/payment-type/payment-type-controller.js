define(['exports', 'module', 'services/rule-service', './payment-type-service', '../ewf-shipment-step-base-controller'], function (exports, module, _servicesRuleService, _paymentTypeService, _ewfShipmentStepBaseController) {
    'use strict';

    module.exports = PaymentTypeController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _EwfShipmentStepBaseController = _interopRequireDefault(_ewfShipmentStepBaseController);

    PaymentTypeController.$inject = ['$q', '$timeout', 'logService', 'nlsService', 'userService', 'shipmentService', 'paymentTypeService', 'ruleService'];

    PaymentTypeController.prototype = new _EwfShipmentStepBaseController['default']('payment-details');

    function PaymentTypeController($q, $timeout, logService, nlsService, userService, shipmentService, paymentTypeService, ruleService) {
        var vm = this;

        var shipmentContactIdsFiltered = {};

        var PAYMENT_DETAILS_FIELDS = {
            QUOTATION: 'quotationType',
            TRANSPORTATION: 'transportationPaymentType',
            DUTIES: 'dutiesPaymentType',
            TAXES: 'taxesPaymentType',
            INCOTERM: 'incoterm'
        };

        var paymentDetailsCache = {};

        Object.assign(vm, {
            LOADING_OPTION: {
                name: 'common.loading_message'
            },

            PAYMENT_TYPES: paymentTypeService.PAYMENT_TYPES,

            onInit: onInit,
            onEdit: onEdit,
            onNextClick: onNextClick,
            onEditClick: onEditClick,
            clearError: clearError,
            isErrorOnType: isErrorOnType,
            resolvePaymentTypeName: resolvePaymentTypeName,
            howPayCheckboxChanged: howPayCheckboxChanged,
            validateAlternateDhlAccount: validateAlternateDhlAccount,
            onAlternateDhlAccountFocus: onAlternateDhlAccountFocus,
            onAssociationCheckboxChanged: onAssociationCheckboxChanged,
            isTransportationShown: isTransportationShown,
            isDutiesAndTaxesShown: isDutiesAndTaxesShown,
            isPaymentTypeAlternateAccountShown: isPaymentTypeAlternateAccountShown,
            getDutiesAndTaxesLabel: getDutiesAndTaxesLabel,
            onQuotationTypeSelectorChanged: onDropdownSelectorChanged.bind(vm, PAYMENT_DETAILS_FIELDS.QUOTATION),
            onTransportationPaymentTypeSelectorChanged: onDropdownSelectorChanged.bind(vm, PAYMENT_DETAILS_FIELDS.TRANSPORTATION),
            onDutiesPaymentTypeSelectorChanged: onDropdownSelectorChanged.bind(vm, PAYMENT_DETAILS_FIELDS.DUTIES),
            onTaxesPaymentTypeSelectorChanged: onDropdownSelectorChanged.bind(vm, PAYMENT_DETAILS_FIELDS.TAXES),
            isIncotermShown: isIncotermShown,
            resolveIncotermName: resolveIncotermName,
            getCurrentIncompleteData: getCurrentIncompleteData,
            isCreditCardPayment: isCreditCardPayment,
            loadShipmentData: loadShipmentData,
            isQuotationTypeShown: isQuotationTypeShown,

            paymentAccounts: {
                shippers: [],
                others: []
            },
            quotationType: '',
            transportationPaymentType: '',
            dutiesPaymentType: '',
            taxesPaymentType: '',
            paymentTypesErrors: {},
            checkedForTransportationCharges: true,
            alternateDhlAccount: {
                accountNumber: '',
                valid: true
            },
            dutiesAlternateDhlAccount: {
                accountNumber: '',
                valid: true
            },
            taxesAlternateDhlAccount: {
                accountNumber: '',
                valid: true
            },
            pendingValidation: false,
            checkedForPaymentAssociation: false,
            splitDutyAndTaxPayment: false,
            incoterm: '',
            isPaymentSplitterShown: false,
            formName: 'paymentType',
            shipmentType: ''
        });

        function onInit() {
            nlsService.getDictionary('common');
        }

        function onEdit() {
            vm.shipmentCountry = shipmentService.getShipmentCountry();
            vm.paymentTypesErrors = {};
            vm.pendingPaymentTypes = true;

            ruleService.acquireRulesForFormFields(vm.formName, vm.shipmentCountry).then(processRules);

            if (userService.isAuthorized()) {
                getContacts();
                if (vm.associateWithContacts.length && !vm.associateWithContacts.includes(vm.associatedContact)) {
                    vm.associatedContact = vm.associateWithContacts[0];
                }
            }

            vm.isDefaultIncotermSet = $q.defer();

            setPaymentValuesToCache();
            getShipmentType();
            getPaymentTypeList(shipmentContactIdsFiltered);
            if (vm.isIncotermShown()) {
                getIncotermsList();
            }
            validateAlternateAccounts();
        }

        function processRules(rules) {
            if (rules.splitDutyAndTaxPayment) {
                vm.isPaymentSplitterShown = rules.splitDutyAndTaxPayment.props.visible;
            }
        }

        function getContacts() {
            // Renew existed contacts from address details step
            vm.associateWithContacts = [];

            var shipmentContacts = shipmentService.getContactsKeys();
            if (shipmentContacts.toContactKey !== '00') {
                shipmentContactIdsFiltered.toContactKey = shipmentContacts.toContactKey;
                var contact = {
                    id: shipmentContacts.toContactKey,
                    name: nlsService.getTranslationSync('shipment.payment_type_ship_to_address')
                };
                vm.associateWithContacts.push(contact);
            }
            if (shipmentContacts.fromContactKey !== '00') {
                shipmentContactIdsFiltered.fromContactKey = shipmentContacts.fromContactKey;
                var contact = {
                    id: shipmentContacts.fromContactKey,
                    name: nlsService.getTranslationSync('shipment.payment_type_ship_from_address')
                };
                vm.associateWithContacts.push(contact);
            }
        }

        function getPaymentTypeList(keys) {
            var filterDutiesAndTaxes = vm.isDutiesAndTaxesShown();
            vm.paymentAccounts.others = [vm.LOADING_OPTION];
            vm.paymentAccounts.shippers = [];
            vm.paymentAccounts.duties = [vm.LOADING_OPTION];

            paymentTypeService.getPaymentTypeList(vm.shipmentCountry, keys, vm.shipmentType, filterDutiesAndTaxes).then(processPaymentTypeData).then(setPaymentTypeOptionsToModel);
        }

        function processPaymentTypeData(data) {
            filterPaymentTypeList(data.paymentOptions);
            if (data.defaults) {
                filterDefaultValues(data.defaults);
            }
        }

        function filterPaymentTypeList(list) {
            var shippers = [];
            vm.paymentAccounts.others = [];
            vm.paymentAccounts.shippers = [];
            vm.paymentAccounts.duties = [];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    if (item.paymentType !== vm.PAYMENT_TYPES.RECEIVER_WILL_PAY) {
                        if (item.shipper) {
                            shippers.push(item);
                        } else {
                            vm.paymentAccounts.others.push(item);
                        }
                    }
                    fillDutiesPaymentTypeList(item);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (shippers.length === 1) {
                vm.paymentAccounts.others.unshift(shippers[0]);
            } else if (shippers.length) {
                vm.paymentAccounts.shippers = shippers;
            }
        }

        function fillDutiesPaymentTypeList(item) {
            if (item.paymentType === vm.PAYMENT_TYPES.RECEIVER_WILL_PAY) {
                vm.paymentAccounts.duties.unshift(item);
            } else if (item.paymentType === vm.PAYMENT_TYPES.DHL_ACCOUNT || item.paymentType === vm.PAYMENT_TYPES.ALTERNATE_DHLACCOUNT) {
                vm.paymentAccounts.duties.push(item);
            }
        }

        function filterDefaultValues(defaults) {
            vm.dutiesDefaultOption = defaults.duties;
            vm.taxesDefaultOption = defaults.taxes;
        }

        function getShipmentType() {
            var destinationCountry = shipmentService.getDestinationCountry();
            var profileCountry = userService.getUserCountry();

            if (profileCountry !== vm.shipmentCountry && profileCountry !== destinationCountry) {
                return;
            }

            if (vm.shipmentCountry === destinationCountry) {
                vm.shipmentType = paymentTypeService.SHIPMENT_TYPES.DOMESTIC;
                return;
            }

            vm.shipmentType = profileCountry === vm.shipmentCountry ? paymentTypeService.SHIPMENT_TYPES.EXPORT : paymentTypeService.SHIPMENT_TYPES.IMPORT;
        }

        function setPaymentTypeOptionsToModel() {
            setPaymentDetailsOption(PAYMENT_DETAILS_FIELDS.QUOTATION, vm.paymentAccounts.shippers);
            setPaymentDetailsOption(PAYMENT_DETAILS_FIELDS.TRANSPORTATION, vm.paymentAccounts.others);

            if (vm.isDutiesAndTaxesShown()) {
                setDutiesAndTaxesOptions();
            }
            vm.pendingPaymentTypes = false;
        }

        function setDutiesAndTaxesOptions() {
            if (paymentDetailsCache.dutiesPaymentType) {
                setPaymentDetailsOption(PAYMENT_DETAILS_FIELDS.DUTIES, vm.paymentAccounts.duties);
            } else {
                vm.dutiesPaymentType = vm.dutiesDefaultOption;
            }

            if (vm.splitDutyAndTaxPayment) {
                setPaymentDetailsOption(PAYMENT_DETAILS_FIELDS.TAXES, vm.paymentAccounts.duties);
            } else {
                vm.taxesPaymentType = vm.taxesDefaultOption;
            }

            if (vm.isDefaultIncotermSet) {
                vm.isDefaultIncotermSet.resolve();
            }
        }

        function setPaymentDetailsOption(option, types) {
            if (paymentDetailsCache[option]) {
                vm[option] = option === PAYMENT_DETAILS_FIELDS.INCOTERM ? findIncotermOption(paymentDetailsCache[option]) : paymentTypeService.getAssociatedOption(types, paymentDetailsCache[option]);
                if (!vm[option]) {
                    if (option === PAYMENT_DETAILS_FIELDS.DUTIES) {
                        vm[option] = vm.dutiesDefaultOption;
                    } else if (option === PAYMENT_DETAILS_FIELDS.TAXES) {
                        vm[option] = vm.taxesDefaultOption;
                    }
                }
                if (vm[option]) {
                    callAccountValidator(option);
                }
            }
        }

        function onDropdownSelectorChanged(type) {
            if (vm[type] === vm.LOADING_OPTION) {
                vm[type] = '';
                return;
            }
            callAccountValidator(type);

            if ((type === PAYMENT_DETAILS_FIELDS.DUTIES || type === PAYMENT_DETAILS_FIELDS.TAXES) && vm.isIncotermShown()) {
                setIncotermByDutiesAndTaxesOption();
            }
        }

        function callAccountValidator(type) {
            if (type !== PAYMENT_DETAILS_FIELDS.INCOTERM && vm.paymentTypeForm[type]) {
                validateAccount(vm[type], vm.paymentTypeForm[type]);
            }
        }

        function validateAlternateAccounts() {
            if (vm.alternateDhlAccount.accountNumber) {
                validateAlternateDhlAccount(vm.alternateDhlAccount, vm.paymentTypeForm.payAccountNumber);
            }

            if (vm.dutiesAlternateDhlAccount.accountNumber && isDutiesAndTaxesShown()) {
                validateAlternateDhlAccount(vm.dutiesAlternateDhlAccount, vm.paymentTypeForm.dutiesAccountNumber);
            }

            if (vm.taxesAlternateDhlAccount.accountNumber && isDutiesAndTaxesShown()) {
                validateAlternateDhlAccount(vm.taxesAlternateDhlAccount, vm.paymentTypeForm.taxesAccountNumber);
            }
        }

        function getIncotermsList() {
            vm.incoterms = [vm.LOADING_OPTION];
            vm.pendingIncoterms = true;

            paymentTypeService.getIncoterms(vm.shipmentCountry).then(processIncotermsData);
        }

        function processIncotermsData(data) {
            vm.incoterms = data.incoterms;
            if (data.defaultIncotermCode) {
                vm.defaultIncoterm = findIncotermOption({ code: data.defaultIncotermCode });
            }
            setIncotermOptionToModel();
        }

        function setIncotermOptionToModel() {
            if (vm.incoterm) {
                setPaymentDetailsOption(PAYMENT_DETAILS_FIELDS.INCOTERM, vm.incoterms);
            }

            if (!vm.incoterm) {
                getIncotermValue();
            }
        }

        function getIncotermValue() {
            if (vm.defaultIncoterm) {
                vm.incoterm = vm.defaultIncoterm;
            } else {
                vm.isDefaultIncotermSet.promise.then(setIncotermByDutiesAndTaxesOption);
            }
        }

        function setIncotermByDutiesAndTaxesOption() {
            var data = {
                dutiesTypeSelected: vm.dutiesPaymentType,
                taxesTypeSelected: vm.taxesPaymentType,
                splitDutiesAndTaxes: vm.splitDutyAndTaxPayment
            };
            var defaultVal = paymentTypeService.getIncotermDefaultValueForDutiesAndTaxes(data);
            if (defaultVal) {
                vm.incoterm = findIncotermOption(defaultVal) || vm.incoterm;
            }
        }

        function findIncotermOption(selectedIncoterm) {
            return vm.incoterms.find(function (item) {
                return selectedIncoterm.code === item.code;
            });
        }

        function resolvePaymentTypeName(option) {
            var markDefault = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var name = undefined;
            if (option.paymentType === vm.PAYMENT_TYPES.DHL_ACCOUNT) {
                name = option.name ? option.name + ' ' + option.accountNumber : option.accountNumber;
            } else {
                name = nlsService.getTranslationSync(option.name);
            }
            option.title = name;

            if (markDefault && angular.equals(vm.dutiesDefaultOption, option)) {
                name = name + ' (default)';
            }
            return name;
        }

        function resolveIncotermName(option) {
            if (option.code) {
                var _name = option.code.toLowerCase();
                var description = nlsService.getTranslationSync('shipment.payment_type_incoterm_' + _name);
                return option.code + ' - ' + description;
            }
        }

        function onNextClick(form) {
            if (vm.pendingPaymentTypes) {
                clearPaymentsTypeSelection();
                triggerFormValidation(form);
            }
            vm.nextStepDeferred = $q.defer();
            vm.nextStepDeferred.promise.then(function () {
                triggerFormValidation(form);
                if (form.$valid) {
                    vm.nextCallback();
                    vm.clearError();
                    if (!isTransportationShown()) {
                        vm.transportationPaymentType = vm.quotationType;
                    }
                    if (!isQuotationTypeShown()) {
                        vm.quotationType = vm.transportationPaymentType;
                    }
                    setPaymentInfoToShipmentService();
                    clearUnusedFieldsContent();
                    if (isIncotermShown()) {
                        setIncotermToShipmentService();
                    }
                }
            });

            if (!vm.pendingValidation && !vm.pendingPaymentTypes) {
                vm.nextStepDeferred.resolve();
            }
        }

        function getCurrentIncompleteData() {
            if (!isTransportationShown()) {
                vm.transportationPaymentType = vm.quotationType;
            }
            setPaymentInfoToShipmentService();
            clearUnusedFieldsContent();
            if (isIncotermShown()) {
                setIncotermToShipmentService();
            }
        }

        function validateAccount(type, field) {
            if (type && type.paymentType === vm.PAYMENT_TYPES.DHL_ACCOUNT) {
                vm.pendingValidation = true;
                paymentTypeService.validatePaymentAccount(type, vm.shipmentType).then(function () {
                    onValidationSuccess(type);
                })['catch'](function (errorCode) {
                    onValidationError(errorCode, type);
                })['finally'](function () {
                    triggerFieldValidation(field, true);
                });
            } else {
                triggerFieldValidation(field, true);
            }
        }

        function onValidationSuccess(type) {
            if (vm.paymentTypesErrors[type.title]) {
                vm.paymentTypesErrors[type.title] = false;
            }
        }

        function onValidationError(errorCode, type) {
            vm.paymentTypesErrors[type.title] = errorCode;
        }

        function clearError() {
            vm.paymentTypesErrors = {};
        }

        function validateAlternateDhlAccount(dhlAccount, field) {
            markAlternateDhlAccountValid(dhlAccount);
            if (dhlAccount.accountNumber === '') {
                triggerFieldValidation(field, true);
                return;
            }
            var type = {
                paymentType: vm.PAYMENT_TYPES.ALTERNATE_DHLACCOUNT,
                accountNumber: dhlAccount.accountNumber
            };
            vm.pendingValidation = true;
            paymentTypeService.validatePaymentAccount(type, vm.shipmentType).then(function () {
                markAlternateDhlAccountValid(dhlAccount);
            })['catch'](function (errorCode) {
                onValidationDhlAccountError(dhlAccount, errorCode);
            })['finally'](function () {
                triggerFieldValidation(field, true);
            });
        }

        function onAlternateDhlAccountFocus() {
            vm.pendingValidation = true;
        }

        function triggerFieldValidation(field) {
            var withTimeout = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            if (withTimeout) {
                $timeout(fieldValidation);
            } else {
                fieldValidation();
            }

            function fieldValidation() {
                field.$dirty = true;
                field.$setViewValue(field.$viewValue);
                vm.pendingValidation = false;
                if (vm.nextStepDeferred) {
                    vm.nextStepDeferred.resolve();
                }
            }
        }

        function triggerFormValidation(form) {
            Object.keys(form).forEach(function (key) {
                if (form[key].$setViewValue) {
                    triggerFieldValidation(form[key]);
                }
            });
        }

        function markAlternateDhlAccountValid(dhlAccount) {
            dhlAccount.valid = true;
            dhlAccount.message = '';
        }

        function onValidationDhlAccountError(dhlAccount, errorCode) {
            dhlAccount.valid = false;
            dhlAccount.message = errorCode;
        }

        function onEditClick() {
            //@todo: validate
            vm.editCallback();
        }

        function isErrorOnType(type) {
            return type ? !!vm.paymentTypesErrors[type.title] : false;
        }

        function howPayCheckboxChanged() {
            vm.showOthers = !vm.checkedForTransportationCharges;
        }

        function onAssociationCheckboxChanged() {
            if (vm.checkedForPaymentAssociation) {
                shipmentService.setAssociateWithContactId(vm.associatedContact.id);
            }
        }

        function setPaymentInfoToShipmentService() {
            var data = {
                transportationPaymentType: vm.transportationPaymentType.paymentType,
                transportationPaymentAccountNumber: getAccountFromPaymentType(vm.transportationPaymentType),
                quotationType: vm.quotationType.paymentType,
                quotationAccountNumber: getAccountFromPaymentType(vm.quotationType),
                splitDutyAndTaxPayment: vm.splitDutyAndTaxPayment,
                dutiesPaymentType: vm.dutiesPaymentType.paymentType,
                dutiesPaymentAccountNumber: getAccountFromPaymentType(vm.dutiesPaymentType, true),
                taxesPaymentType: null,
                taxesPaymentAccountNumber: null
            };

            if (data.splitDutyAndTaxPayment) {
                data.taxesPaymentType = vm.taxesPaymentType.paymentType;
                data.taxesPaymentAccountNumber = getAccountFromPaymentType(vm.taxesPaymentType, false, true);
            }

            shipmentService.setPaymentInfo(data);
        }

        function getAccountFromPaymentType(type) {
            var duties = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var taxes = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var account = '';
            if (type.paymentType === vm.PAYMENT_TYPES.DHL_ACCOUNT) {
                account = type.accountId;
            } else if (type.paymentType === vm.PAYMENT_TYPES.ALTERNATE_DHLACCOUNT) {
                if (duties) {
                    type.accountNumber = vm.dutiesAlternateDhlAccount.accountNumber;
                } else if (taxes) {
                    type.accountNumber = vm.taxesAlternateDhlAccount.accountNumber;
                } else {
                    type.accountNumber = vm.alternateDhlAccount.accountNumber;
                }
                account = type.accountNumber;
            }
            return account;
        }

        function isTransportationShown() {
            return vm.showOthers || !vm.paymentAccounts.shippers.length;
        }

        function isDutiesAndTaxesShown() {
            return shipmentService.isPackage();
        }

        function isPaymentTypeAlternateAccountShown(paymentType) {
            var propName = paymentType + 'PaymentType';

            return !!(vm[propName] && vm[propName].paymentType === vm.PAYMENT_TYPES.ALTERNATE_DHLACCOUNT);
        }

        function getDutiesAndTaxesLabel() {
            return 'shipment.' + (vm.splitDutyAndTaxPayment ? 'payment_type_duties_title' : 'payment_type_duties_and_taxes_title');
        }

        function clearUnusedFieldsContent() {
            if (!vm.splitDutyAndTaxPayment) {
                vm.taxesPaymentType = paymentTypeService.getAssociatedOption(vm.paymentAccounts.duties, vm.taxesDefaultOption);
            }

            if (vm.dutiesPaymentType.paymentType !== vm.PAYMENT_TYPES.ALTERNATE_DHLACCOUNT) {
                vm.dutiesAlternateDhlAccount.accountNumber = '';
            }

            if (!vm.splitDutyAndTaxPayment || vm.taxesPaymentType.paymentType !== vm.PAYMENT_TYPES.ALTERNATE_DHLACCOUNT) {
                vm.taxesAlternateDhlAccount.accountNumber = '';
            }
        }

        function clearPaymentsTypeSelection() {
            Object.keys(PAYMENT_DETAILS_FIELDS).forEach(function (key) {
                var type = PAYMENT_DETAILS_FIELDS[key];
                if (type !== PAYMENT_DETAILS_FIELDS.INCOTERM) {
                    vm[type] = '';
                }
            });
        }

        function setPaymentValuesToCache() {
            Object.keys(PAYMENT_DETAILS_FIELDS).forEach(function (key) {
                var type = PAYMENT_DETAILS_FIELDS[key];
                paymentDetailsCache[type] = vm[type];
            });
        }

        function isIncotermShown() {
            return shipmentService.isShipmentWithInvoice();
        }

        function setIncotermToShipmentService() {
            shipmentService.setIncoterm(vm.incoterm.code);
        }

        function isCreditCardPayment() {
            return vm.transportationPaymentType && paymentTypeService.isCreditCardPayment(vm.transportationPaymentType);
        }

        function loadShipmentData(data) {
            Object.assign(vm, shipmentService.getPaymentTypeModelData(data));
        }

        function isQuotationTypeShown() {
            return vm.paymentAccounts.shippers && vm.paymentAccounts.shippers.length > 1;
        }
    }
});
//# sourceMappingURL=payment-type-controller.js.map
