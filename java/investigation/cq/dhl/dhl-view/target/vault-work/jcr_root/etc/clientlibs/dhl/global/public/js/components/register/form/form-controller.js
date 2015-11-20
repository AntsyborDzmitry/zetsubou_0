define(['exports', 'module', 'directives/ewf-account-field/ewf-account-field-directive', 'directives/ewf-password/ewf-password-directive', './../../../services/modal/modal-service', 'services/location-service'], function (exports, module, _directivesEwfAccountFieldEwfAccountFieldDirective, _directivesEwfPasswordEwfPasswordDirective, _servicesModalModalService, _servicesLocationService) {
    'use strict';

    module.exports = RegistrationFormController;

    var USER_DEFINITION = {
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

    var FORM_DEFINITION = {
        showRegistrationDetails: false,
        hasDHLAccount: false,
        repeatedPassword: '',
        termsAgreement: false,
        privacyAgreement: false
        // Json for dropdown. In pink world we read these values from core or elsewhere. For now we create stub
    };

    RegistrationFormController.$inject = ['$scope', '$window', '$document', 'locationService', 'logService', 'navigationService', 'modalService', 'countryCodeConverter'];

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

    function RegistrationFormController($scope, $window, $document, locationService, logService, navigationService, modalService, countryCodeConverter) {
        var vm = this;

        vm.setRegistrationController = function (ctrl) {
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
                    loaded: function loaded() {
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
                        var anchorOptions = $document[0].getElementById('registration-captcha').getElementsByTagName('a');

                        // .getElementsByTagName does not return an actual array
                        var anchorList = Array.prototype.slice.call(anchorOptions);
                        anchorList.forEach(function (anchorItem) {
                            bindClick(anchorItem, function (event) {
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
            init: function init(captcha) {
                vm.captcha = captcha;
            }
        };

        vm.ewfFormCtrl = null;

        var user = vm.user = USER_DEFINITION;
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
        vm.currentCountry = { name: undefined, code: undefined };
        vm.newCountry = undefined;
        vm.applyCountryPopUp = applyCountryPopUp;
        vm.termsAgreementPopUp = termsAgreementPopUp;
        vm.policyPopUp = policyPopUp;
        vm.isAccountButtonsDisplayed = isAccountButtonsDisplayed;
        vm.userCountryCode = countryCodeConverter.fromThreeLetterToCatalystFormat(navigationService.getCountryLang().countryId);

        vm.countrySelector = {};

        vm.titleOptions = [{ name: 'Mr', value: 'Mr' }, { name: 'Mrs', value: 'Mrs' }, { name: 'Ms', value: 'Ms' }, { name: 'Dr', value: 'Dr' }];

        vm.user.nameTitle = vm.titleOptions[0];

        vm.shipmentFrequencyOptions = [{ name: 'Daily', value: 'Daily' }, { name: 'Weekly', value: 'Weekly' }, { name: 'Monthly', value: 'Monthly' }, { name: 'One-off shipment', value: 'One-Off shipment' }];

        vm.user.shipmentFrequency = vm.shipmentFrequencyOptions[0];

        function init() {
            loadCountryList().then(function () {
                vm.currentCountry = getCurrentCountry();
                user.phoneCode = vm.currentCountry.phoneCode;
            })['catch'](function () {
                vm.registrationError = true;
            });
        }

        init();

        function isAccountButtonsDisplayed(yesButtonRule, noButtonRule) {
            if (yesButtonRule === undefined && noButtonRule === undefined || yesButtonRule && noButtonRule) {
                return true;
            } else if ((noButtonRule === false || noButtonRule === undefined) && yesButtonRule) {
                vm.hasDhlAccount();
                return false;
            } else if ((yesButtonRule === false || yesButtonRule === undefined) && noButtonRule) {
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
            var userToSubmit = {};
            Object.assign(userToSubmit, user);

            userToSubmit.accountNumbers.forEach(function (ewfAccount) {
                ewfAccount.primary = ewfAccount.id === user.primaryAccountId;
            });

            userToSubmit.nameTitle = userToSubmit.nameTitle ? userToSubmit.nameTitle.value : '';
            if (userToSubmit.shipmentFrequency) {
                userToSubmit.shipmentFrequency = userToSubmit.shipmentFrequency.value;
            }

            userToSubmit.countryCode = vm.currentCountry.code2;

            if (vm.captcha) {
                var captchaData = vm.captcha.getCaptchaData();
                userToSubmit.captchaRequest = captchaData;
            }

            vm.registrationController.registerNewUser(userToSubmit).then(function () {
                vm.registrationError = false;
            })['catch'](function (error) {
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
                template: '<ewf-modal><div class=\"modal visible\" id=modal_selectCountry><form id=form_country-changer method=GET><h3 nls=registration.change_country_modal_title></h3><p nls=registration.change_country_modal_description></p><span class=select><select name=country id=select_country ng-init=\"regCtrl.newCountry = regCtrl.currentCountry\" ng-model=regCtrl.newCountry ng-options=\"country.name for country in regCtrl.countrySelector\"></select></span><br><br><a class=btn ng-click=regCtrl.applyCountryPopUp() nls=registration.change_country_modal_yes_button_label></a> <a class=\"x-button close-modal\" nls=registration.change_country_modal_no_button_label ng-click=ewfModalCtrl.dismiss()></a></form></div></ewf-modal>'
            });
        }

        function termsAgreementPopUp() {

            modalService.showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default',
                template: '<ewf-modal dialog-width=large><div class=\"modal visible\" id=modal_terms><h2 class=margin-top-none>Terms &amp; Conditions</h2><div class=text-block><p>On this page, you will find a standard version of the DHL Website Terms and Conditions. Please note that different terms and conditions may apply in certain countries.</p><p>The Terms and Conditions of use of the DHL Website are as follows:</p><h2>Copyright</h2><p>The copyright in this publication is owned by DHL International GmbH.</p><h2>Authorization to Reproduce</h2><p>Any person may reproduce any portion of the material in these web pages subject to the following conditions:</p><ul><li>The material may be used for information and non-commercial purposes only</li><li>It may not be modified in any way</li><li>No unauthorized copy is made of any DHL trademark</li><li>Any copy of any portion of the material must include the following copyright notice: Copyright &copy; DHL International GmbH. All Rights Reserved.</li></ul><h2>DHL Trademarks</h2><p>\"DHL\", \"DHL Worldwide Express\", \"DHL EXPRESS\", \"DHL Freight\", \"DHL Supply Chain\", \"DHL Global Forwarding\", \"DHL Europlus\", \"Jumbo Box\", \"DHL Economy Select\", \"DHLJetline\", \"DHL Sprintline\", \"DHL Secureline\", \"DHL EXPRESS Easy\", \"DHL Easy Shop\", \"DHL Connect\", \"EasyShip\" are trademarks of DHL International GmbH or any other company of Deutsche Post DHL group, registered in at least one jurisdiction. No license to use any of these trademarks is given or implied. These trademarks may not be copied, downloaded, reproduced, used, modified or distributed in any way (except as an integral part of an authorized copy of material appearing in these web pages, as set forth in the previous section paragraph) without prior written permission.</p><h2>Other Trademarks and Trade names</h2><p>All other trademarks or trade names referred to in these materials are the property of their respective owners.</p><h2>Your Comments</h2><p>DHL wants your feedback and appreciates your ideas and suggestions but is unable to answer every comment individually. DHL will be free to use and act on any information you submit.</p><h2>Accuracy of this site</h2><p>These web pages may contain inadvertent inaccuracies or typographical errors. These will be corrected at DHL\'s discretion, as they are found. The information on these web pages is updated regularly, but inaccuracies may remain or occur where changes occur between updates. The Internet is maintained independently at multiple sites around the world and some of the information accessed through these web pages may originate outside of DHL. DHL excludes any obligation or responsibility for this content.</p><h2>Viruses</h2><p>DHL makes all reasonable attempts to exclude viruses from these web pages, but it cannot ensure this exclusion and no liability is accepted for viruses. Please take all appropriate safeguards before downloading information from these web pages.</p><h2>Disclaimer of Warranties</h2><p>The services, the content and the information on this website are provided on an \"as is\" basis. DHL, to the fullest extent permitted by law, disclaims all warranties, whether express, implied, statutory or otherwise, including but not limited to the implied warranties of merchantability, non-infringement of third parties rights and fitness for a particular purpose. DHL, its affiliates and licensors make no representations or warranties about the accuracy, completeness, security or timeliness of the services, content or information provided on or through the DHL web site or systems. No information obtained via the DHL systems or website shall create any warranty not expressly stated by DHL in these terms and conditions.</p><p>Some jurisdictions do not allow limitations of implied warranties, so the limitations and exclusions in this section may not apply to you. If you are dealing as a consumer, these provisions do not affect your statutory rights that cannot be waived, if any. You agree and acknowledge that the limitations and exclusions of liability and warranty provided in these terms and conditions are fair and reasonable.</p><h2>Limitation of Liability</h2><p>To the extent permitted by law, in no event shall DHL, its affiliates or licensors or any third parties mentioned at the DHL website be liable for any incidental, indirect, exemplary, punitive and consequential damages, lost profits, or damages resulting from lost data or business interruption resulting from the use of or inability to use the DHL website and DHL systems, services, content or information whether based on warranty, contract, tort, delict, or any other legal theory, and whether or not DHL is advised of the possibility of such damages. Without limiting the foregoing, to the extent permitted by applicable law, you agree that in no event shall DHL\'s total liability for any damages (direct or otherwise) or loss regardless of the form of action or claim, whether in contract, tort or otherwise, exceed EUR 100.00. To the extent permitted by law, the remedies stated for you in these terms and conditions are exclusive and are limited to those expressly provided for in these terms and conditions.</p><h2>Products and Services</h2><p>Unless otherwise agreed in writing, the transportation products and services mentioned in these web pages are subject to DHL\'s Terms and Conditions of carriage. Since these may vary depending on location of the country of origin of the shipment, please contact the nearest DHL service center to obtain a copy of the local terms and conditions. Not all of DHL\'s products and services may be available in every country.</p><h2>Disclosure of Information</h2><p>All information provided to DHL by visitors to these web pages is considered to be confidential and will not be disclosed by DHL to any third party except as may be required for the provision of the services.</p></div></div></ewf-modal>'
            });
        }

        function policyPopUp() {

            modalService.showDialog({
                closeOnEsc: true,
                scope: $scope,
                windowClass: 'ngdialog-theme-default',
                template: '<ewf-modal dialog-width=large><div class=\"modal visible\" id=modal_policy><h2 class=margin-top-none>Privacy Policy</h2><div class=text-block><p>DHL International GmbH. (hereinafter called \"DHL\") is pleased that you have visited our website and are interested in our company, products and services. It is important to us to protect your personal data during handling throughout the entire business process.</p><p>Please be aware that the national legal requirements for data protection and the handling of personal data may vary from country to country. Therefore, please visit relevant DHL country websites to learn more about country specific information on data protection.</p><p>In the following, we explain what information DHL global collects when you visit our website and how this information is used.</p><a name=personal-data></a><h2>Personal Data</h2><a name=collection-data></a><p>Personal data is specific information about personal or factual characteristics relating to a certain natural person or a natural person who can be specified. This includes information such as your real name, address, telephone number and date of birth. Information which cannot be directly linked to your real identity - such as favorite websites or number of users of a site - is not considered personal data.</p><h2>Collection and Processing of Personal Data</h2><p>DHL is committed to preserving the privacy of users of our websites. When you visit our web pages, our web servers always temporarily save for security purposes the connection data of the computer connecting to our site, a list of the web pages that you visit within our site, the date and duration of your visit, the identification data of the type of browser and operation system used as well as the website through which you linked to our site. Additional personal information such as your name, address, telephone number or e-mail address is not collected unless you provide this data voluntarily, e.g. while completing an online contact form, as part of a registration, survey, competition, fulfillment of contract or an information request.</p><p>Certain areas of the DHL websites including, but not limited to, MyDHL require registration or a password for access. Information obtained from users of these areas may also be used for DHL\'s marketing purposes within the limits of national law. DHL provides a right of access and rectification of personal data under the applicable legislation.</p><a name=utilization-data></a><p>Certain shipment data will be provided to the authorities of the country of transit or destination for customs and tax clearance or for security screening, as required by the laws of such country. The information provided would usually include: shipper name and address, receiver name and address, description of the goods, number of pieces, weight and value of shipment.</p><h2>Utilization and Processing of Personal Data</h2><p>We use the personal data which you have made available to us exclusively for technical administration of the web pages and to fulfill your wishes and requests - thus primarily for fulfillment of a contract concluded with you or to answer your request. In turn, it helps us improve the services we offer to you, and to make our website\'s content and services easier to use and more appropriate to you.</p><p>Only when you have previously granted your approval or - if so stipulated by legal regulations - have not raised an objection do we also use this data for product-related surveys and marketing purposes.</p><a name=information-data></a><p>DHL does not share, sell, transfer or otherwise disseminate your personal data to third parties and will not do so in future, unless required by law, unless required for the purpose of the contract or unless you have given express consent to do so. For instance, it may be necessary to pass on your address and order data to our contractors when you order products.</p><h2>Information from DHL</h2><a name=web-tracking></a><p>DHL would like to contact you in order to provide you with the latest information about updates to our website or our offers, news, products and services. If you contact or register with DHL on our web pages, we sometimes request that you indicate whether or not you would like to receive direct advertising material from us. If you are already a customer of DHL, you will naturally continue to receive necessary information about important changes in connection with existing contracts (e.g. rate changes).</p><a name=use-cookies></a><h2>Use of Web Tracking</h2><p>We use tracking software to determine how many users visit our website and how often. We do not use this software to collect individual personal data or individual IP addresses. The data are used solely in anonymous and summarized form for statistical purposes and for developing the website.</p><h2>Use of Cookies</h2><p>\"Cookies\" are small files that enable us to store information related to your PC and you, the user, specifically, while you visit one of our websites. Cookies help us to determine how frequently our internet pages are accessed as well as the number of users. And they help us configure our offers so that they are as convenient and efficient as possible for you.</p><p>On the one hand, we use what are called \"session cookies\", those that are stored exclusively for the duration of your visit to one of our internet pages. On the other, we use \"persistent cookies\" for retaining information about visitors who repeatedly access one of our internet pages. The purpose of using cookies is to be able to offer you optimal user guidance as well as to \"recognize\" you and thus be able to present (as much as possible) diversified internet pages and new contents during repeated use.</p><b><p>Generally, we do not create an individual profile of your online activities. The content of a persistent cookie is limited to an identification number. Name, email address, IP address, etc., are not saved on the majority of our sites.</p></b><p>There are four exceptions:</p><p><b>(1) Eloqua Tracking Cookie.</b>The content of this persistent tracking cookie is limited to an identification number and is generally used in exactly the same way as all of our other persistent cookies. However, if you contact DHL using certain online contact forms in the Logistics content area, your email address is added to the cookie to create an individual profile of your online activities. These same contact forms also provide you with an option to sign up for email marketing updates. By giving your permission, this also allows us to provide you with personalized content, offers or promotions that may interest you.</p><p>Should you choose not to sign up for email marketing updates, you will not be contacted in the future and your email address will only be used confidentially by DHL internally to understand your individual online activities. This means that we can still continue to deliver new and improved website content to suit your specific needs.</p><p>You can learn more about the Eloqua Tracking cookie in the DHL Table of Cookies below.</p><p>Alternatively, to opt out of being tracked by Eloqua across all websites (or to reverse your setting if you have previously opted out), you can do so under \'How to Manage Cookies\' below.</p><p><b>2) MediaMind Tracking Cookies.</b>These persistent tracking cookies collect your IP address and uses it to provide geographical location data to help DHL monitor and manage advertising campaigns. The cookies are completely encrypted and do not collect any other personally-identifiable data, so the IP address cannot be linked to personal data and is not shared with third parties. The IP address is stored securely and only used confidentially by DHL internally to provide aggregated reports. The cookies expire after 30 days.</p><p>You can learn more about MediaMind Tracking cookies in the DHL Table of Cookies below. Alternatively, to opt out of being tracked by MediaMind across all websites, you can do so by clicking on the MediaMind Opt-Out link: <a target=_blank href=http://ds.serving-sys.com/OBA/MediaMind/OptOut.aspx>MediaMind Opt-Out</a></p><p>If you\'ve previously opted out, and would like to reverse your setting, click the MediaMind Opt-In link: <a target=_blank href=http://ds.serving-sys.com/OBA/MediaMind/OptIn.aspx>MediaMind Opt-In</a></p><p><b>3) Google Analytics Cookies.</b> A small number of countries may use Google Analytics cookies on a small scale for specific local purposes. These cookies use your IP address as recognition, however do not identify you as an individual. In other words, information is collected in an anonymous form. The cookies collect information about how visitors use our local sites and use the information to compile reports and to help us improve local sites.</p><p>You can learn more about Google Analytics in the DHL Table of Cookies below.</p><p>Alternatively, to opt out of being tracked by Google Analytics across all websites, visit: <a target=_blank href=https://tools.google.com/dlpage/gaoptout>Google Analytics Opt-out Browser Add-on</a></p><p><b>4) dotMailer Tracking Cookie.</b>The content of this persistent tracking cookie is limited to an identification number and is generally used in exactly the same way as all of our other persistent cookies. However, if you are already a DHL customer contact or you contact DHL using certain online contact forms in the Logistics content area, your email address is added to the cookie to create an individual profile of your online activities. These same contact forms also provide you with an option to sign up for email marketing updates. By giving your permission, this also allows us to provide you with personalized content, offers or promotions that may interest you.</p><p>Should you choose not to sign up for email marketing updates, you will not be contacted in the future and your email address will only be used confidentially by DHL internally to understand your individual online activities. This means that we can still continue to deliver new and improved website content to suit your specific needs.</p><p>You can learn more about the dotMailer Tracking cookie in the DHL Table of Cookies below.</p><h2>DHL Table of Cookies</h2><p>We have provided details of all cookies used on DHL websites in the table below:</p><table class=\"table table_zebra\"><tbody><tr><td valign=bottom scope=col axis=length><strong>Cookie<br></strong></td><td valign=bottom scope=col axis=length><strong>Name</strong></td><td valign=bottom scope=col axis=length><strong>Purpose</strong></td><td valign=bottom scope=col class=lastChild axis=length><strong>More Information</strong></td></tr><tr><td>Campaign Name Cookie [2]</td><td>campaignName</td><td>This cookie is created when you arrive at a DHL web page from a DHL promotional banner or from a link contained in a campaign / promotional email.<br>The cookie stores a campaign ID, which uniquely identifies the campaign source.<br>If you contact DHL using one of our online contact or registration forms within 24 hours of arriving at one of our websites, the campaign ID is attached with the email sent to DHL Sales or Customer Service.<br>This information is solely used to assess how successful our campaigns are and monitor if customers have contacted us as a result of a campaign.<br>The cookie stores no personal customer data at all, only the campaign’s ID.<br>The cookie expires after 24 hours only.</td><td class=\"lastChild rowGrey\"></td></tr><tr><td>Search Parameter Cookie [3]</td><td>searchParams</td><td>This cookie is used to store search phrases and words that you have typed into our Search boxes.<br>The Search boxes can be found at the top right of each of our web pages.<br>In this way, we remember your search terms and pre-populate the search box with previous suggestions when you reuse the search boxes.<br>This cookie has been created to improve website functionality and make using DHL websites easier for our customers.<br>This cookie permanently stores search terms until such a time that you actively decide to clear your browser cache and cookies.</td><td>&nbsp;</td></tr><tr><td>Shipper Reference Details Cookie [3]</td><td>shipRefDetails</td><td>This cookie is used to store all previously tracked shipper reference values that you enter when using our DHL EXPRESS Shipper’s Reference tracking application.<br>This cookie has been created to improve website functionality and make using DHL websites easier for our customers.<br>This cookie permanently stores all shipper references until such a time that you actively decide to clear your browser cache and cookies.</td><td class=\"lastChild rowGrey\">Take a look at one of our <a href=/en/express/tracking/shippers_reference.html>DHL EXPRESS Shipper’s Reference tracking applications</a></td></tr><tr><td>Waybill Cookie [3]</td><td>AWB</td><td>This cookie is used to store the last tracking number value that you entered when using one of our main online tracking applications.<br>This cookie has been created to improve website functionality and make using DHL websites easier for our customers.<br>This cookie only stores the previous tracking number value until such a time that you enter a new number in the same tracking application.</td><td>Take a look at one of our main online <a href=/en/express/tracking.html>tracking applications</a></td></tr><tr><td>Waybill Brand Cookie [3]</td><td>BRAND</td><td>This cookie is used to store the last shipment type that you selected from the dropdown options that are offered in our main online tracking applications.<br>This cookie has been created to improve website functionality and make using DHL websites easier for our customers.<br>This cookie only stores the previous shipment type dropdown option selected until such a time that you return and select another option in the same tracking application.</td><td class=\"lastChild rowGrey\">Take a look at one of our main online <a href=/en/express/tracking.html>tracking applications</a></td></tr><tr><td>Fast Track Cookie [3]</td><td>No fixed name</td><td>This cookie is used to store both the last tracking number value entered and the shipment type selected from the dropdown when using our smaller Fast Track online tracking applications.<br>This cookie has been created to improve website functionality and make using DHL websites easier for our customers.<br>This cookie only stores the previous tracking number value and previous shipment type dropdown option selected until such a time that you return and select new options in the same Fast Track tracking application.</td><td>You can find one of our <a href=/en/express.html>DHL EXPRESS Fast Track tracking applications here</a></td></tr><tr><td>Tab System Cookie [3]</td><td>No fixed name</td><td>This cookie is used to store the last tab that you selected on a page using a multi-view tab system.<br>This cookie has been created to improve website functionality and make using DHL websites easier for our customers.<br>This cookie only remembers the previous tab selected until you return and select another tab on the same tabbed page.</td><td class=\"lastChild rowGrey\">&nbsp;</td></tr><tr><td>nugg.ad Cookies [4]</td><td>d, dp, ci</td><td>nugg.ad identifies relevant target groups for advertising, according to socio-demographic criteria and product interests. It only makes use of statistical patterns, which are created by the behavior of users towards online advertising and editorial content published on websites. To ensure that you are not constantly bombarded with the same advertisements or even feel that they are too intrusive, we count how frequently you are shown an advert in various campaigns. Once you reach a certain level of exposure, you will not be shown any more adverts from that campaign.<br>Both the d-cookie and the dp-cookie are used to analyze target groups and contain the number of page hits in particular subject areas. The ci-cookie is used to store information about how often you have been shown a particular advert. The cookies only contain general information about your internet use.<br><br>You can learn more about nugg.ad cookies and opt-in / opt-out choices below the table.</td><td><a target=_blank href=http://ad-choices.nuggad.net/index.html.en>More Info about Privacy at nugg.ad</a><br><br><a target=_blank href=https://mtm.nuggad.net/en>The Topic Monitor</a> will show you how your interests are estimated on the basis of your previous surfing behavior.</td></tr><tr><td>Adcloud User Identifier Cookie [4]</td><td>adcloud_uid</td><td>This cookie contains an anonymous identifier that helps Adcloud to associate the user with keywords for targeting of advertising campaigns on other websites. The identifier is also used to monitor advertising campaigns. The cookie does not store any personally-identifiable information. i.e. it only contains general information about your internet use.<br><br>You can learn more about the Adcloud cookie below the table.</td><td class=\"lastChild rowGrey\">More Info about Privacy at <a target=_blank href=https://adcloud.net/myprivacy>Adcloud</a></td></tr><tr><td>Webtrends Analytics [2]</td><td>WT_FPC</td><td>This cookie is used to collect information about how visitors use our site. We use the information to compile reports and to help us improve the site. The cookie collects information in an anonymous form, including the number of visitors to the site, where visitors have come to the site from and the pages they visited.<br>The cookie is only used for identification and does not hold visitor personal data, only an identifier. It is used confidentially only by DHL internally to improve its websites and the user experience.</td><td>More Info about Privacy at <a target=_blank href=\"http://webtrends.com/privacy-policy/\">Webtrends</a></td></tr><tr><td>Webtrends Analytics [2]</td><td>ACOOKIE</td><td>This cookie is used to collect information about how visitors use our sites and is specifically used to monitor visitors across DHL domains.<br>For example, if a visitor arrives at our corporate site (domain is <a href=http://www.dhl.com>www.dhl.com</a>) and then selects to visit a DHL country website with its own local domain (e.g. for Germany, local domain is <a href=http://www.dhl.de>www.dhl.de</a>).<br>We use the information to compile reports and to help us improve the site. The cookie collects information in an anonymous form, including the number of visitors to the site, where visitors have come to the site from and the pages they visited.<br>The cookie is only used for identification and does not hold visitor personal data, only an identifier. It is used confidentially only by DHL internally to improve its websites and the user experience.</td><td class=\"lastChild rowGrey\">More Info about Privacy at <a target=_blank href=\"http://webtrends.com/privacy-policy/\">Webtrends</a></td></tr><tr><td>Google Analytics [2]</td><td>_utma<br>_utmb<br>_utmz</td><td>Certain countries also use Google Analytics for specific local purposes.<br>These cookies are used to collect information about how visitors use our local sites. We use the information to compile reports and to help us improve local sites. The cookies collect information in an anonymous form, including the number of visitors to the local site, where visitors have come to the local site from and the pages they visited.</td><td>More Info about Privacy at <a target=_blank href=http://www.google.com/analytics/learn/privacy.html>Google</a></td></tr><tr><td>Eloqua Tracking Cookie [2]</td><td>&nbsp;ELOQUA</td><td>This cookie is used to recognize a return visitor as a unique user and collect information about how our sites are used. We use the information to compile reports and to help us improve the site and provide you with better targeted content.<br>The cookie collects information in an anonymous form unless you contact DHL using certain online contact forms in the Logistics content area. At this point, we link the information stored in the cookie to your email address.<br>It is used confidentially only by DHL internally to improve its websites and the user experience.</td><td class=\"lastChild rowGrey\">More Info about Privacy at <a target=_blank href=http://www.eloqua.com/trust/Privacy_Policy.html>Eloqua</a></td></tr><tr><td>LiveBall Tracking Cookies [2]</td><td>LiveBall, mkto_trk, ki_r, ki_t, ki_u</td><td>These cookies collect information using anonymous identification numbers.<br>LiveBall uses IP address to provide non-intrusive geographical location data, however it is not saved in or linked with the cookie. This helps us to track web browsing behavior in order to understand and improve the user experience and the services that we offer. However, it cannot be mapped back to your personal data.<br>These cookies are set when you contact DHL using certain online forms on our websites &ndash; for example, when you open a DHL EXPRESS account with us.<br>The cookies are used confidentially only by DHL internally and expire after 365 days.</td><td>More Info about <a target=_blank href=http://ioninteractive.com/privacy-policy>Privacy</a></td></tr><tr><td>dotMailer Tracking Cookie [2]</td><td>tracked_session</td><td>This cookie is created when you arrive at specific web pages from a link contained in a campaign or promotional email. We use the information to compile reports and to help us improve the site and provide you with better, targeted content.<br>The cookie collects information in an anonymous form unless you contact DHL using certain online contact forms in the Logistics content area. At this point, we link the information stored in the cookie to your email address.<br>Information gathered includes page views, length of time on a page and the browser you used to view the content. This information helps DHL to measure the performance of email campaigns.<br>If the cookie remains anonymous, it expires after 30 days. If linked to an email address, it expires 2 years (730 days) after contacts last identified themselves. It is used confidentially only by DHL internally to improve the user experience.</td><td class=\"lastChild rowGrey\">More Info about Privacy at <a target=_blank href=\"http://www.dotmailer.com/terms/cookies-policy/\">dotMailer</a></td></tr><tr><td>MediaMind Cookies [2]</td><td>U2, ActivityInfo, TargetingInfo, Eyeblaster, A3, B4, and C4.</td><td>MediaMind cookies are created when you arrive at specific DHL campaign web pages from a DHL promotional banner, from a link contained in a campaign / promotional email, or when you have used a campaign link provided as part of an offline media advertisement.<br>MediaMind cookies track when and where you were exposed to DHL ads online, how you engaged with those ads, and when you visited the DHL site after being exposed to those ads.<br>The information is used to help DHL measure the performance of advertising campaigns. The information is provided as aggregated reports, so no individual user information will be viewed. It does not monitor any other browsing behavior and is used confidentially only by DHL internally.</td><td>More Info about Privacy at <a target=_blank href=http://www.sizmek.com/about-us/privacy>MediaMind</a></td></tr><tr><td>&nbsp;Flash Cookies [1]</td><td>&nbsp;LSO</td><td>&nbsp;Flash Cookies allow you to view Flash Player content and are independent of DHL.<br>Flash Player default settings do not seek user\'s permission to store cookies on local hard disk.<br>If you wish, you can disable flash cookies (also referred to as ‘local shared objects’).</td><td class=\"lastChild rowGrey\">&nbsp;More info about how to manage or disable <a target=_blank href=http://kb2.adobe.com/cps/526/52697ee8.html#main_where%20%E2%80%93%20instructions class=anchorLink>Flash cookies</a><br>Full info on <a target=_blank href=http://www.macromedia.com/support/documentation/en/flashplayer/help/help01.html>Flash Player functionality and related Privacy settings</a></td></tr><tr><td>You Tube Cookies [2]</td><td>use_hitbox<br>VISITOR_INFO1_LIVE</td><td>We embed videos using YouTube’s privacy-enhanced mode. Some of these videos are from our official YouTube channel.<br>This mode may set cookies on your computer once you click on the YouTube video player, but YouTube will not store personally-identifiable cookie information for playbacks of embedded videos using the privacy-enhanced mode.</td><td>To find out more, please visit <a target=_blank href=\"http://support.google.com/youtube/bin/answer.py?hl=en-GB&amp;answer=171780\">YouTube’s embedding videos information page</a></td></tr></tbody></table><br><h2>Cookie Categories</h2><p>All cookies in the table above have been categorized according to 4 numbered groups - the relevant category numbers are listed in column 1. Please note that cookies can belong to more than one category.</p><p>The categories are as follows:</p><p>[1] Strictly Necessary: These cookies are essential in order to enable you to move around the website and use its features. Without these cookies, services you have asked for cannot be provided.</p><p>[2] Performance: These cookies collect information about how visitors use a website, for instance which pages visitors go to most often. These cookies don\'t collect information that identifies a visitor. All information these cookies collect is aggregated and therefore anonymous. It is only used to improve how a website works.</p><p>[3] Functionality: These cookies allow the website to remember choices you make and provide enhanced, more personal features. For example, these cookies can be used to remember and store the last tracking number that you entered when using a tracking application. Information these cookies collect may be anonymized and they cannot track your browsing activity on other websites.</p><p>[4] Targeting or Advertising: These cookies are used to deliver adverts more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as helping measure the effectiveness of an advertising campaign. They are usually placed by advertising networks with the website operator\'s permission.</p><h2>Use of nugg.ad Cookies</h2><p>This website uses <a target=_blank href=https://nugg.ad/en/index>nugg.ad AG</a> technology to monitor data on controlling advertising. In order to do this, nugg.ad saves the frequency of use of various website topics in the form of cookies. These cookies are stored in the browser of your device (e.g. PC, laptop, smart phone etc.) for a maximum period of 26 weeks. nugg.ad\'s technology may also save basic information on your use of other websites in order to estimate what advertising might interest you the most. It is not possible for us to trace any information in the cookies back to individual users. In particular we cannot identify a person by name, address or any other data that is directly identifying.</p><p>If you would like to see advertising on websites that are of interest to you, then you can opt in to receive a further theme-based analysis of your usage behavior. If you give your agreement, then this opt-in cookie will also be stored in the browser of your device. It will be stored for 1 year. If previously collected nugg.ad cookies are present in the browser of your device, by setting the opt-in cookie the following will happen: with your permission the nugg.ad cookie lifespan is lengthened to 1 year (calculated from the moment the cookie is set). Information stored in nugg.ad cookies prior to opt-in is retained and will be deleted upon expiration of the cookie (maximum 1 year). You have the right to prevent the recording of information by the nugg.ad system at any time by exercising your right to opt out. If you have already given your consent, you can also cancel it at any time, effective thereafter. An opt-out will also be stored in a cookie in your browser\'s device with a lifespan of 10 years, it will be named \"nuggstopp\", and will be set by \"nuggad.net\".</p><p>If you are interested in opting in or opting out, you can do so under \'How to Manage Cookies\' below.</p><h2>Use of Adcloud Cookie</h2><p>As you browse DHL websites, we use Adcloud technology to place an advertising cookie in the browser of your device (e.g. PC, laptop, smart phone etc.) so that we can understand what you are interested in. The cookie lasts for a maximum period of 365 days and enables us to present you with advertising on other sites based on your previous interaction with DHL websites. Although we collect data based on keywords to display the right ads to you on other websites, it is not possible for us to trace any information in the cookie back to you as an individual. In particular we cannot identify a person by name, address or any other data that is directly identifying. This website also uses Adcloud technology to monitor advertising campaigns.</p><p>If you want Adcloud to stop tracking you, you can learn how to do this under \'How to Manage Cookies\' below.</p><h2>Sharing Tools: Third Party Cookies</h2><p>DHL now uses embedded \'share\' buttons on its websites. These make it easy for visitors to bookmark and share content through their favourite social networks. When you click on one of these buttons, a cookie may be set by the service you have chosen to share content through. DHL does not control the use of these cookies and you should therefore check the relevant third party\'s website for more information. The \'share buttons\' are provided by AddThis. For more information about their data collection practices, please take a look at the <a target=_blank href=http://www.addthis.com/tos>AddThis Privacy Policy</a></p><h2>Third Party Cookies in embedded content</h2><p>Please note that on some pages of our websites you may notice that cookies have been set that are not related to DHL. When you visit a page with content embedded from, for example, YouTube or Vimeo, these service providers may set their own cookies on your web browser. DHL does not control the use of these cookies and cannot access them due to the way that cookies work, as cookies can only be accessed by the party who originally set them. You should check the third party websites for more information about these cookies.</p><h2>Web Beacons</h2><p>In order to keep DHL\'s online content relevant, easy to use and up-to-date, we use web analytics services such as Webtrends* to help us understand how people use our websites. These services use data collection technologies such as web beacons. Web beacons are small electronic images that deliver cookies, count visits, and understand usage and website effectiveness. In turn, this lets us know what content is of interest to our visitors and helps us provide tailored information on our websites. These web beacons are anonymous and do not contain or collect any information that identifies you. The information is anonymous and only used for statistical purposes. Web analytics data and cookies cannot be used to identify you as they never contain personal information such as your name or email address.</p><p>* See Webtrends entry in DHL Table of Cookies above for more information.</p><h2>How to Manage Cookies</h2><p>Using our products and services without cookies is also possible. In your browser, you can deactivate the saving of cookies, limit them to particular websites, or set the browser to notify you when a cookie is sent. You can also delete cookies from your PC hard drive at any time (file: \"cookies\"). Please note that in this case you will have to expect a limited page presentation and limited user guidance.</p><p>Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit: <a target=blank href=\"http://www.allaboutcookies.org/\">All About Cookies</a></p><p>For further EU-specific advice on cookies and the various opt out options available to you, you can also visit the following website: <a target=_blank href=\"http://youronlinechoices.eu/\">Your Online Choices</a></p><p>To opt out of being tracked by LiveBall, you will need to manage and delete the cookies using your browser settings. To find out more, please visit: <a target=_blank href=\"http://www.allaboutcookies.org/\">All About Cookies</a></p><p>To opt out of being tracked by dotMailer, you will need to manage and delete the cookies using your browser settings. To find out more, please visit: <a target=_blank href=\"http://www.allaboutcookies.org/\">All About Cookies</a></p><p>To opt out of being tracked by Google Analytics across all websites, visit: <a target=_blank href=https://tools.google.com/dlpage/gaoptout>Google Analytics Opt-out Browser Add-on</a></p><p>To opt out of being tracked by MediaMind across all websites, you can do so by clicking on the MediaMind Opt-Out link below: <a target=_blank href=http://ds.serving-sys.com/OBA/MediaMind/OptOut.aspx>MediaMind Opt-Out</a></p><p>If you\'ve previously opted out, and would like to reverse your setting, click the MediaMind Opt-In link below: <a target=_blank href=http://ds.serving-sys.com/OBA/MediaMind/OptIn.aspx>MediaMind Opt-In</a></p><p>To opt out of being tracked by WebTrends Analytics across all websites, visit: <a target=_blank href=\"https://ondemand.webtrends.com/support/optout.asp?action=out&amp;status=completed\">Webtrends Opting Out of Tracking Cookies</a></p><p>You are currently opted-in for web monitoring by Eloqua on DHL websites. To opt-out of Eloqua web monitoring <a>click here</a></p><p>Please remember that if you delete your cookies, or use a different browser or computer you will need to set your opt-out status again.</p><p>I do not want nugg.ad to analyze my surfing behavior by topic on Internet sites. This objection will be stored in a cookie on my browser, and has a lifespan of 10 years (\"opt out\")</p><p>I would like to see advertising that is relevant to me, and agree to nugg.ad\'s analysis by topic of my surfing behavior. This permission is limited to the period of one year (\"opt in\").</p><p><b>Please note that it is not technically possible to detect the Opt-Out if you delete the cookies from your browser.</b></p><p>To opt out of being tracked by Adcloud across all websites, you must first click on the following link: <a target=_blank href=https://adcloud.net/myprivacy>Adcloud Privacy Policy</a></p><p>Once on the page, go to \'Settings for Adcloud ads\' and change the setting to: Please do not use anonymized profile information when targeting advertisements.</p><a name=security></a><p>You can also choose to opt out of some or all of the advertising cookies set on your PC by visiting the <a target=_blank href=http://www.networkadvertising.org/choices/#>Network Advertising Initiative (NAI) website</a></p><p>Not everyone who visits our site will do so using a web browser. For example, some users will access DHL websites or applications using a mobile device. If so, it may not be possible to disable cookies or adjust web browser settings.</p><h2>Security</h2><a name=right-information></a><p>DHL takes all of the necessary technical and organizational security measures to protect your personal data from being lost or misused. For instance, your data is saved in a secure operating environment which is not accessible to the public. In certain cases, your personal data is encrypted by Secure Socket Layer technology (SSL) during transmission. This means that an approved encryption procedure is used for communication between your computer and the DHL servers if your browser supports SSL.</p><p>Should you wish to contact DHL by e-mail, we would like to point out that the confidentiality of the information sent cannot be guaranteed. The contents of e-mail messages can be read by third parties. We therefore recommend you send us confidential information only by post.</p><a name=dp-dhl></a><h2>Right to Information</h2><p>Upon written request, we will inform you what personal data (e.g. name, address) we have saved on you.</p><h2>DP DHL Privacy Policy</h2><a name=changes-protection></a><p>The DPDHL Data Privacy Policy regulates the Group-wide standards for data processing with a special focus on so-called third country transfers, meaning transfers of personal data to countries outside the EU, which do not have an adequate level of data protection. If you are interested in learning more about the DPDHL Data Privacy Policy, please use the following link:</p><p><a target=_blank href=http://www.dhl.com/content/dam/downloads/g0/legal/summary_dpdhl_privacypolicy.pdf>DPDHL Privacy Policy (Summary)</a></p><h2>Changes to Data Protection Statement</h2><p>We keep our data protection statement under regular review.</p><p>DHL reserves the right to change its data protection statement at any time with or without prior notice. Please check back frequently to be informed of any changes. By using DHL\'s websites you agree to this Privacy Policy.</p><p>This statement was last updated on 02 June 2015.</p><h2>Contact</h2><p>Contact Status: 02 June 2015</p><p>If you have questions in regard to the processing of your personal data, please contact the DHL Data Protection Officer. The Data Protection team is also available to help with information requests, take suggestions or handle complaints.</p><p>Data Protection Officer for DHL</p><p>Gabriela Krader, LL.M<br>Deutsche Post AG<br>Corporate Center - 524<br>53250 Bonn<br></p></div></div></ewf-modal>'
            });
        }

        function applyCountryPopUp() {
            locationService.saveCountry(vm.newCountry);
            navigationService.changeCountry(vm.newCountry.code3);
            return true;
        }

        function getCurrentCountry() {
            var currentCountryId = navigationService.getCountryLang().countryId;

            var currentCountryAlpha2Code = countryCodeConverter.fromThreeLetterToCatalystFormat(currentCountryId, vm.countrySelector);
            var currentCountryArray = vm.countrySelector.find(function (country) {
                return country.code2 === currentCountryAlpha2Code;
            });
            return currentCountryArray;
        }

        function loadCountryList() {
            vm.countrySelector = [];
            return locationService.loadAvailableLocations().then(function (countries) {
                vm.countrySelector = countries;
            })['catch'](function (error) {
                logService.error('Unable to load country list ' + error);
            });
        }
    }
});
//# sourceMappingURL=form-controller.js.map
