import angular from 'angular';
import '../../../services/ewf-crud-service';
import '../../../services/user-service';
import '../../../services/modal/modal-service';
import '../../../services/location-service';
import './../../shipment/ewf-shipment-service';
import './address-details-service';
import './../../profile-shipment-defaults/services/profile-shipment-service';
import './../../../services/navigation-service';
import EwfShipmentStepBaseController from './../../shipment/ewf-shipment-step-base-controller';

AddressDetailsController.$inject = ['$q',
    '$scope',
    'locationService',
    'navigationService',
    'modalService',
    'nlsService',
    'userService',
    'ewfCrudService',
    'shipmentService',
    'addressDetailsService',
    'profileShipmentService'];

AddressDetailsController.prototype = new EwfShipmentStepBaseController('address-details');

//TODO move functionality for get saving printers to shipment service, to avoid cross module dependencies
export default function AddressDetailsController($q,
                                                 $scope,
                                                 locationService,
                                                 navigationService,
                                                 modalService,
                                                 nlsService,
                                                 userService,
                                                 ewfCrudService,
                                                 shipmentService,
                                                 addressDetailsService,
                                                 profileShipmentService) {
    const vm = this;

    Object.assign(vm, {
        onInit,
        onNextClick,
        onEditClick,
        clearAddressFrom,
        clearAddressTo,
        normalizeAddress,
        swapAddresses,
        checkImportAccountNumber,
        showSaveContactDialog,
        updateContact,
        addressBookSelected,
        getCurrentIncompleteData,
        typeaheadSelected,
        redirectToHelpCenterPage,
        loadShipmentData,

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

    let modalWindow;

    const notifications = {
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

    const immutableProperties = [
        'contactDetails',
        'phoneDetails',
        'countries',
        'key',
        'mailingListSetting',
        'notificationSettings',
        'paymentSetting',
        'pickupSetting',
        'shareSetting',
        'shippingSetting'
    ];

    const countries = [
        {value: 'US', name: 'USA'},
        {value: 'UA', name: 'Ukraine'},
        {value: 'PL', name: 'Poland'},
        {value: 'DE', name: 'Germany'}
    ];

    const availableLocationsPromise = locationService.loadAvailableLocations();
    const RESIDENTAL_ADDRESS_TYPE = 'RESIDENTIAL';

    clearAddressFrom();
    clearAddressTo();

    function onInit() {
        userService.whoAmI()
            .then((response) => {
                if (response.groups[0] !== 'guest') {
                    vm.isAuthorized = true;
                }
            });

        $scope.$watch(() => vm.fromContactFields, (newVal) => {
            let empty = true;
            Object.keys(newVal).forEach((key) => {
                const fromProperty = newVal[key];
                const fromPropertyNotBlank = (fromProperty !== '') && (typeof fromProperty !== 'undefined');
                if (fromPropertyNotBlank && (!immutableProperties.includes(key))) {
                    empty = false;
                }
            });
            vm.fromShowCreateButton = !empty;
            vm.fromShowUpdateButton = vm.fromShowCreateButton && vm.fromContactFields.addressDetails
                && vm.fromContactFields.addressDetails.key;
            if (vm.fromShowUpdateButton) {
                vm.updateFromConfirmed = false;
            }
        }, true);

        $scope.$watch(() => vm.toContactFields, (newVal) => {
            let empty = true;
            Object.keys(newVal).forEach((key) => {
                const toProperty = newVal[key];
                const toPropertyNotBlank = (toProperty !== '') && (typeof toProperty !== 'undefined');
                if (toPropertyNotBlank && (!immutableProperties.includes(key))) {
                    empty = false;
                }
            });
            vm.toShowCreateButton = !empty;
            vm.toShowUpdateButton = vm.toShowCreateButton && vm.toContactFields.addressDetails
                && vm.toContactFields.addressDetails.key;
            if (vm.toShowUpdateButton) {
                vm.updateToConfirmed = false;
            }
        }, true);


        profileShipmentService.getDefaultSavingShipment()
            .then((response) => {
                vm.safingShipment = response.saveIncompleteSavings;
            });
    }

    function onNextClick(contactDetailsForm, ewfFormCtrl) {
        if (contactDetailsForm.$valid) {

            vm.addLineFrom = normalizeAddress(vm.fromContactFields.addressDetails.addrLine1);
            vm.addLineTo = normalizeAddress(vm.toContactFields.addressDetails.addrLine1);

            const contactKeys = {
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
        const swapAddressesHandler = (countryCode) => {
            if (!vm.fromContactFields.addressDetails.countryCode || !vm.toContactFields.addressDetails.countryCode) {
                //TODO: show validation error for empty country here
                return;
            }

            const toCountryCode = vm.toContactFields.addressDetails.countryCode.value
                ? vm.toContactFields.addressDetails.countryCode.value
                : vm.toContactFields.addressDetails.countryCode;

            if (countryCode === toCountryCode) {
                swapAddressObjects();
            } else if (countryCode !== vm.toContactFields.addressDetails.countryCode) {
                modalWindow = modalService.showDialog({
                    closeOnEsc: true,
                    scope: $scope,
                    windowClass: 'ngdialog-theme-default',
                    templateUrl: 'address-details-swap-dialog-layout.html'
                });
            }
        };

        userService.whoAmI()
            .then((response) => {
                swapAddressesHandler(response.countryCode2);
            });
    }

    function checkImportAccountNumber() {
        delete vm.error;
        const checkUserCanImport = addressDetailsService
            .checkUserCanImport(vm.toContactFields.addressDetails.countryCode.value,
                vm.fromContactFields.addressDetails.countryCode.value,
                vm.importAccountNumber);

        checkUserCanImport
            .then(() => {
                swapAddressObjects();
                saveAccountToUserProfile();
                modalWindow.close();
            })
            .catch(() => {
                vm.error = nlsService.getTranslationSync('shipment.address_details_error_invalid_imp_account_number');
            });

    }

    function swapAddressObjects() {
        const tempContactFields = angular.copy(vm.fromContactFields);
        vm.fromContactFields = angular.copy(vm.toContactFields);
        vm.toContactFields = angular.copy(tempContactFields);
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
            templateUrl: 'address-details-save-contact-dialog-layout.html'
        });
    }

    function saveContact(nickname, contactFields, identifier) {
        const contact = {
            contactDetails: {
                addressDetails: {},
                phoneDetails: {},
                nickname
            },
            // TODO: ad-hoc solution. Should be rewised by product owner
            notifications
        };

        mapContactFields(contact, contactFields);

        ewfCrudService.addElement('/api/addressbook/contact/add', contact)
            .then(() => {
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
            })
            .catch(() => {
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
        const contact = {
            key: newContact.addressDetails.key,
            contactDetails: {
                addressDetails: {},
                phoneDetails: {},
                nickname: newContact.nickname
            },
            // TODO: ad-hoc solution. Should be rewised by product owner
            notifications
        };

        mapContactFields(contact, newContact);

        ewfCrudService.updateElement('/api/addressbook/contact/modify', contact)
            .then(() => {
                switch (identifier) {
                    case vm.FROM:
                        vm.updateFromConfirmed = true;
                        break;
                    case vm.TO:
                        vm.updateToConfirmed = true;
                        break;
                }

            })
            .catch(() => {
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
        if (angular.isDefined(item.residentialAddress)) {
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
        const contactDetailPromise = ewfCrudService.getElementDetails('/api/addressbook/contact', item.key);
        $q.all([contactDetailPromise, availableLocationsPromise])
            .then((response) => {
                const [contactDetailsResponse, availableLocationsResponse] = response;
                const contactDetails = mapFields(contactDetailsResponse.contactDetails, availableLocationsResponse);
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
        const result = Object.assign(
            {
                phoneNumber: contactDetails.phoneDetails.phone,
                address: contactDetails.addressDetails.addrLine1,
                address2: contactDetails.addressDetails.addrLine2,
                address3: contactDetails.addressDetails.addrLine3,
                contactName: contactDetails.name,
                companyName: contactDetails.company,
                nickName: contactDetails.nickname
            },
            contactDetails,
            contactDetails.addressDetails,
            contactDetails.phoneDetails,
            contactDetails.taxDetails
        );

        const countryInfo = availableLocations
            .find((eachCountryInfo) => eachCountryInfo.code2 === result.countryCode);
        result.country = countryInfo && countryInfo.name;
        return result;
    }

    function getCurrentIncompleteData() {
        vm.fromContactFields.addressDetails = vm.fromContactFields.addressDetails || {};
        vm.toContactFields.addressDetails = vm.toContactFields.addressDetails || {};

        const contactKeys = {
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
