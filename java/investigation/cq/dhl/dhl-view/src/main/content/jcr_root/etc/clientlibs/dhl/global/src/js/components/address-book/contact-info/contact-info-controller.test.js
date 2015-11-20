import ContactInfoController from './contact-info-controller';
import EwfCrudService from './../../../services/ewf-crud-service';
import UserService from './../../../services/user-service';
import EwfFormController from './../../../directives/ewf-form/ewf-form-controller';
import 'angularMocks';

describe('ContactInfoController', () => {
    const systemSettingsServiceConst = {
        systemSettings: {
            showInformationHintTimeout: 4000
        }
    };
    let sut;
    let $q, $timeout, $mockWindow;
    let deferredGet;
    let deferredAdd;
    let deferredWhoAmI;
    let deferredModify;
    let ewfCrudService;
    let navigationServiceMock;
    let mockData;
    let nlsServiceMock;
    let deferredTranslation;
    let userService;
    let ewfFormCtrlMock;

    function createSut(isProfile = false) {
        return new ContactInfoController(
            {},
            $q,
            {isProfile},
            $timeout,
            $mockWindow,
            navigationServiceMock,
            ewfCrudService,
            undefined,
            nlsServiceMock,
            systemSettingsServiceConst,
            userService
        );
    }

    beforeEach(inject((_$q_, _$timeout_) => {
        mockData = {
            key: '433',
            contactDetails: {
                name: 'CONTACT_NAME',
                nickname: 'CONTACT_NICKNAME',
                company: 'COMPANY_NAME',
                addressDetails: {
                    countryCode: 'US',
                    addrLine1: 'ADDR_LINE1',
                    addrLine2: 'ADDR_LINE2',
                    addrLine3: 'ADDR_LINE3',
                    zipOrPostCode: 'ZIP_OR_POST',
                    city: 'CITY_NAME',
                    stateOrProvince: 'STATE_OR_PROVINCE',
                    residentialAddress: true
                },
                email: 'EMAIL@TEST.COM',
                email2: 'EMAIL2@TEST.COM',
                email3: 'EMAIL3@TEST.COM',
                email4: 'EMAIL4@TEST.COM',
                email5: 'EMAIL5@TEST.COM',
                phoneDetails: {
                    phoneType: 'OFFICE',
                    phoneCountryCode: '380',
                    phone: 'PHONE_NUMBER',
                    phoneExt: '044',
                    smsEnabled: false,
                    fax: 'FAX'
                },
                taxDetails: {
                    vatTaxId: 'TAX_ID',
                    eoriNumber: 'EORI_NUMBER',
                    cnpjOrCPFTaxType: 'CNPJ',
                    cnpjOrCPFTaxID: '01234567890'
                },
                matchCode: 'MATCH_CODE',
                favoriteShipTo: true,
                favoriteShipFrom: true,
                favoriteAssignTo: false
            },
            pickupSetting: {
                availablePickupLocations: [
                    'Front Door',
                    'Back Door',
                    'Reception',
                    'Loading Bay',
                    'Other'
                ],
                selectedPickupLocation: null,
                instructionsForCourier: null
            },
            paymentSetting: {
                availablePaymentOptions: {
                    1234890: 'Account Number ***890',
                    1234123: 'Account Number ***123',
                    1234567: 'Account Number ***567'
                },
                defaultAccount: null,
                accountForShippingCharges: null,
                accountForDutiesAndTaxes: null,
                availableTermsOfTrade: [
                    'CIP - Carriage and Insurance Paid To',
                    'CPT - Carriage Paid To',
                    'DAP - Delivered at Place',
                    'DAT - Delivered at Terminal',
                    'DDP - Delivered Duty Paid',
                    'EXW - Ex Works',
                    'FCA - Free Carrier'
                ],
                selectedTermOfTrade: null
            },
            mailingListSetting: {
                availableMailingLists: [
                    'List 1',
                    'List 2',
                    'List 3'
                ],
                selectedMailingLists: null
            },
            shippingSetting: {},
            notifications: {
                smsNotifications: [{
                    phone: '123456',
                    phoneCountryCode: '+1',
                    language: 'en',
                    notificationEvents: {
                        pickedUpByCourier: false,
                        clearedCustoms: false,
                        deliveryDelay: false,
                        customsDelay: false,
                        delivered: false
                    },
                    destination: '123456',
                    type: 'SMS'
                }],
                emailNotifications: [{
                    email: 'email@test.com',
                    language: 'en',
                    phoneCountryCode: '',
                    notificationEvents: {
                        pickedUpByCourier: false,
                        clearedCustoms: false,
                        deliveryDelay: false,
                        customsDelay: false,
                        delivered: false
                    },
                    destination: 'email@test.com',
                    type: 'EMAIL'
                }]
            }
        };
        mockData.notificationSettings = mockData.notifications.smsNotifications
                                            .concat(mockData.notifications.emailNotifications);

        $q = _$q_;
        $timeout = _$timeout_;
        $mockWindow = {
            document: {
                title: 'Some title'
            }
        };

        deferredGet = $q.defer();
        deferredAdd = $q.defer();
        deferredWhoAmI = $q.defer();
        deferredModify = $q.defer();
        deferredTranslation = $q.defer();

        nlsServiceMock = jasmine.createSpyObj('nlsService', ['getTranslation']);
        userService = jasmine.mockComponent(new UserService());
        navigationServiceMock = jasmine.createSpyObj('logService', ['getParamFromUrl', 'location']);
        ewfCrudService = jasmine.mockComponent(new EwfCrudService());
        ewfFormCtrlMock = jasmine.mockComponent(new EwfFormController());

        userService.whoAmI.and.returnValue(deferredWhoAmI.promise);
        ewfCrudService.getElementDetails.and.returnValue(deferredGet.promise);
        ewfCrudService.addElement.and.returnValue(deferredAdd.promise);
        ewfCrudService.updateElement.and.returnValue(deferredModify.promise);
        nlsServiceMock.getTranslation.and.returnValue(deferredTranslation.promise);

        const getParamFromUrlMockData = {
            mode: 'copy',
            key: mockData.key
        };

        navigationServiceMock.getParamFromUrl.and.callFake((key) => getParamFromUrlMockData[key]);

        sut = createSut(true);
    }));

    it('should for new contact set user email to notifications', () => {
        const getParamFromUrlMockData = {
            mode: '',
            key: undefined
        };
        const whoAmI = {
            countryCode2: 'US',
            countryCode3: 'USA',
            groups: [
                'regular'
            ],
            personaType: 'Novice',
            userName: 'userSuccess@test.com'
        };

        navigationServiceMock.getParamFromUrl.and.callFake((key) => getParamFromUrlMockData[key]);
        sut = createSut();

        deferredWhoAmI.resolve(whoAmI);
        $timeout.flush();

        expect(sut.contact.notificationSettings[0].destination).toBe(whoAmI.userName);
    });

    it('should enable submit button if service failed', () => {
        const rejectMockData = {
            status: 500,
            data: {
                message: 'fail'
            }
        };

        sut.contactInfoAction();

        deferredModify.reject(rejectMockData);
        $timeout.flush();

        expect(sut.disableSubmitButton).toEqual(false);
    });

    it('should check that CRUD service is called with correct data', () => {
        const getParamFromUrlMockData = {
            mode: 'copy',
            key: mockData.key
        };

        navigationServiceMock.getParamFromUrl.and.callFake((key) => getParamFromUrlMockData[key]);
        sut = createSut();

        deferredGet.resolve(mockData);
        $timeout.flush();

        expect(ewfCrudService.getElementDetails).toHaveBeenCalledWith('/api/addressbook/contact', mockData.key);

    });

    it('should save addressDetails server response data to "contact" object', () => {
        sut = createSut();

        deferredGet.resolve(mockData);
        $timeout.flush();

        expect(sut.contact.contactDetails.addressDetails).toEqual(mockData.contactDetails.addressDetails);
    });


    it('should save phoneDetails server response data to "contact" object', () => {
        sut = createSut();

        deferredGet.resolve(mockData);
        $timeout.flush();

        expect(sut.contact.contactDetails.phoneDetails).toEqual(mockData.contactDetails.phoneDetails);
    });


    it('should save taxDetails server response data to "contact" object', () => {
        sut = createSut();

        deferredGet.resolve(mockData);
        $timeout.flush();

        expect(sut.contact.contactDetails.taxDetails).toEqual(mockData.contactDetails.taxDetails);
    });

    it('should save titleOptions server response data to "contact" object', () => {
        sut = createSut();

        deferredGet.resolve(mockData);
        $timeout.flush();

        expect(sut.contact.contactDetails.titleOptions).toEqual(mockData.contactDetails.titleOptions);
    });

    it('should save notifications and server response data to "contact" object', () => {
        sut = createSut();

        deferredGet.resolve(mockData);
        $timeout.flush();

        expect(sut.contact.notificationSettings)
            .toEqual(jasmine.objectContaining(mockData.notificationSettings));
    });

    it('should clear notifications dto in server response', () => {
        sut = createSut();

        deferredGet.resolve(mockData);
        $timeout.flush();

        expect(sut.contact.notifications)
            .toEqual([]);
    });

    it('should save notificationSettings server response data to "contact" object', () => {
        sut = createSut();

        deferredGet.resolve(mockData);
        $timeout.flush();

        expect(sut.contact.notificationSettings).toEqual(jasmine.objectContaining(mockData.notificationSettings));
    });

    it('should set taxDetails to default value if it is null in server response', () => {
        const getParamFromUrlMockData = {
            mode: 'copy',
            key: mockData.key
        };
        mockData.contactDetails.taxDetails = null;

        navigationServiceMock.getParamFromUrl.and.callFake((key) => getParamFromUrlMockData[key]);
        sut = createSut();
        deferredGet.resolve(mockData);
        $timeout.flush();
        expect(sut.contact.contactDetails.taxDetails).toEqual({});
    });

    it('should set document title to contact name', () => {
        sut = createSut();

        deferredGet.resolve(mockData);
        $timeout.flush();

        expect($mockWindow.document.title).toBe(mockData.contactDetails.name);
    });

    it('should display error if service failed', () => {
        const getParamFromUrlMockData = {
            mode: 'copy',
            key: mockData.key
        };

        const rejectMockData = {
            status: 500,
            data: {
                message: 'fail'
            }
        };

        navigationServiceMock.getParamFromUrl.and.callFake((key) => getParamFromUrlMockData[key]);
        sut = createSut();

        deferredGet.reject(rejectMockData);
        $timeout.flush();

        expect(ewfCrudService.getElementDetails).toHaveBeenCalledWith('/api/addressbook/contact', mockData.key);
    });

    it('should get success result from addContactInfo call', () => {
        const getParamFromUrlMockData = {
            mode: 'copy',
            key: mockData.key
        };

        const mockDataAdd = {name: 'Boris'};

        navigationServiceMock.getParamFromUrl.and.callFake((key) => getParamFromUrlMockData[key]);
        sut = createSut();

        sut.contactInfoAction();

        deferredAdd.resolve(mockDataAdd);
        $timeout.flush();

        expect(ewfCrudService.addElement).toHaveBeenCalled();
        expect(navigationServiceMock.location).toHaveBeenCalledWith('address-book.html');
    });

    it('should get result from failed addContactInfo call', () => {
        const mockDataAddReject = {
            status: 500,
            data: {
                message: 'fail'
            }
        };
        const translationKey = 'address-book.addNewContact_title';
        const translationString = 'some translation';

        navigationServiceMock.getParamFromUrl.and.returnValue(undefined);
        sut = createSut();

        sut.contactInfoAction();

        deferredAdd.reject(mockDataAddReject);
        deferredTranslation.resolve(translationString);
        $timeout.flush();

        expect(ewfCrudService.addElement).toHaveBeenCalled();
        expect(nlsServiceMock.getTranslation).toHaveBeenCalledWith(translationKey);
        expect(sut.contactInfoTitle).toBe(translationString);
    });

    it('should get result from modifyContactInfo call', () => {
        const mockDataModify = {name: 'Boris'};
        const getParamFromUrlMockData = {
            mode: 'modify',
            key: mockData.key
        };

        navigationServiceMock.getParamFromUrl.and.callFake((key) => getParamFromUrlMockData[key]);
        sut = createSut();

        sut.contactInfoAction();

        deferredModify.resolve(mockDataModify);
        $timeout.flush();

        expect(ewfCrudService.updateElement).toHaveBeenCalled();
    });

    it('should get result from failed modifyContactInfo call', () => {
        const getParamFromUrlMockData = {
            mode: 'modify',
            key: mockData.key
        };

        const mockDataModifyReject = {
            status: 500,
            data: {
                message: 'fail'
            }
        };

        navigationServiceMock.getParamFromUrl.and.callFake((key) => getParamFromUrlMockData[key]);
        sut = createSut();
        sut.contactInfoAction();

        deferredModify.reject(mockDataModifyReject);
        $timeout.flush();

        expect(ewfCrudService.updateElement).toHaveBeenCalled();
    });

    it('on delete should call user\'s info', () => {
        const getParamFromUrlMockData = {
            mode: 'copy',
            key: mockData.key
        };

        const contact = {
            key: 'key',
            nickname: ''
        };

        navigationServiceMock.getParamFromUrl.and.callFake((key) => getParamFromUrlMockData[key]);
        sut = createSut();

        deferredGet.reject(contact);
        $timeout.flush();

        expect(ewfCrudService.getElementDetails).toHaveBeenCalled();
        expect(sut.contact.key).toBe(undefined);
    });

    it('should keep contries after update details', () => {
        const countries = [
            {
                capitalizedName: 'Brazil',
                code2: 'BR'
            },
            {
                capitalizedName: 'China, peoples republic',
                code2: 'CN'
            }
        ];

        const updateElementMockResponse = {
            mode: 'modify',
            key: mockData.key,
            contactDetails: {
                addressDetails: {
                    residentialAddress: true
                },
                email: 'asensing@ac.co.uk',
                email2: 'EMAIL2@TEST.COM',
                email3: 'EMAIL3@TEST.COM',
                email4: 'EMAIL4@TEST.COM',
                email5: 'EMAIL5@TEST.COM'
            }
        };

        sut.contact.contactDetails.countries = countries;

        sut.contactInfoAction();

        deferredModify.resolve(updateElementMockResponse);
        $timeout.flush();

        expect(sut.contact.contactDetails.countries).toEqual(countries);
    });

    it('should check if five user emails initialized', () => {
        const updateElementMockResponse = {
            mode: 'modify',
            key: mockData.key,
            contactDetails: {
                addressDetails: {
                    residentialAddress: true
                },
                email: 'asensing@ac.co.uk',
                email2: 'EMAIL2@TEST.COM',
                email3: 'EMAIL3@TEST.COM',
                email4: 'EMAIL4@TEST.COM',
                email5: 'EMAIL5@TEST.COM'
            }
        };

        sut.contactInfoAction();

        deferredModify.resolve(updateElementMockResponse);
        $timeout.flush();

        expect(ewfCrudService.updateElement).toHaveBeenCalled();
        expect(sut.emails.length).toBe(4);
        expect(sut.contact.contactDetails.email).toBe('asensing@ac.co.uk');
        expect(sut.contact.contactDetails.email2).toBe('EMAIL2@TEST.COM');
        expect(sut.contact.contactDetails.email3).toBe('EMAIL3@TEST.COM');
        expect(sut.contact.contactDetails.email4).toBe('EMAIL4@TEST.COM');
        expect(sut.contact.contactDetails.email5).toBe('EMAIL5@TEST.COM');
    });

    it('should check if two user emails initialized', () => {
        const updateElementMockResponse = {
            mode: 'modify',
            key: mockData.key,
            contactDetails: {
                addressDetails: {
                    residentialAddress: true
                },
                email: 'asensing@ac.co.uk',
                email2: 'EMAIL2@TEST.COM',
                email3: '',
                email4: '',
                email5: ''
            }
        };

        sut.contactInfoAction();

        deferredModify.resolve(updateElementMockResponse);
        $timeout.flush();

        expect(ewfCrudService.updateElement).toHaveBeenCalled();
        expect(sut.emails.length).toBe(1);
        expect(sut.contact.contactDetails.email).toBe('asensing@ac.co.uk');
        expect(sut.contact.contactDetails.email2).toBe('EMAIL2@TEST.COM');
        expect(sut.contact.contactDetails.email3).toBe('');
        expect(sut.contact.contactDetails.email4).toBe('');
        expect(sut.contact.contactDetails.email5).toBe('');
    });

    it('should check if new user email added', () => {
        const updateElementMockResponse = {
            mode: 'modify',
            key: mockData.key,
            contactDetails: {
                addressDetails: {
                    residentialAddress: true
                },
                email: 'asensing@ac.co.uk',
                email2: 'EMAIL2@TEST.COM',
                email3: '',
                email4: '',
                email5: ''
            }
        };

        sut.contactInfoAction();

        deferredModify.resolve(updateElementMockResponse);
        $timeout.flush();

        expect(sut.emails.length).toBe(1);
        if (sut.showBottomAddEmailButton()) {
            sut.addUserEmail();
        }

        expect(ewfCrudService.updateElement).toHaveBeenCalled();
        expect(sut.emails.length).toBe(2);
        expect(sut.contact.contactDetails.email).toBe('asensing@ac.co.uk');
        expect(sut.contact.contactDetails.email2).toBe('EMAIL2@TEST.COM');
        expect(sut.contact.contactDetails.email3).toBe('');
        expect(sut.contact.contactDetails.email4).toBe('');
        expect(sut.contact.contactDetails.email5).toBe('');
    });

    it('should disable additional email buttons', () => {
        sut.emails = [
            {value: 'email@test.com'},
            {value: ''}
        ];

        expect(sut.isAdditionalEmailsCorrect({$valid: true})).toBe(false);
    });

    it('should enable additional email buttons', () => {
        sut.emails = [
            {value: 'email@test.com'},
            {value: 'email2@test.com'}
        ];

        expect(sut.isAdditionalEmailsCorrect({$valid: true})).toBe(true);
    });

    it('should check if user email not added', () => {
        const updateElementMockResponse = {
            mode: 'modify',
            key: mockData.key,
            contactDetails: {
                addressDetails: {
                    residentialAddress: true
                },
                email: 'asensing@ac.co.uk',
                email2: 'EMAIL2@TEST.COM',
                email3: 'EMAIL3@TEST.COM',
                email4: 'EMAIL4@TEST.COM',
                email5: 'EMAIL5@TEST.COM'
            }
        };

        sut.contactInfoAction();

        deferredModify.resolve(updateElementMockResponse);
        $timeout.flush();

        expect(sut.emails.length).toBe(4);
        if (sut.showBottomAddEmailButton()) {
            sut.addUserEmail();
        }

        expect(ewfCrudService.updateElement).toHaveBeenCalled();
        expect(sut.emails.length).toBe(4);
        expect(sut.contact.contactDetails.email).toBe('asensing@ac.co.uk');
        expect(sut.contact.contactDetails.email2).toBe('EMAIL2@TEST.COM');
        expect(sut.contact.contactDetails.email3).toBe('EMAIL3@TEST.COM');
        expect(sut.contact.contactDetails.email4).toBe('EMAIL4@TEST.COM');
        expect(sut.contact.contactDetails.email5).toBe('EMAIL5@TEST.COM');
    });

    it('should check if user email deleted', () => {
        const updateElementMockResponse = {
            mode: 'modify',
            key: mockData.key,
            contactDetails: {
                addressDetails: {
                    residentialAddress: true
                },
                email: 'asensing@ac.co.uk',
                email2: 'EMAIL2@TEST.COM',
                email3: 'EMAIL3@TEST.COM',
                email4: 'EMAIL4@TEST.COM',
                email5: 'EMAIL5@TEST.COM'
            }
        };

        sut.contactInfoAction();

        deferredModify.resolve(updateElementMockResponse);
        $timeout.flush();

        expect(sut.emails.length).toBe(4);
        sut.removeUserEmail(sut.emails[3]);

        expect(ewfCrudService.updateElement).toHaveBeenCalled();
        expect(sut.emails.length).toBe(3);
        expect(sut.contact.contactDetails.email).toBe('asensing@ac.co.uk');
        expect(sut.contact.contactDetails.email2).toBe('EMAIL2@TEST.COM');
        expect(sut.contact.contactDetails.email3).toBe('EMAIL3@TEST.COM');
        expect(sut.contact.contactDetails.email4).toBe('EMAIL4@TEST.COM');
        expect(sut.contact.contactDetails.email5).toBe('');
    });

    it('should filter empty addressbook notification before saving to the server', () => {
        sut.contact.notificationSettings = [
            {type: 'SMS', destination: ''},
            {type: 'EMAIL', destination: 'mail@example.com'},
            {type: 'SMS', destination: ''}
        ];

        sut.contactInfoAction();

        const actualContact = ewfCrudService.updateElement.calls.mostRecent().args[1];
        expect(actualContact.notifications.emailNotifications).toEqual([
            {type: 'EMAIL', destination: 'mail@example.com', email: 'mail@example.com'}
        ]);
        expect(actualContact.notifications.smsNotifications).toEqual([]);
    });

    it('should add default notifications if all of them are empty', () => {
        sut.contact.notificationSettings = [
            {type: 'SMS', destination: ''},
            {type: 'EMAIL', destination: ''},
            {type: 'SMS', destination: ''}
        ];
        sut.defaultNotificationEmail = 'mail@example.com';
        sut.contactInfoAction();

        const actualContact = ewfCrudService.updateElement.calls.mostRecent().args[1];

        expect(actualContact.notifications.emailNotifications.length).toEqual(1);
        expect(actualContact.notifications.emailNotifications[0].destination).toEqual(sut.defaultNotificationEmail);
        expect(actualContact.notifications.emailNotifications[0].type).toEqual('EMAIL');

        expect(actualContact.notifications.smsNotifications).toEqual([]);
    });

    describe('#submitContactInfo', () => {
        beforeEach(() => {
            spyOn(sut, 'contactInfoAction');
            ewfFormCtrlMock.ewfValidation.and.returnValue(true);
        });

        it('should validate all fields and run save contact after', () => {
            const contactDetailsFormMock = {
                $valid: true
            };
            sut.submitContactInfo(ewfFormCtrlMock, contactDetailsFormMock);

            expect(sut.contactInfoAction).toHaveBeenCalled();
        });

        it('should not save contact if form is not valid', () => {
            const contactDetailsFormMock = {
                $valid: false
            };

            sut.submitContactInfo(ewfFormCtrlMock, contactDetailsFormMock);

            expect(sut.contactInfoAction).not.toHaveBeenCalled();
        });
    });

    describe('#checkCpfCnpjLength', () => {
        it('should set "cpfCnpjLength" to 15 for CNPJ', () => {
            sut.checkCpfCnpjLength('CNPJ');
            expect(sut.cpfCnpjLength).toBe(15);
        });

        it('should set "cpfCnpjLength" to 11 for CPF', () => {
            sut.checkCpfCnpjLength('CPF');
            expect(sut.cpfCnpjLength).toBe(11);
        });
    });

    describe('#isAdditionalEmailsCorrect', () => {
        it('should be true when emails list is empty', () => {
            const contactEmailsForm = {};
            sut.emails = [];

            expect(sut.isAdditionalEmailsCorrect(contactEmailsForm)).toBe(true);
        });

        it('should be true when contactEmailsForm is valid and the last email is not empty', () => {
            const contactEmailsForm = {
                $valid: true
            };
            sut.emails = [{value: 'test1@example.com'}, {value: 'test2@example.com'}];

            expect(sut.isAdditionalEmailsCorrect(contactEmailsForm)).toBe(true);
        });

        it('should return false when contactEmailsForm is invalid and non-empty emails list', () => {
            const contactEmailsForm = {
                $valid: false
            };
            sut.emails = [{value: 'test1@example.com'}];

            expect(sut.isAdditionalEmailsCorrect(contactEmailsForm)).toBe(false);
        });

        it('should return false when contactEmailsForm is valid and the last email is empty', () => {
            const contactEmailsForm = {
                $valid: true
            };
            sut.emails = [{value: ''}];

            expect(sut.isAdditionalEmailsCorrect(contactEmailsForm)).toBe(false);
        });
    });
});
