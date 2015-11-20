define(['exports', 'module', 'ewf', './../ewf-shipment-step-base-controller', './shipment-type-service'], function (exports, module, _ewf, _ewfShipmentStepBaseController, _shipmentTypeService) {
    'use strict';

    module.exports = EwfShipmentTypeController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfShipmentStepBaseController = _interopRequireDefault(_ewfShipmentStepBaseController);

    EwfShipmentTypeController.$inject = ['userService', 'shipmentService', 'shipmentTypeService'];

    EwfShipmentTypeController.prototype = new _EwfShipmentStepBaseController['default']('shipment-type');

    _ewf2['default'].controller('EwfShipmentTypeController', EwfShipmentTypeController);

    function EwfShipmentTypeController(userService, shipmentService, shipmentTypeService) {
        var vm = this;

        var isStepPassable = false;
        var referenceType = {
            MANDATORY: 'MANDATORY',
            DEFAULT: 'DEFAULT',
            OPTIONAL: 'OPTIONAL',
            NEW: 'NEW'
        };

        Object.assign(vm, {
            onInit: onInit,
            onNextClick: onNextClick,
            onEditClick: onEditClick,
            updateShipmentType: updateShipmentType,
            updateCustomsInvoiceType: updateCustomsInvoiceType,
            isNextButtonVisible: isNextButtonVisible,
            isEnhancedCustomsInvoiceVisible: isEnhancedCustomsInvoiceVisible,
            addReference: addReference,
            removeReference: removeReference,
            pickReference: pickReference,
            onEdit: onEdit,
            referencesListVisible: referencesListVisible,
            isReferenceDisabled: isReferenceDisabled,
            isShippingPurposeEmpty: isShippingPurposeEmpty,
            getCurrentIncompleteData: getCurrentIncompleteData,
            loadShipmentData: loadShipmentData,

            isUserAuthorized: null,
            shipmentType: null,
            additionalReferences: [],
            toContactReferences: [],
            fromContactReferences: [],
            userProfileReferences: [],
            referenceListIsEmpty: true,
            referenceList: [],
            packages: {},
            customsInvoiceType: '',

            SHIPMENT_TYPE: {
                DOCUMENT: 'DOCUMENT',
                PACKAGE: 'PACKAGE'
            },
            CUSTOMS_INVOICE_TYPE: {
                CREATE: 'CREATE',
                USE: 'USE'
            },
            primaryReference: {
                name: '',
                type: referenceType.NEW
            }
        });

        var referenceGroup = {
            toContact: 'TO_CONTACT',
            fromContact: 'FROM_CONTACT',
            userProfile: 'USER_PROFILE'
        };

        var contactsKeys = undefined;

        function onInit() {
            vm.initialized = true;
            vm.isUserAuthorized = userService.isAuthorized();
            contactsKeys = shipmentService.getContactsKeys();

            if (vm.isUserAuthorized) {
                loadReferenceDetails(contactsKeys);
            } else {
                loadReferenceBehavior();
            }

            var fromCountry = shipmentService.getShipmentCountry();
            var toCountry = shipmentService.getDestinationCountry();

            shipmentTypeService.getShipmentParameters(fromCountry, toCountry).then(function (response) {
                shipmentService.setCountrySomParameters(response.shipperCountrySom, response.userProfileCountrySom, response.weightConvertionRate, response.dimensionConvertionRate, response.shipperCountryConversionPrecision, response.userProfileCountryConversionPrecision);
                shipmentService.setCurrencies(response.currencyList);

                isStepPassable = true;
            });
        }

        function loadReferenceBehavior() {
            var countryCode = shipmentService.getShipmentCountry();

            shipmentTypeService.getReferenceBehavior(countryCode).then(onGetReferenceBehavior)['catch'](onError);
        }

        function onGetReferenceBehavior(response) {
            vm.referenceBehavior = response.behavior;
        }

        function loadReferenceDetails(keys) {
            shipmentTypeService.getReferencesDetails(keys.fromContactKey, keys.toContactKey).then(onGetReferencesDetails)['catch'](onError);
        }

        function onGetReferencesDetails(response) {
            vm.primaryReference = {
                name: '',
                type: referenceType.NEW
            };
            vm.additionalReferences = [];
            vm.customReferenceCaption = response.customReferenceCaption;
            vm.referenceList = response.referenceList;
            if (response.referenceMandatory) {
                vm.referenceBehavior = 'mandatory';
            }
            if (response.lastShipmentReferenceList && response.lastShipmentReferenceList.length) {
                vm.primaryReference = response.lastShipmentReferenceList.shift();
                vm.additionalReferences = response.lastShipmentReferenceList.slice();
            } else if (response.referenceList && response.referenceList.length) {
                vm.toContactReferences = [];
                vm.fromContactReferences = [];
                vm.userProfileReferences = [];

                response.referenceList.forEach(function (item) {
                    if (item.group === referenceGroup.toContact) {
                        vm.toContactReferences.push(item);
                    }
                    if (item.group === referenceGroup.fromContact) {
                        vm.fromContactReferences.push(item);
                    }
                    if (item.group === referenceGroup.userProfile) {
                        vm.userProfileReferences.push(item);
                    }
                    var emptyReferenceList = !response.lastShipmentReferenceList;
                    if (emptyReferenceList && item.type === referenceType.DEFAULT) {
                        if (response.modificationRefused) {
                            item.type = referenceType.MANDATORY;
                        }
                        vm.additionalReferences.push(item);
                    }
                });
                vm.referenceListIsEmpty = false;
                vm.primaryReference = vm.additionalReferences.shift() || vm.primaryReference;
            }
        }

        function getPreparedReferences(primaryReference, additionalReferences) {
            var referenceRows = [primaryReference].concat(additionalReferences);

            var newReferences = referenceRows.filter(function (referenceFromRow) {
                return referenceFromRow.name;
            }).map(function (referenceFromRow) {
                return {
                    name: referenceFromRow.name,
                    group: referenceFromRow.group || 'USER_PROFILE',
                    type: referenceFromRow.type || 'NEW'
                };
            });

            return newReferences;
        }

        function setReferences() {
            var references = getPreparedReferences(vm.primaryReference, vm.additionalReferences);
            vm.updateShipmentType();
            shipmentService.setCustomsInvoice();
            shipmentService.setShipmentReferences(references);
        }

        function onError(error) {
            vm.error = error;
        }

        function isNextButtonVisible() {
            var isInvoiceTypeDefined = (vm.customsInvoiceType in vm.CUSTOMS_INVOICE_TYPE);

            return vm.shipmentType === vm.SHIPMENT_TYPE.DOCUMENT || vm.shipmentType === vm.SHIPMENT_TYPE.PACKAGE && isInvoiceTypeDefined;
        }

        function isEnhancedCustomsInvoiceVisible() {
            return vm.shipmentType === vm.SHIPMENT_TYPE.PACKAGE && vm.customsInvoiceType === vm.CUSTOMS_INVOICE_TYPE.CREATE;
        }

        function updateShipmentType() {
            var type = arguments.length <= 0 || arguments[0] === undefined ? vm.shipmentType : arguments[0];

            shipmentService.setShipmentType(type);
        }

        function updateCustomsInvoiceType(type) {
            shipmentService.setCustomsInvoiceType(type);
        }

        function onNextClick(form, ewfFormCtrl) {
            if (vm.shipmentType === vm.SHIPMENT_TYPE.DOCUMENT) {
                if (form.$valid && isStepPassable) {
                    setReferences();
                    vm.nextCallback();
                } else {
                    triggerFieldValidation(form);
                }
            }

            if (vm.shipmentType === vm.SHIPMENT_TYPE.PACKAGE) {
                if (form.$invalid && ewfFormCtrl.ewfValidation() || !isStepPassable) {
                    return;
                }
                vm.updateShipmentType();
                if (vm.customsInvoiceType === vm.CUSTOMS_INVOICE_TYPE.CREATE) {
                    setPackagesItemAttributes();
                } else {
                    shipmentService.setCustomsInvoice();
                    shipmentService.setItar(vm.itarCtrl.getItar());
                }
                vm.nextCallback();
            }
        }

        function getCurrentIncompleteData() {
            if (vm.shipmentType === vm.SHIPMENT_TYPE.DOCUMENT) {
                setReferences();
            }

            if (vm.shipmentType === vm.SHIPMENT_TYPE.PACKAGE) {
                vm.updateShipmentType();
                if (vm.customsInvoiceType === vm.CUSTOMS_INVOICE_TYPE.CREATE) {
                    setPackagesItemAttributes();
                } else {
                    shipmentService.setCustomsInvoice();
                    shipmentService.setItar(vm.itarCtrl.getItar());
                }
            }
        }

        function setPackagesItemAttributes() {
            if (!vm.itemAttrCtrl) {
                return;
            }

            var itemAttrFormCtrl = vm.itemAttrCtrl.itemAttrFormCtrl;

            vm.packages = {
                total: itemAttrFormCtrl.itemAttributesModel.totalDeclareValue,
                list: itemAttrFormCtrl.itemAttributesModel.productList
            };
            itemAttrFormCtrl.onNextClick();
            vm.itemAttrCtrl.onNextClick();
        }

        function onEditClick() {
            //@todo: validate
            vm.editCallback();
        }

        function onEdit() {
            var newContactKeys = shipmentService.getContactsKeys();
            var isUserAuthorized = userService.isAuthorized();
            if (isUserAuthorized) {
                if (newContactKeys !== contactsKeys) {
                    loadReferenceDetails(newContactKeys);
                }
            } else {
                loadReferenceBehavior();
            }
        }

        function addReference() {
            vm.additionalReferences.push({
                name: ''
            });
        }

        function removeReference(item) {
            var index = vm.additionalReferences.indexOf(item);
            if (index === -1) {
                return;
            }

            vm.additionalReferences.splice(index, 1);
        }

        function pickReference(row, ref) {
            row.name = ref.name;
        }

        function referencesListVisible(row) {
            if (vm.userProfileReferences.length || vm.fromContactReferences.length || vm.toContactReferences.length) {
                if (row) {
                    row.isReferencesListVisible = true;
                } else {
                    vm.isReferencesListVisibleForPrimary = true;
                }
            } else {
                if (row) {
                    row.isReferencesListVisible = false;
                }
                vm.isReferencesListVisibleForPrimary = false;
            }
        }

        function triggerFieldValidation(form) {
            form.$error.ewfValid.forEach(function (field) {
                field.$dirty = true;
                field.$setViewValue(field.$viewValue);
            });
        }

        function isReferenceDisabled() {
            return !!vm.primaryReference && vm.primaryReference.type === referenceType.MANDATORY;
        }

        function isShippingPurposeEmpty() {
            return vm.shipmentType === vm.SHIPMENT_TYPE.PACKAGE && vm.customsInvoiceType === vm.CUSTOMS_INVOICE_TYPE.CREATE && vm.itemAttrCtrl.shippingPurpose === '';
        }

        function loadShipmentData(data) {
            Object.assign(vm, shipmentService.getShipmentTypeData(data));
        }
    }
});
//# sourceMappingURL=ewf-shipment-type-controller.js.map
