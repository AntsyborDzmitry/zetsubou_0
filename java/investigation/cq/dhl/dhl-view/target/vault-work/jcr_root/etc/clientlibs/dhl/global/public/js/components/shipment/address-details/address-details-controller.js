define(['exports', 'module', 'angular', '../../../services/ewf-crud-service', '../../../services/user-service', '../../../services/modal/modal-service', '../../../services/location-service', './../../shipment/ewf-shipment-service', './address-details-service', './../../profile-shipment-defaults/services/profile-shipment-service', './../../../services/navigation-service', './../../shipment/ewf-shipment-step-base-controller'], function (exports, module, _angular, _servicesEwfCrudService, _servicesUserService, _servicesModalModalService, _servicesLocationService, _shipmentEwfShipmentService, _addressDetailsService, _profileShipmentDefaultsServicesProfileShipmentService, _servicesNavigationService, _shipmentEwfShipmentStepBaseController) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = AddressDetailsController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _angular2 = _interopRequireDefault(_angular);

    var _EwfShipmentStepBaseController = _interopRequireDefault(_shipmentEwfShipmentStepBaseController);

    AddressDetailsController.$inject = ['$q', '$scope', 'locationService', 'navigationService', 'modalService', 'nlsService', 'userService', 'ewfCrudService', 'shipmentService', 'addressDetailsService', 'profileShipmentService'];

    AddressDetailsController.prototype = new _EwfShipmentStepBaseController['default']('address-details');

    //TODO move functionality for get saving printers to shipment service, to avoid cross module dependencies

    function AddressDetailsController($q, $scope, locationService, navigationService, modalService, nlsService, userService, ewfCrudService, shipmentService, addressDetailsService, profileShipmentService) {
        var vm = this;

        Object.assign(vm, {
            onInit: onInit,
            onNextClick: onNextClick,
            onEditClick: onEditClick,
            clearAddressFrom: clearAddressFrom,
            clearAddressTo: clearAddressTo,
            normalizeAddress: normalizeAddress,
            swapAddresses: swapAddresses,
            checkImportAccountNumber: checkImportAccountNumber,
            showSaveContactDialog: showSaveContactDialog,
            updateContact: updateContact,
            addressBookSelected: addressBookSelected,
            getCurrentIncompleteData: getCurrentIncompleteData,
            typeaheadSelected: typeaheadSelected,
            redirectToHelpCenterPage: redirectToHelpCenterPage,
            loadShipmentData: loadShipmentData,

            FROM: 'from',
            safingShipment: false,
            TO: 'to',
            isAuthorized: false,
            saveFromConfirmed: false,
            saveToConfirmed: false,
            updateFromConfirmed: false,
            updateToConfirmed: false,

            fromContactFields: {},
            toContactFields: {},

            fromShowCreateButton: false,
            fromShowUpdateButton: false,
            toShowCreateButton: false,
            toShowUpdateButton: false
        });

        var modalWindow = undefined;

        var notifications = {
            emailNotifications: [{
                email: 'userSuccess@test.com',
                destination: 'userSuccess@test.com',
                language: 'en',
                phoneCountryCode: '',
                notificationEvents: {
                    pickedUpByCourier: false,
                    clearedCustoms: false,
                    deliveryDelay: false,
                    customsDelay: false,
                    delivered: false
                },
                type: 'EMAIL'
            }],
            smsNotifications: []
        };

        var immutableProperties = ['contactDetails', 'phoneDetails', 'countries', 'key', 'mailingListSetting', 'notificationSettings', 'paymentSetting', 'pickupSetting', 'shareSetting', 'shippingSetting'];

        var countries = [{ value: 'US', name: 'USA' }, { value: 'UA', name: 'Ukraine' }, { value: 'PL', name: 'Poland' }, { value: 'DE', name: 'Germany' }];

        var availableLocationsPromise = locationService.loadAvailableLocations();
        var RESIDENTAL_ADDRESS_TYPE = 'RESIDENTIAL';

        clearAddressFrom();
        clearAddressTo();

        function onInit() {
            userService.whoAmI().then(function (response) {
                if (response.groups[0] !== 'guest') {
                    vm.isAuthorized = true;
                }
            });

            $scope.$watch(function () {
                return vm.fromContactFields;
            }, function (newVal) {
                var empty = true;
                Object.keys(newVal).forEach(function (key) {
                    var fromProperty = newVal[key];
                    var fromPropertyNotBlank = fromProperty !== '' && typeof fromProperty !== 'undefined';
                    if (fromPropertyNotBlank && !immutableProperties.includes(key)) {
                        empty = false;
                    }
                });
                vm.fromShowCreateButton = !empty;
                vm.fromShowUpdateButton = vm.fromShowCreateButton && vm.fromContactFields.addressDetails && vm.fromContactFields.addressDetails.key;
                if (vm.fromShowUpdateButton) {
                    vm.updateFromConfirmed = false;
                }
            }, true);

            $scope.$watch(function () {
                return vm.toContactFields;
            }, function (newVal) {
                var empty = true;
                Object.keys(newVal).forEach(function (key) {
                    var toProperty = newVal[key];
                    var toPropertyNotBlank = toProperty !== '' && typeof toProperty !== 'undefined';
                    if (toPropertyNotBlank && !immutableProperties.includes(key)) {
                        empty = false;
                    }
                });
                vm.toShowCreateButton = !empty;
                vm.toShowUpdateButton = vm.toShowCreateButton && vm.toContactFields.addressDetails && vm.toContactFields.addressDetails.key;
                if (vm.toShowUpdateButton) {
                    vm.updateToConfirmed = false;
                }
            }, true);

            profileShipmentService.getDefaultSavingShipment().then(function (response) {
                vm.safingShipment = response.saveIncompleteSavings;
            });
        }

        function onNextClick(contactDetailsForm, ewfFormCtrl) {
            if (contactDetailsForm.$valid) {

                vm.addLineFrom = normalizeAddress(vm.fromContactFields.addressDetails.addrLine1);
                vm.addLineTo = normalizeAddress(vm.toContactFields.addressDetails.addrLine1);

                var contactKeys = {
                    fromContactKey: vm.fromContactFields.addressDetails.key || '00',
                    toContactKey: vm.toContactFields.addressDetails.key || '00'
                };
                shipmentService.setContactsKeys(contactKeys);
                shipmentService.setAddressDetails(vm.fromContactFields, vm.toContactFields);
                shipmentService.setPhoneDetails(vm.fromContactFields, vm.toContactFields);

                vm.nextCallback();
            } else {
                ewfFormCtrl.ewfValidation();
            }
        }

        function onEditClick() {
            vm.editCallback();
        }

        function clearAddressFrom() {
            vm.fromContactFields = {};
            vm.fromContactFields.countries = countries;
            vm.fromContactFields.phoneDetails = {};
        }

        function clearAddressTo() {
            vm.toContactFields = {};
            vm.toContactFields.countries = countries;
            vm.toContactFields.phoneDetails = {};
        }

        function normalizeAddress(address) {
            return address.name || address;
        }

        function swapAddresses() {
            var swapAddressesHandler = function swapAddressesHandler(countryCode) {
                if (!vm.fromContactFields.addressDetails.countryCode || !vm.toContactFields.addressDetails.countryCode) {
                    //TODO: show validation error for empty country here
                    return;
                }

                var toCountryCode = vm.toContactFields.addressDetails.countryCode.value ? vm.toContactFields.addressDetails.countryCode.value : vm.toContactFields.addressDetails.countryCode;

                if (countryCode === toCountryCode) {
                    swapAddressObjects();
                } else if (countryCode !== vm.toContactFields.addressDetails.countryCode) {
                    modalWindow = modalService.showDialog({
                        closeOnEsc: true,
                        scope: $scope,
                        windowClass: 'ngdialog-theme-default',
                        template: '<div ewf-modal nls-title=shipment.address_details_swap_dialog_title><p nls=shipment.address_details_swap_dialog_description></p><p nls=shipment.address_details_swap_dialog_enter_import_express_account></p><div class=row><div class=field-wrapper><input class=\"input input_width_full\" type=text ng-model=addressDetailsCtrl.importAccountNumber><div class=\"label-error ng-scope\" ng-if=addressDetailsCtrl.error>{{addressDetailsCtrl.error}}</div></div><label class=checkbox><input id=save_import_account_number class=checkbox__input name=\"favorite[\'receiver\']\" type=checkbox value=true data-aqa-id=save_import_account_number ng-model=addressDetailsCtrl.savingAccountNumberSelected> <span class=label nls=shipment.address_details_swap_dialog_save_account></span></label></div><button class=btn ng-click=addressDetailsCtrl.checkImportAccountNumber() nls=shipment.address_details_swap_dialog_go></button><h4 nls=shipment.address_details_swap_dialog_dont_have_account></h4><p><span nls=shipment.address_details_swap_dialog_contact></span> <a nls=shipment.address_details_swap_dialog_contact_us ng-click=addressDetailsCtrl.redirectToHelpCenterPage();></a> <span nls=shipment.address_details_swap_dialog_contact_learn_more></span></p></div>'
                    });
                }
            };

            userService.whoAmI().then(function (response) {
                swapAddressesHandler(response.countryCode2);
            });
        }

        function checkImportAccountNumber() {
            delete vm.error;
            var checkUserCanImport = addressDetailsService.checkUserCanImport(vm.toContactFields.addressDetails.countryCode.value, vm.fromContactFields.addressDetails.countryCode.value, vm.importAccountNumber);

            checkUserCanImport.then(function () {
                swapAddressObjects();
                saveAccountToUserProfile();
                modalWindow.close();
            })['catch'](function () {
                vm.error = nlsService.getTranslationSync('shipment.address_details_error_invalid_imp_account_number');
            });
        }

        function swapAddressObjects() {
            var tempContactFields = _angular2['default'].copy(vm.fromContactFields);
            vm.fromContactFields = _angular2['default'].copy(vm.toContactFields);
            vm.toContactFields = _angular2['default'].copy(tempContactFields);
        }

        function saveAccountToUserProfile() {
            if (vm.savingAccountNumberSelected) {
                addressDetailsService.saveAccountNumber(vm.importAccountNumber);
            }
        }

        function showSaveContactDialog(identifier) {
            switch (identifier) {
                case vm.FROM:
                    $scope.newContact = vm.fromContactFields;
                    break;
                case vm.TO:
                    $scope.newContact = vm.toContactFields;
                    break;
            }

            $scope.saveContact = saveContact;
            $scope.identifier = identifier;

            modalWindow = modalService.showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default',
                template: '<div ewf-modal><div class=\"row fw-bold\" nls=shipment.address_details_save_nickname></div><input type=text class=\"input input_width_full\" ng-model=nickname><div class=ewf-modal__footer><button type=button class=btn ng-click=\"saveContact(nickname, newContact, identifier)\" nls=shipment.address_details_save></button></div></div>'
            });
        }

        function saveContact(nickname, contactFields, identifier) {
            var contact = {
                contactDetails: {
                    addressDetails: {},
                    phoneDetails: {},
                    nickname: nickname
                },
                // TODO: ad-hoc solution. Should be rewised by product owner
                notifications: notifications
            };

            mapContactFields(contact, contactFields);

            ewfCrudService.addElement('/api/addressbook/contact/add', contact).then(function () {
                switch (identifier) {
                    case vm.FROM:
                        vm.fromNickname = nickname;
                        vm.saveFromConfirmed = true;
                        break;
                    case vm.TO:
                        vm.toNickname = nickname;
                        vm.saveToConfirmed = true;
                        break;
                }
                modalWindow.close();
            })['catch'](function () {
                validateAddressDetails();
                modalWindow.close();
            });
        }

        function updateContact(identifier) {
            switch (identifier) {
                case vm.FROM:
                    callUpdateContact(vm.fromContactFields, identifier);
                    break;
                case vm.TO:
                    callUpdateContact(vm.toContactFields, identifier);
                    break;
            }
        }

        function callUpdateContact(newContact, identifier) {
            var contact = {
                key: newContact.addressDetails.key,
                contactDetails: {
                    addressDetails: {},
                    phoneDetails: {},
                    nickname: newContact.nickname
                },
                // TODO: ad-hoc solution. Should be rewised by product owner
                notifications: notifications
            };

            mapContactFields(contact, newContact);

            ewfCrudService.updateElement('/api/addressbook/contact/modify', contact).then(function () {
                switch (identifier) {
                    case vm.FROM:
                        vm.updateFromConfirmed = true;
                        break;
                    case vm.TO:
                        vm.updateToConfirmed = true;
                        break;
                }
            })['catch'](function () {
                validateAddressDetails();
            });
        }

        function mapContactFields(contact, fields) {
            contact.contactDetails.name = fields.name;
            contact.contactDetails.company = fields.company;
            contact.contactDetails.email = fields.email;
            if (fields.phoneDetails) {
                contact.contactDetails.phoneDetails = {
                    fax: fields.phoneDetails.fax,
                    phone: fields.phoneDetails.phone,
                    phoneCountryCode: fields.phoneDetails.phoneCountryCode,
                    phoneExt: fields.phoneDetails.phoneExt,
                    phoneType: fields.phoneDetails.phoneType,
                    smsEnabled: fields.phoneDetails.smsEnabled
                };
            }

            contact.contactDetails.addressDetails = {
                addrLine1: fields.addressDetails.addrLine1,
                addrLine2: fields.addressDetails.addrLine2,
                addrLine3: fields.addressDetails.addrLine3,
                zipOrPostCode: fields.addressDetails.zipOrPostCode,
                city: fields.addressDetails.city,
                stateOrProvince: fields.addressDetails.stateOrProvince,
                residentialAddress: !!fields.addressDetails.residentialAddress,
                countryCode: getCountryCode(fields.addressDetails.countryCode)
            };
        }

        function validateAddressDetails() {
            //
            $scope.$broadcast('ValidateForm');
        }

        function getCountryCode(countryCodeField) {
            if (countryCodeField) {
                return countryCodeField.value ? countryCodeField.value : countryCodeField;
            }

            // Yes, it is hardcoded now.
            return 'US';
        }

        function fillForm(fields, item) {
            fields.email = item.email;
            fields.name = item.contactName;
            fields.company = item.companyName;
            fields.nickname = item.nickName;

            fillAddressDetails(fields, item);
            fillPhoneDetails(fields, item);
        }

        function fillPhoneDetails(fields, item) {
            fields.phoneDetails = {
                phoneCountryCode: item.phoneCountryCode,
                phoneType: item.phoneType,
                phone: item.phoneNumber,
                phoneExt: item.phoneExt,
                fax: item.fax,
                smsEnabled: item.smsEnabled
            };
        }

        function fillAddressDetails(fields, item) {
            fields.addressDetails = {
                key: item.key,
                city: item.city,
                addrLine1: item.address,
                addrLine2: item.address2,
                addrLine3: item.address3,
                stateOrProvince: item.stateOrProvince,
                zipOrPostCode: item.zipOrPostCode,
                countryCode: getCountryCode(item.countryCode),
                countryName: item.country,
                residentialAddress: getAddressType(item)
            };
        }

        function getAddressType(item) {
            if (_angular2['default'].isDefined(item.residentialAddress)) {
                return item.residentialAddress;
            }
            return item.addressType === RESIDENTAL_ADDRESS_TYPE;
        }

        function addressBookSelected(item, identificator) {
            switch (identificator) {
                case vm.FROM:
                    fillForm(vm.fromContactFields, item);
                    break;
                case vm.TO:
                    fillForm(vm.toContactFields, item);
                    break;
            }
        }

        function typeaheadSelected(item, identificator, addressCtrl) {
            //TODO: move to modal service
            addressCtrl.showPopup = false;
            var contactDetailPromise = ewfCrudService.getElementDetails('/api/addressbook/contact', item.key);
            $q.all([contactDetailPromise, availableLocationsPromise]).then(function (response) {
                var _response = _slicedToArray(response, 2);

                var contactDetailsResponse = _response[0];
                var availableLocationsResponse = _response[1];

                var contactDetails = mapFields(contactDetailsResponse.contactDetails, availableLocationsResponse);
                switch (identificator) {
                    case vm.FROM:
                        fillForm(vm.fromContactFields, contactDetails);
                        break;
                    case vm.TO:
                        fillForm(vm.toContactFields, contactDetails);
                        break;
                }
            });
        }

        function mapFields(contactDetails, availableLocations) {
            //TODO: remove after BE fixes contract
            var result = Object.assign({
                phoneNumber: contactDetails.phoneDetails.phone,
                address: contactDetails.addressDetails.addrLine1,
                address2: contactDetails.addressDetails.addrLine2,
                address3: contactDetails.addressDetails.addrLine3,
                contactName: contactDetails.name,
                companyName: contactDetails.company,
                nickName: contactDetails.nickname
            }, contactDetails, contactDetails.addressDetails, contactDetails.phoneDetails, contactDetails.taxDetails);

            var countryInfo = availableLocations.find(function (eachCountryInfo) {
                return eachCountryInfo.code2 === result.countryCode;
            });
            result.country = countryInfo && countryInfo.name;
            return result;
        }

        function getCurrentIncompleteData() {
            vm.fromContactFields.addressDetails = vm.fromContactFields.addressDetails || {};
            vm.toContactFields.addressDetails = vm.toContactFields.addressDetails || {};

            var contactKeys = {
                fromContactKey: vm.fromContactFields.addressDetails.key || '00',
                toContactKey: vm.toContactFields.addressDetails.key || '00'
            };

            if (vm.fromContactFields.addressDetails.addrLine1) {
                vm.addLineFrom = normalizeAddress(vm.fromContactFields.addressDetails.addrLine1);
            }
            if (vm.toContactFields.addressDetails.addrLine1) {
                vm.addLineTo = normalizeAddress(vm.toContactFields.addressDetails.addrLine1);
            }

            shipmentService.setContactsKeys(contactKeys);
            shipmentService.setAddressDetails(vm.fromContactFields, vm.toContactFields);
            shipmentService.setPhoneDetails(vm.fromContactFields, vm.toContactFields);
        }

        function redirectToHelpCenterPage() {
            navigationService.location('help-center.html');
        }

        function loadShipmentData(data) {
            Object.assign(vm.fromContactFields, shipmentService.getFromContactFields(data));
            Object.assign(vm.toContactFields, shipmentService.getToContactFields(data));

            vm.addLineFrom = vm.normalizeAddress(vm.fromContactFields.addressDetails.addrLine1);
            vm.addLineTo = vm.normalizeAddress(vm.toContactFields.addressDetails.addrLine1);
        }
    }
});
//# sourceMappingURL=address-details-controller.js.map
