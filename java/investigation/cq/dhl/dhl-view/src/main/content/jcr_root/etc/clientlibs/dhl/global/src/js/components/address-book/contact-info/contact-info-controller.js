import './../../../services/ewf-crud-service';
import './contact-payment-info/contact-payment-info-controller';
import './../../../directives/ewf-input/ewf-input-directive';
import './../../../directives/ewf-form/ewf-form-directive';
import './../../../services/confirmation/confirmation-dialog-service';
import './../../../services/navigation-service';
import './../../../services/user-service';
import './../../../constants/system-settings-constants';
import angular from 'angular';

ContactInfoController.$inject = [
    '$scope',
    '$q',
    '$attrs',
    '$timeout',
    '$window',
    'navigationService',
    'ewfCrudService',
    'confirmationDialogService',
    'nlsService',
    'systemSettings',
    'userService'
];

export default function ContactInfoController(
    $scope,
    $q,
    $attrs,
    $timeout,
    $window,
    navigationService,
    ewfCrudService,
    confirmationDialogService,
    nlsService,
    systemSettings,
    userService
) {
    const vm = this;

    const titleOptions = [
        {name: '', value: 'TITLE'},
        {name: 'Mr', value: 'Mr'},
        {name: 'Mrs', value: 'Mrs'},
        {name: 'Ms', value: 'Ms'},
        {name: 'Dr', value: 'Dr'}
    ];

    Object.assign(vm, {
        profileUpdated: false,
        disableSubmitButton: false,
        cpfCnpjLength: 0,
        emails: [],
        contact: {
            pickupSetting: {},
            paymentSetting: {},
            notificationSettings: [],
            notifications: {
                smsNotifications: [],
                emailNotifications: []
            },
            shippingSetting: {},
            mailingListSetting: {
                selectedMailingLists: ['']
            },
            contactDetails: {
                addressDetails: {
                    residentialAddress: false
                },
                phoneDetails: {},
                taxDetails: {
                    cnpjOrCPFTaxType: ''
                },
                titleOptions
            }
        },
        defaultNotificationEmail: '',

        contactInfoAction,
        confirmOfUnsavedData,
        initEmailsArray,
        convertEmailsArrayToEmailFields,
        addUserEmail,
        removeUserEmail,
        showBottomAddEmailButton,
        checkCpfCnpjLength,
        isAdditionalEmailsCorrect,
        countrySpecificBehaviorBr,
        submitContactInfo
    });

    const EMPTY_EMAIL = '';
    const MIN_EMAIL_NUMBER = 0;
    const MAX_EMAIL_NUMBER = 4;
    const emailFields = [
        {name: 'email2'},
        {name: 'email3'},
        {name: 'email4'},
        {name: 'email5'}
    ];

    const cnpjMaxLength = 15;
    const cpfMaxLength = 11;

    //TODO remove this and switch to pattern service
    vm.patterns = {
        emailRegExp: '^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$',
        numeric: '^(\\s*|\\d+)$',
        alphaNumeric: '^[a-z\\d\\-_\\s]+$',
        numericSpecialChars: '^[0-9\\+]*$'
    };

    const defaultNotificationSetting = {
        destination: '',
        email: '',
        language: 'en',
        notificationEvents: {
            deliveryDelay: false,
            clearedCustoms: false,
            customsDelay: false,
            delivered: false,
            pickedUpByCourier: false
        },
        phoneCountryCode: null,
        type: 'EMAIL'
    };

    const mode = navigationService.getParamFromUrl('mode');
    const contactId = navigationService.getParamFromUrl('key');

    const isProfileMode = !!$attrs.isProfile;
    const isCopyMode = mode === 'copy';
    const isModifyMode = contactId !== undefined && contactId.length > 0;

    let promise;
    let countries;

    if (isCopyMode || isModifyMode) {
        retrieveUserEmail(userService.whoAmI());
        promise = ewfCrudService.getElementDetails('/api/addressbook/contact', contactId);
    } else if (isProfileMode) {
        promise = ewfCrudService.getElementDetails('/api/myprofile/contact', '');
    } else {
        addDefaultNotificationSettings(userService.whoAmI());
    }

    if (promise) {
        promise.then(init, errorHandler);
    } else {
        nlsService.getTranslation('address-book.addNewContact_title')
            .then((translation) => vm.contactInfoTitle = translation);
    }

    function retrieveUserEmail(whoAmIPromise) {
        whoAmIPromise.then((data) => {
            vm.defaultNotificationEmail = data.userName;
        });
    }

    function addDefaultNotificationSettings(whoAmIPromise) {
        whoAmIPromise.then((data) => {
            const notificationSetting = angular.copy(defaultNotificationSetting);
            notificationSetting.destination = data.userName;
            notificationSetting.email = data.userName;
            if (!(angular.isArray(vm.contact.notificationSettings))) {
                vm.contact.notificationSettings = [];
            }
            vm.contact.notificationSettings.push(notificationSetting);
            vm.defaultNotificationEmail = data.userName;
        });
    }

    function contactInfoAction() {

        /*hot fix for isResidentialAddress */
        vm.contact.contactDetails.addressDetails.residentialAddress =
            !!vm.contact.contactDetails.addressDetails.residentialAddress;

        const contact = angular.copy(vm.contact);
        contact.contactDetails.phoneDetails.smsEnabled = !!contact.contactDetails.phoneDetails.smsEnabled;

        const notEmptyNotifications = (notification) => notification.destination !== '';
        contact.notificationSettings = contact.notificationSettings.filter(notEmptyNotifications);
        if (contact.notificationSettings.length === 0) {
            const notificationSetting = angular.copy(defaultNotificationSetting);
            notificationSetting.destination = vm.defaultNotificationEmail;
            notificationSetting.email = vm.defaultNotificationEmail;

            contact.notificationSettings.push(notificationSetting);
        }

        vm.disableSubmitButton = true;

        function undisableSubmitButton() {
            vm.disableSubmitButton = false;
        }

        splitNotificationsIntoSmsAndEmails(contact);
        keepCountries();

        if (isProfileMode) {
            return ewfCrudService.updateElement('/api/myprofile/contact/modify', contact)
                .then((data) => {
                    init(data);
                    vm.profileUpdated = true;

                    $timeout(() => vm.profileUpdated = false, systemSettings.showInformationHintTimeout);

                    return data;
                }, errorHandler)
                .finally(undisableSubmitButton);

        } else if (isCopyMode || !isModifyMode) {
            return ewfCrudService.addElement('/api/addressbook/contact/add', contact)
                .then(() => navigationService.location('address-book.html'), errorHandler)
                .finally(undisableSubmitButton);
        }

        return ewfCrudService.updateElement('/api/addressbook/contact/modify', contact)
            .then(() => navigationService.location('address-book.html'), errorHandler)
            .finally(undisableSubmitButton);
    }

    function splitNotificationsIntoSmsAndEmails(contact) {
        contact.notifications = {};
        contact.notifications.emailNotifications = [];
        contact.notifications.smsNotifications = [];
        contact.notificationSettings.map((notifications) => {
            if (notifications.type === 'EMAIL') {
                notifications.email = notifications.destination;
                contact.notifications.emailNotifications.push(notifications);
            } else {
                notifications.phone = notifications.destination;
                contact.notifications.smsNotifications.push(notifications);
            }
        });

        contact.notificationSettings = [];
    }

    function init(response) {

        initializeResponseFields(response);

        if (isCopyMode) {
            response.contactDetails.key = undefined;
        }

        response.contactDetails.titleOptions = titleOptions;
        response.contactDetails.countries = countries;

        angular.copy(response, vm.contact);

        mergeSmsAndEmailNotifications(vm.contact);

        mapContactDetailsCountryNames();

        vm.contactInfoTitle = response.contactDetails.name;
        $window.document.title = vm.contactInfoTitle;

        initEmailsArray();
    }

    function keepCountries() {
        countries = vm.contact.contactDetails.countries;
    }

    function initializeResponseFields(response) {
        response.pickupSetting = response.pickupSetting || {};
        response.paymentSetting = response.paymentSetting || {};
        response.smsNotifications = response.smsNotifications || [];
        response.emailNotifications = response.emailNotifications || [];

        response.contactDetails = response.contactDetails || {};
        response.contactDetails.taxDetails = response.contactDetails.taxDetails || {};

        response.contactDetails.addressDetails.residentialAddress =
            !!response.contactDetails.addressDetails.residentialAddress;
    }

    function mapContactDetailsCountryNames() {
        //TODO: think about synch of this promise and one in the ewf-address-controller.js#getCountries
        const contactDetails = vm.contact.contactDetails;
        if (contactDetails.countries) {
            contactDetails.countries.forEach((singleCountry) => {
                if (contactDetails.addressDetails.countryCode === singleCountry.code2) {
                    contactDetails.addressDetails.countryName = singleCountry.name;
                }
            });
        }
    }

    function mergeSmsAndEmailNotifications(contact) {
        contact.notificationSettings = [];

        if (contact.notifications) {
            if (contact.notifications.smsNotifications) {
                contact.notifications.smsNotifications.map((smsNotification) => {
                    smsNotification.type = 'SMS';
                    smsNotification.destination = smsNotification.phone;
                    contact.notificationSettings.push(smsNotification);
                });
            }

            if (contact.notifications.emailNotifications) {
                contact.notifications.emailNotifications.map((emailNotification) => {
                    emailNotification.type = 'EMAIL';
                    emailNotification.destination = emailNotification.email;
                    emailNotification.phoneCountryCode = '';
                    contact.notificationSettings.push(emailNotification);
                });
            }

            contact.notifications = [];
        }
    }

    function confirmOfUnsavedData() {
        if (!$scope.contactDetails.$pristine) {
            nlsService.getTranslation('common.confirm_leave_page_with_unsaved_data_on_this_page')
                .then((translationMessage) => {
                    confirmationDialogService.showConfirmationDialog(translationMessage)
                        .then(() => navigationService.location('./address-book.html'));
                });
        } else {
            navigationService.location('./address-book.html');
        }
    }

    function isAdditionalEmailsCorrect(contactEmailsForm) {
        if (vm.emails && vm.emails.length === 0) {
            return true;
        }

        if (contactEmailsForm.$valid && vm.emails[vm.emails.length - 1].value !== '') {
            return true;
        }

        return false;
    }

    function initEmailsArray() {
        vm.emails = emailFields.filter((emailField) => vm.contact.contactDetails[emailField.name])
            .map((emailField) => ({value: vm.contact.contactDetails[emailField.name]}));
    }

    function convertEmailsArrayToEmailFields() {
        emailFields.forEach((emailField, index) => {
            vm.contact.contactDetails[emailField.name] = index < vm.emails.length
                ? vm.emails[index].value
                : EMPTY_EMAIL;
        });
    }

    function addUserEmail() {
        vm.emails.push({value: EMPTY_EMAIL});
        vm.convertEmailsArrayToEmailFields();
    }

    function removeUserEmail(email) {
        const index = vm.emails.indexOf(email);
        vm.emails.splice(index, 1);

        vm.convertEmailsArrayToEmailFields();   // save elements of vm.emails array to email fields
    }

    function showBottomAddEmailButton() {
        return vm.emails.length >= MIN_EMAIL_NUMBER && vm.emails.length < MAX_EMAIL_NUMBER;
    }

    function errorHandler(err) {
        return $q.reject(err);
    }

    function countrySpecificBehaviorBr() {
        return vm.contact.contactDetails.addressDetails.countryCode === 'BR';
    }

    function checkCpfCnpjLength(taxType) {
        if (taxType !== vm.contact.contactDetails.taxDetails.cnpjOrCPFTaxType) {
            vm.contact.contactDetails.taxDetails.cnpjOrCPFTaxID = '';
            vm.cpfCnpjLength = (taxType === 'CNPJ'
                ? cnpjMaxLength
                : cpfMaxLength);
        }
    }

    function submitContactInfo(ewfFormCtrl, contactDetailsForm) {
        return ewfFormCtrl.ewfValidation() && contactDetailsForm.$valid && vm.contactInfoAction();
    }
}
