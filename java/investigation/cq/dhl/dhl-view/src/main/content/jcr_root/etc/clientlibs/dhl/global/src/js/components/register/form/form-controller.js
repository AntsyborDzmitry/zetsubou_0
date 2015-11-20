import 'directives/ewf-account-field/ewf-account-field-directive';
import 'directives/ewf-password/ewf-password-directive';
import './../../../services/modal/modal-service';
import 'services/location-service';

const USER_DEFINITION = {
    haveAccountNumber: '',
    accountNumbers: [],
    countryCode: '',
    nameTitle: '',
    firstName: '',
    lastName: '',
    companyName: '',
    primaryPhone: '',
    primaryPhoneExt: '',
    smsEnabledPhone: false,
    email: '',
    password: '',
    requestNewAccount: '',
    companyNameNA: '',
    shipmentFrequency: '',
    addrSearch: '',
    countryCodeNA: '',
    addrLine1: '',
    addrLine2: '',
    postCode: '',
    city: '',
    province: '',

    promoViaEmail: false,

    language: 'en'
};

const FORM_DEFINITION = {
    showRegistrationDetails: false,
    hasDHLAccount: false,
    repeatedPassword: '',
    termsAgreement: false,
    privacyAgreement: false
    // Json for dropdown. In pink world we read these values from core or elsewhere. For now we create stub
};

RegistrationFormController.$inject = ['$scope',
                                      '$window',
                                      '$document',
                                      'locationService',
                                      'logService',
                                      'navigationService',
                                      'modalService',
                                      'countryCodeConverter'];

/**
 * Registration form controller
 *
 * @param $scope
 * @param $window
 * @param locationService
 * @param {logService} logService
 * @param {navigationService} navigationService
 * @param modalService
 * @param countryCodeConverter
 */
export default function RegistrationFormController($scope,
                                                   $window,
                                                   $document,
                                                   locationService,
                                                   logService,
                                                   navigationService,
                                                   modalService,
                                                   countryCodeConverter) {
    const vm = this;

    vm.setRegistrationController = function(ctrl) {
        vm.registrationController = ctrl;
    };

    vm.captchaOptions = {
        imgPath: '/etc/clientlibs/dhl/global/public/img/',
        captcha: {
            numberOfImages: 5,
                url: '/api/visualcaptcha',
                callbacks: {
                    // TODO: *******************
                    // TODO: We have to use this callback in 0.0.7 version of captcha.
                    // TODO: We hope in next version <a href> won't be in the sources anymore so we can remove callback
                    // TODO: *******************
                    loaded: function() {
                        // Binds an element to callback on click
                        // @param element object like document.getElementById() (has to be a single element)
                        // @param callback function to run when the element is clicked
                        function bindClick(element, callback) {
                            if (element.addEventListener) {
                                element.addEventListener('click', callback, false);
                            } else {
                                element.attachEvent('onclick', callback);
                            }
                        }

                        // Avoid adding the hashtag to the URL when clicking/selecting visualCaptcha options
                        const anchorOptions = $document[0].getElementById('registration-captcha')
                                                            .getElementsByTagName('a');

                        // .getElementsByTagName does not return an actual array
                        const anchorList = Array.prototype.slice.call(anchorOptions);
                        anchorList.forEach((anchorItem) => {
                            bindClick(anchorItem, (event) => {
                                if (event.preventDefault) {
                                    event.preventDefault();
                                } else {
                                    event.returnValue = false;
                                }
                            });
                        });
                    }
                }
            },
        // use init callback to get captcha object
        init: function(captcha) {
            vm.captcha = captcha;
        }
    };

    vm.ewfFormCtrl = null;

    const user = vm.user = USER_DEFINITION;
    vm.form = FORM_DEFINITION;
    vm.securityQuestions = '[]';
    //TODO Country and lang are different objects.
    // Country should be mapped on the values in PLAY> We have 3 chars and they have only 2
    //vm.newUser.countryCode = vm.currentLangId;
    user.language = navigationService.getCountryLang().langId;
    vm.hasDhlAccount = userHasAccountAction;
    vm.noDhlAccount = userWithoutAccountAction;
    vm.registerNewUser = registerNewUser;
    vm.fillForm = fillForm;
    vm.showRegistrationForm = showInputForRegistrationDetails;
    vm.selectCountryPopUp = selectCountryPopUp;
    vm.currentCountry = {name: undefined, code: undefined};
    vm.newCountry = undefined;
    vm.applyCountryPopUp = applyCountryPopUp;
    vm.termsAgreementPopUp = termsAgreementPopUp;
    vm.policyPopUp = policyPopUp;
    vm.isAccountButtonsDisplayed = isAccountButtonsDisplayed;
    vm.userCountryCode =
        countryCodeConverter.fromThreeLetterToCatalystFormat(navigationService.getCountryLang().countryId);

    vm.countrySelector = {};

    vm.titleOptions = [
        {name: 'Mr', value: 'Mr'},
        {name: 'Mrs', value: 'Mrs'},
        {name: 'Ms', value: 'Ms'},
        {name: 'Dr', value: 'Dr'}
    ];

    vm.user.nameTitle = vm.titleOptions[0];

    vm.shipmentFrequencyOptions = [
        {name: 'Daily', value: 'Daily'},
        {name: 'Weekly', value: 'Weekly'},
        {name: 'Monthly', value: 'Monthly'},
        {name: 'One-off shipment', value: 'One-Off shipment'}
    ];

    vm.user.shipmentFrequency = vm.shipmentFrequencyOptions[0];

    function init() {
        loadCountryList()
            .then(function() {
                vm.currentCountry = getCurrentCountry();
                user.phoneCode = vm.currentCountry.phoneCode;
            })
            .catch(function() {
                vm.registrationError = true;
            });
    }

    init();

    function isAccountButtonsDisplayed(yesButtonRule, noButtonRule) {
        if ((yesButtonRule === undefined && noButtonRule === undefined) || (yesButtonRule && noButtonRule)) {
            return true;
        } else if ((noButtonRule === false || noButtonRule === undefined) && yesButtonRule) {
            vm.hasDhlAccount();
            return false;
        } else if (((yesButtonRule === false || yesButtonRule === undefined) && noButtonRule)) {
            vm.noDhlAccount();
            return false;
        }
    }

    function showInputForRegistrationDetails(accountForm) {
        if (accountForm.$valid) {
            vm.form.showRegistrationDetails = true;
        }
    }

    function userHasAccountAction() {
        if (!vm.form.hasDHLAccount) {
            vm.form.hasDHLAccount = true;
            vm.form.showRegistrationDetails = false;
            user.haveAccountNumber = true;
        }
    }

    function userWithoutAccountAction() {
        user.accountNumbers = [];
        user.haveAccountNumber = false;
        vm.form.hasDHLAccount = false;
        vm.form.showRegistrationDetails = true;
    }

    function fillForm() {
        userWithoutAccountAction();

        user.country = 'Ukraine';
        user.firstName = 'John';
        user.lastName = 'Smith';
        user.companyName = 'John Smith Inc';
        user.addressLine1 = 'Kiev street';
        user.email = 'John1@Smith.com';
        user.primaryPhone = '3222233';
        user.password = vm.form.repeatedPassword = user.email;

        vm.form.termsAgreement = true;
        vm.form.privacyAgreement = true;
    }

    function registerNewUser() {
        const userToSubmit = {};
        Object.assign(userToSubmit, user);

        userToSubmit.accountNumbers.forEach((ewfAccount) => {
            ewfAccount.primary = ewfAccount.id === user.primaryAccountId;
        });

        userToSubmit.nameTitle = userToSubmit.nameTitle ? userToSubmit.nameTitle.value : '';
        if (userToSubmit.shipmentFrequency) {
            userToSubmit.shipmentFrequency = userToSubmit.shipmentFrequency.value;
        }

        userToSubmit.countryCode = vm.currentCountry.code2;

        if (vm.captcha) {
            const captchaData = vm.captcha.getCaptchaData();
            userToSubmit.captchaRequest = captchaData;
        }

        vm.registrationController.registerNewUser(userToSubmit)
            .then(function() {
                vm.registrationError = false;
            })
            .catch(function(error) {
                vm.registrationError = true;
                vm.ewfFormCtrl.setErrorsFromResponse(error);
                logService.error('Unable to register new user due to: ' + error);

                if (vm.captcha) {
                    vm.captcha.refresh();
                }
            });
    }

    function selectCountryPopUp() {

        modalService.showDialog({
            closeOnEsc: true,
            scope: $scope,
            windowClass: 'ngdialog-theme-default',
            templateUrl: 'country-selector-modal.html'
        });
    }

    function termsAgreementPopUp() {

        modalService.showDialog({
            closeOnEsc: true,
            scope: $scope,
            windowClass: 'ngdialog-theme-default',
            templateUrl: 'terms-agreement-modal.html'
        });
    }

    function policyPopUp() {

        modalService.showDialog({
            closeOnEsc: true,
            scope: $scope,
            windowClass: 'ngdialog-theme-default',
            templateUrl: 'policy-modal.html'
        });
    }

    function applyCountryPopUp() {
        locationService.saveCountry(vm.newCountry);
        navigationService.changeCountry(vm.newCountry.code3);
        return true;
    }

    function getCurrentCountry() {
        const currentCountryId = navigationService.getCountryLang().countryId;

        const currentCountryAlpha2Code = countryCodeConverter.fromThreeLetterToCatalystFormat(
            currentCountryId,
            vm.countrySelector
        );
        const currentCountryArray = vm.countrySelector.find((country) => country.code2 === currentCountryAlpha2Code);
        return currentCountryArray;
    }

    function loadCountryList() {
        vm.countrySelector = [];
        return locationService.loadAvailableLocations()
            .then((countries) => {
                vm.countrySelector = countries;
            })
            .catch((error) => {
                logService.error(`Unable to load country list ${error}`);
            });
    }
}
