import AddressDetailsController from './address-details-controller';
import ShipmentService from './../ewf-shipment-service';
import EwfCrudService from './../../../services/ewf-crud-service';
import LocationService from '../../../services/location-service';
import ModalService from './../../../services/modal/modal-service';
import NavigationService from './../../../services/navigation-service';
import UserService from './../../../services/user-service';
import 'angularMocks';

describe('AddressDetailsController', () => {

    let sut;
    let ewfCrudService;
    let shipmentService;
    let addressDetailsService;
    let profileShipmentService;
    let nlsService;
    let locationService;
    let $q;
    let deferred;
    let userCanImportDeferred;
    let deferredWhoAmI;
    let $scope;
    let modalService;
    let modalWindow;
    let userService;
    let navigationService;
    let $timeout;

    const contactDetails = {
        name: 'name',
        company: 'company',
        nickname: 'nickName',
        addressDetails: {
            addrLine1: '1',
            addrLine2: '2',
            addrLine3: '3',
            residentialAddress: true
        },
        phoneDetails: {
            phone: '123123'
        },
        taxDetails: {
            tax: 123.123
        }
    };

    const phoneDetails = {
        phone: contactDetails.phoneDetails.phone
    };
    const addressDetails = {
        addrLine1: contactDetails.addressDetails.addrLine1,
        addrLine2: contactDetails.addressDetails.addrLine2,
        addrLine3: contactDetails.addressDetails.addrLine3,
        key: undefined,
        city: undefined,
        stateOrProvince: undefined,
        zipOrPostCode: undefined,
        countryCode: undefined,
        countryName: undefined,
        residentialAddress: true
    };

    beforeEach(module('ewf'));
    beforeEach(inject((_$q_, _$rootScope_, _$timeout_) => {
        $q = _$q_;
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;
        nlsService = jasmine.createSpyObj('nlsService', ['getTranslation', 'getTranslationSync']);

        locationService = jasmine.mockComponent(new LocationService());
        locationService.loadAvailableLocations.and.returnValue($q.when([]));

        ewfCrudService = jasmine.mockComponent(new EwfCrudService());
        shipmentService = jasmine.mockComponent(new ShipmentService());
        addressDetailsService = jasmine.createSpyObj('addressDetailsService', ['checkUserCanImport']);
        userService = jasmine.mockComponent(new UserService());
        modalWindow = jasmine.createSpyObj('modalWindow', ['close']);
        modalService = jasmine.mockComponent(new ModalService());
        modalService.showDialog.and.returnValue(modalWindow);

        deferredWhoAmI = $q.defer();
        deferred = $q.defer();
        userCanImportDeferred = $q.defer();

        ewfCrudService.getElementDetails.and.returnValue(deferred.promise);
        ewfCrudService.addElement.and.returnValue(deferred.promise);
        ewfCrudService.updateElement.and.returnValue(deferred.promise);
        userService.whoAmI.and.returnValue(deferredWhoAmI.promise);
        addressDetailsService.checkUserCanImport.and.returnValue(userCanImportDeferred.promise);
        nlsService.getTranslationSync.and.returnValue('error');

        profileShipmentService = jasmine.createSpyObj('profileShipmentService', ['getDefaultSavingShipment']);

        profileShipmentService.getDefaultSavingShipment.and.returnValue(deferred.promise);

        navigationService = jasmine.mockComponent(new NavigationService());

        sut = new AddressDetailsController($q,
            $scope,
            locationService,
            navigationService,
            modalService,
            nlsService,
            userService,
            ewfCrudService,
            shipmentService,
            addressDetailsService,
            profileShipmentService
        );
    }));

    describe('#init', () => {

        it('should get contact info when invoked by regular user', () => {
            const whoami = {
                userName: 's@t.com',
                groups: ['regular']
            };
            sut.init();
            deferredWhoAmI.resolve(whoami);
            $timeout.flush();
            expect(sut.isAuthorized).toEqual(true);
        });

        it('should get saving shipment flag with service', () => {
            sut.init();
            expect(profileShipmentService.getDefaultSavingShipment).toHaveBeenCalled();
        });

        it('should initialize location list', () => {
            expect(locationService.loadAvailableLocations).toHaveBeenCalledWith();
        });
    });

    describe('#updateContact', () => {
        describe('should update From Contact if was choosen update action for it', () => {
            beforeEach(() => {
                const identificator = 'from';
                sut.fromContactFields = {
                    addressDetails: {
                        key: 'd2313rfe2d'
                    },
                    nickname: 'nick'
                };
                sut.showSaveContactDialog();
                sut.updateContact(identificator);

                deferred.resolve();
                $timeout.flush();
            });

            it('should show update confirmation for From Contact', () => {
                expect(sut.updateFromConfirmed).toEqual(true);
            });

        });
        describe('should update To Contact if was chosen update action for it', () => {
            beforeEach(() => {
                const identificator = 'to';
                sut.toContactFields = {
                    addressDetails: {
                        key: 'd2313rfe2d'
                    },
                    nickname: 'nick'
                };
                sut.showSaveContactDialog();
                sut.updateContact(identificator);

                deferred.resolve();
                $timeout.flush();
            });

            it('should show update confirmation for To Contact', () => {
                expect(sut.updateToConfirmed).toEqual(true);
            });
        });
    });

    describe('#onNextClick', () => {
        it('should save data to the shipment service', () => {
            let nextCallback = jasmine.createSpy('nextCallback');
            sut.setNextCallback(nextCallback);

            sut.fromContactFields = {
                test: 'test',
                addressType: 'RESIDENTIAL',
                addressDetails: {
                    key: 123,
                    addrLine1: 'test'
                },
                phoneDetails: {}
            };

            sut.toContactFields = {
                test: 'test',
                addressType: 'NOT_RESIDENTIAL',
                addressDetails: {
                    key: 123,
                    addrLine1: 'test'
                },
                phoneDetails: {}
            };

            sut.onNextClick({$valid: true});

            expect(shipmentService.setAddressDetails).toHaveBeenCalledWith(sut.fromContactFields, sut.toContactFields);
            expect(shipmentService.setPhoneDetails).toHaveBeenCalledWith(sut.fromContactFields, sut.toContactFields);
        });

        it('should call next callback', () => {
            let nextCallback = jasmine.createSpy('nextCallback');
            sut.setNextCallback(nextCallback);

            sut.fromContactFields = {
                test: 'test',
                addressDetails: {
                    key: 123,
                    addrLine1: 'test'
                }
            };

            sut.toContactFields = {
                test: 'test',
                addressDetails: {
                    key: 123,
                    addrLine1: 'test'
                }
            };

            sut.onNextClick({$valid: true});

            expect(nextCallback).toHaveBeenCalled();
        });
    });

    describe('#onEditClick', () => {
        it('should call edit callback', () => {
            let editCallback = jasmine.createSpy('editCallback');
            sut.setEditCallback(editCallback);

            sut.onEditClick();

            expect(editCallback).toHaveBeenCalled();
        });
    });

    describe('clear address callbacks', () => {
        it('should set fromShowCreateButton to false when fromContactFields is empty', () => {
            sut.init();
            sut.fromContactFields = {
                phoneDetails: {},
                countries: ['US', 'DE']
            };
            $scope.$apply();
            expect(sut.fromShowCreateButton).toBe(false);
        });

        it('should set fromShowCreateButton to true when fromContactFields is not empty', () => {
            sut.init();
            sut.fromContactFields.test = 'test';
            $scope.$apply();
            expect(sut.fromShowCreateButton).toBe(true);
        });

        it('should hide update confirmation when fromContactFields changes', () => {
            sut.init();
            sut.updateFromConfirmed = true;
            sut.fromContactFields.test = 'test';
            sut.fromContactFields.addressDetails = {
                key: 12345
            };
            $scope.$apply();
            expect(sut.updateFromConfirmed).toBe(false);
        });

        it('should set fromShowCreateButton to false when fromContactFields is empty again', () => {
            sut.init();
            sut.fromContactFields.test = 'test';
            $scope.$apply();
            sut.fromContactFields.test = '';
            $scope.$apply();
            expect(sut.fromShowCreateButton).toBe(false);
        });

        it('should set toShowCreateButton to false when toContactFields is empty', () => {
            sut.init();
            sut.toContactFields = {
                phoneDetails: {},
                countries: ['US', 'DE']
            };
            $scope.$apply();
            expect(sut.toShowCreateButton).toBe(false);
        });

        it('should set toShowCreateButton to true when toContactFields is not empty', () => {
            sut.init();
            sut.toContactFields.test = 'test';
            $scope.$apply();
            expect(sut.toShowCreateButton).toBe(true);
        });

        it('should hide update confirmation when toContactFields changes', () => {
            sut.init();
            sut.updateToConfirmed = true;
            sut.toContactFields.test = 'test';
            sut.toContactFields.addressDetails = {
                key: 12345
            };
            $scope.$apply();
            expect(sut.updateToConfirmed).toBe(false);
        });

        it('should set toShowCreateButton to false when fromContactFields is empty again', () => {
            sut.init();
            sut.toContactFields.test = 'test';
            $scope.$apply();
            sut.toContactFields.test = '';
            $scope.$apply();
            expect(sut.toShowCreateButton).toBe(false);
        });
    });

    describe('#clearAddressFrom', () => {
        it('should clear all address fields', () => {
            const expectedObject = {
                countries: jasmine.any(Array),
                phoneDetails: {}
            };

            sut.fromContactFields = {
                field: 'value',
                field2: 'value2'
            };

            sut.clearAddressFrom();

            expect(sut.fromContactFields).toEqual(expectedObject);
        });
    });
    describe('#clearAddressTo', () => {
        it('should clear all address fields', () => {
            const expectedObject = {
                countries: jasmine.any(Array),
                phoneDetails: {}
            };

            sut.toContactFields = {
                field: 'value',
                field2: 'value2'
            };

            sut.clearAddressTo();

            expect(sut.toContactFields).toEqual(expectedObject);
        });
    });

    describe('#normalizeAddress', () => {
        it('should return address string when address is string', () => {
            const address = 'address';
            const returnedAddress = sut.normalizeAddress(address);
            expect(returnedAddress).toBe(address);
        });
        it('should return address string when address is object from autocomplete', () => {
            const address = {
                name: 'address'
            };
            const returnedAddress = sut.normalizeAddress(address);
            expect(returnedAddress).toBe(address.name);
        });
    });

    describe('#swapAddresses', () => {
        let fromContactFields;
        let toContactFields;

        beforeEach(() => {
            fromContactFields = {
                field: 'value1',
                field2: 'value2',
                addressDetails: {
                    countryCode: 'US'
                }
            };
            toContactFields = {
                field: 'value3',
                field2: 'value4',
                addressDetails: {
                    countryCode: 'US'
                }
            };
        });

        it('should get default user country', () => {
            sut.fromContactFields = fromContactFields;
            sut.toContactFields = toContactFields;

            sut.swapAddresses();

            expect(userService.whoAmI).toHaveBeenCalled();
        });

        it('should swap addresses', () => {
            sut.fromContactFields = fromContactFields;
            sut.toContactFields = toContactFields;

            sut.swapAddresses();

            deferredWhoAmI.resolve({
                countryCode2: 'US'
            });

            $scope.$apply();

            expect(sut.fromContactFields).toEqual(toContactFields);
            expect(sut.toContactFields).toEqual(fromContactFields);
        });

        it('should not swap address when fromContactField is empty', () => {
            fromContactFields.addressDetails.countryCode = '';
            toContactFields.addressDetails.countryCode = 'US';

            sut.fromContactFields = fromContactFields;
            sut.toContactFields = toContactFields;

            sut.swapAddresses();

            deferred.resolve({
                countryCode2: 'US'
            });

            $scope.$apply();

            expect(sut.toContactFields).not.toEqual(fromContactFields);
            expect(sut.fromContactFields).not.toEqual(toContactFields);
        });

        it('should not swap address when toContactField is empty', () => {
            fromContactFields.addressDetails.countryCode = 'US';
            toContactFields.addressDetails.countryCode = '';

            sut.fromContactFields = fromContactFields;
            sut.toContactFields = toContactFields;

            sut.swapAddresses();

            deferred.resolve({
                countryCode2: 'US'
            });

            $scope.$apply();

            expect(sut.toContactFields).not.toEqual(fromContactFields);
            expect(sut.fromContactFields).not.toEqual(toContactFields);
        });

        it('should show popup when user country is different with country in toContactFields', () => {
            toContactFields.addressDetails.countryCode = 'Another country code';

            sut.fromContactFields = fromContactFields;
            sut.toContactFields = toContactFields;

            sut.swapAddresses();

            deferredWhoAmI.resolve({
                countryCode2: 'US'
            });

            $scope.$apply();

            expect(modalService.showDialog).toHaveBeenCalled();
        });


    });
    describe('#checkImportAccountNumber', () => {
        let fromContactFields;
        let toContactFields;

        beforeEach(() => {
            fromContactFields = {
                field: 'value1',
                field2: 'value2',
                addressDetails: {
                    countryCode: {
                        value: 'US'
                    }
                }
            };
            toContactFields = {
                field: 'value3',
                field2: 'value4',
                addressDetails: {
                    countryCode: {
                        value: 'US'
                    }
                }
            };

            sut.fromContactFields = fromContactFields;
            sut.toContactFields = toContactFields;
        });

        it('should swap addresses when import account number is valid', () => {
            sut.showSaveContactDialog();
            sut.checkImportAccountNumber();

            userCanImportDeferred.resolve({});

            $scope.$apply();

            expect(sut.fromContactFields).toEqual(toContactFields);
            expect(sut.toContactFields).toEqual(fromContactFields);
        });

        it('should set an error message when service got an error', () => {
            sut.checkImportAccountNumber();

            userCanImportDeferred.reject();

            $scope.$apply();

            expect(sut.error).toEqual('error');
        });
    });

    describe('#showSaveContactDialog', () => {
        it('should open save contact dialog', () => {
            sut.showSaveContactDialog();
            expect(modalService.showDialog).toHaveBeenCalled();
        });
    });

    describe('#saveContact', () => {
        it('should save FROM contact data', () => {
            sut.showSaveContactDialog('from');

            const nickname = 'some nickname';
            const url = '/api/addressbook/contact/add';

            sut.fromContactFields = {
                name: 'name',
                company: 'company',
                email: 'some@email.com',
                addressDetails: {
                    addrLine1: 'some addrline',
                    addrLine2: '',
                    addrLine3: '',
                    zipOrPostCode: '12345',
                    city: 'some city',
                    stateOrProvince: 'some state',
                    countryCode: {
                        value: 'US'
                    }
                }
            };

            const countryCode = sut.fromContactFields.addressDetails.countryCode.value;

            const expected = {
                contactDetails: {
                    addressDetails: sut.fromContactFields.addressDetails,
                    phoneDetails: {},
                    name: 'name',
                    company: 'company',
                    email: 'some@email.com',
                    nickname
                },
                notifications: {
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
                }
            };

            expected.contactDetails.addressDetails.countryCode = countryCode;
            expected.contactDetails.addressDetails.residentialAddress =
                !!sut.fromContactFields.addressDetails.residentialAddress;

            $scope.saveContact(nickname, sut.fromContactFields, 'from');

            expect(ewfCrudService.addElement).toHaveBeenCalledWith(url, expected);
        });

        it('should show confirmation when successfully saved FROM contact data', () => {
            sut.showSaveContactDialog('from');

            const nickname = 'some nickname';

            sut.fromContactFields = {
                name: 'name',
                company: 'company',
                email: 'some@email.com',
                addressDetails: {
                    addrLine1: 'some addrline',
                    addrLine2: '',
                    addrLine3: '',
                    zipOrPostCode: '12345',
                    city: 'some city',
                    stateOrProvince: 'some state',
                    countryCode: {
                        value: 'US'
                    }
                }
            };

            $scope.saveContact(nickname, sut.fromContactFields, 'from');
            deferred.resolve();
            $timeout.flush();

            expect(sut.saveFromConfirmed).toBe(true);
        });

        it('should save TO contact data', () => {
            sut.showSaveContactDialog('to');

            const nickname = 'some nickname';
            const url = '/api/addressbook/contact/add';

            sut.toContactFields = {
                name: 'name',
                company: 'company',
                email: 'some@email.com',
                addressDetails: {
                    addrLine1: 'some addrline',
                    addrLine2: '',
                    addrLine3: '',
                    zipOrPostCode: '12345',
                    city: 'some city',
                    stateOrProvince: 'some state',
                    countryCode: {
                        value: 'US'
                    }
                }
            };

            const countryCode = sut.toContactFields.addressDetails.countryCode.value;

            const expected = {
                contactDetails: {
                    addressDetails: sut.toContactFields.addressDetails,
                    phoneDetails: {},
                    name: 'name',
                    company: 'company',
                    email: 'some@email.com',
                    nickname
                },
                notifications: {
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
                }
            };

            expected.contactDetails.addressDetails.countryCode = countryCode;
            expected.contactDetails.addressDetails.residentialAddress =
                !!sut.toContactFields.addressDetails.residentialAddress;

            $scope.saveContact(nickname, sut.toContactFields, 'to');

            expect(ewfCrudService.addElement).toHaveBeenCalledWith(url, expected);
        });

        it('should show confirmation when successfully saved TO contact data', () => {
            sut.showSaveContactDialog('to');

            const nickname = 'some nickname';

            sut.toContactFields = {
                name: 'name',
                company: 'company',
                email: 'some@email.com',
                addressDetails: {
                    addrLine1: 'some addrline',
                    addrLine2: '',
                    addrLine3: '',
                    zipOrPostCode: '12345',
                    city: 'some city',
                    stateOrProvince: 'some state',
                    countryCode: {
                        value: 'US'
                    }
                }
            };

            $scope.saveContact(nickname, sut.toContactFields, 'to');

            deferred.resolve();
            $timeout.flush();

            expect(sut.saveToConfirmed).toBe(true);

        });
    });

    describe('getCurrentIncompleteData', () => {
        it('should get data without validation', () => {
            sut.init();
            sut.fromContactFields = {
                test: 'test',
                addressDetails: {
                    key: 123,
                    addrLine1: 'test'
                },
                phoneDetails: {}
            };

            sut.toContactFields = {
                test: 'test',
                addressDetails: {
                    key: 123,
                    addrLine1: 'test'
                },
                phoneDetails: {}
            };

            sut.getCurrentIncompleteData();

            expect(shipmentService.setAddressDetails).toHaveBeenCalledWith(sut.fromContactFields, sut.toContactFields);
            expect(shipmentService.setPhoneDetails).toHaveBeenCalledWith(sut.fromContactFields, sut.toContactFields);
        });
        it('should get data without validation when some data is absent', () => {
            sut.init();
            sut.fromContactFields = {
                test: 'test'
            };

            sut.toContactFields = {
                test: 'test'
            };

            sut.getCurrentIncompleteData();

            expect(shipmentService.setAddressDetails).toHaveBeenCalledWith(sut.fromContactFields, sut.toContactFields);
            expect(shipmentService.setPhoneDetails).toHaveBeenCalledWith(sut.fromContactFields, sut.toContactFields);
        });
    });

    describe('FROM form filling', () => {
        beforeEach(() => {
            sut.fromContactFields = {};
            sut.typeaheadSelected({key: '001'}, sut.FROM, {});
            deferred.resolve({contactDetails});
            $timeout.flush();
            sut.fromContactFields.addressDetails.countryCode = undefined;
        });

        it('should fill phone details in shipment FROM form after typeahead match item click', () => {
            expect(sut.fromContactFields.phoneDetails.phone).toEqual(phoneDetails.phone);
        });

        it('should fill address details in shipment FROM form after typeahead match item click', () => {
            expect(sut.fromContactFields.addressDetails).toEqual(addressDetails);
        });

        it('should fill nick name in shipment FROM form after typeahead match item click', () => {
            expect(sut.fromContactFields.nickname).toEqual(contactDetails.nickname);
        });

        it('should fill company name in shipment FROM form after typeahead match item click', () => {
            expect(sut.fromContactFields.company).toEqual(contactDetails.company);
        });

        it('should fill contact name in shipment FROM form after typeahead match item click', () => {
            expect(sut.fromContactFields.name).toEqual(contactDetails.name);
        });
    });

    describe('TO form filling', () => {
        beforeEach(() => {
            sut.toContactFields = {};
            sut.typeaheadSelected({key: '001'}, sut.TO, {});
            contactDetails.addressType = 'OTHER';
            contactDetails.addressDetails.residentialAddress = undefined;
            deferred.resolve({contactDetails});
            $timeout.flush();
            sut.toContactFields.addressDetails.countryCode = undefined;
        });

        it('should fill phone details in shipment TO form after typeahead match item click', () => {
            expect(sut.toContactFields.phoneDetails.phone).toEqual(phoneDetails.phone);
        });

        it('should fill address details in shipment TO form after typeahead match item click', () => {
            addressDetails.residentialAddress = false;
            expect(sut.toContactFields.addressDetails).toEqual(addressDetails);
        });

        it('should fill nick name in shipment TO form after typeahead match item click', () => {
            expect(sut.toContactFields.nickname).toEqual(contactDetails.nickname);
        });

        it('should fill company name in shipment TO form after typeahead match item click', () => {
            expect(sut.toContactFields.company).toEqual(contactDetails.company);
        });

        it('should fill contact name in shipment TO form after typeahead match item click', () => {
            expect(sut.toContactFields.name).toEqual(contactDetails.name);
        });
    });

    describe('#redirectToHelpCenterPage', () => {
        it('should navigate to help center page', () => {
            sut.redirectToHelpCenterPage();

            expect(navigationService.location).toHaveBeenCalledWith('help-center.html');
        });
    });

    describe('#loadShipmentData', () => {
        const fromContactFields = {
            addressDetails: {
                addrLine1: 'From Address Line 1'
            }
        };
        const toContactFields = {
            addressDetails: {
                addrLine1: 'To Address Line 1'
            }
        };
        const shipmentData = {};

        beforeEach(() => {
            shipmentService.getFromContactFields.and.returnValue(fromContactFields);
            shipmentService.getToContactFields.and.returnValue(toContactFields);

            sut.loadShipmentData(shipmentData);
        });

        it('should populate from contact fields', () => {
            expect(shipmentService.getFromContactFields).toHaveBeenCalledWith(shipmentData);
            expect(sut.fromContactFields).toEqual(jasmine.objectContaining(fromContactFields));
        });

        it('should populate to contact fields', () => {
            expect(shipmentService.getToContactFields).toHaveBeenCalledWith(shipmentData);
            expect(sut.toContactFields).toEqual(jasmine.objectContaining(toContactFields));
        });

        it('should set from address line for synopsis', () => {
            expect(sut.addLineFrom).toEqual(fromContactFields.addressDetails.addrLine1);
        });

        it('should set from address line for synopsis', () => {
            expect(sut.addLineTo).toEqual(toContactFields.addressDetails.addrLine1);
        });
    });
});
