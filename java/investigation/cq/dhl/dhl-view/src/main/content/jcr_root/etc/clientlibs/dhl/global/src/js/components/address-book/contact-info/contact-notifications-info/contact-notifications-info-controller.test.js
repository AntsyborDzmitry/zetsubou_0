import EwfContactNotificationsInfoController from './contact-notifications-info-controller';
import LocationService from './../../../../services/location-service';

import 'angularMocks';

describe('EwfContactNotificationsInfoController', () => {
    let sut, $q, $timeout, $scope, deferedGet;
    let locationServiceMock;
    let attrsServiceMock;

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $scope = _$rootScope_.$new();
        deferedGet = $q.defer();
        attrsServiceMock = {
            track: () => {}
        };

        locationServiceMock = jasmine.mockComponent(new LocationService());

        locationServiceMock.loadAvailableLocations.and.returnValue(deferedGet.promise);

        sut = new EwfContactNotificationsInfoController($scope, {}, attrsServiceMock, locationServiceMock);
    }));

    it('should call location service on init', () => {
        sut.init();

        expect(locationServiceMock.loadAvailableLocations).toHaveBeenCalled();
    });

    it('should set response to a controllers own property', () => {
        const countryCodesMock = {countryCode: '33'};

        sut.getPhoneCodes();

        deferedGet.resolve(countryCodesMock);
        $timeout.flush();

        expect(sut.attributes.countryCodes).toBe(countryCodesMock);
    });

    describe('#toggleLayout', () => {
        it('should init to false', () => {
            expect(sut.isEditing).toBe(false);
        });

        it('should invert value', () => {
            sut.toggleLayout();
            expect(sut.isEditing).toBe(true);
        });
    });

    describe('#toggleHelpActive', () => {
        it('should init to undefined', () => {
            expect(sut.helpActive[1]).toBe(undefined);
        });

        it('should invert value of slider appereance', () => {
            sut.toggleHelpActive(1);
            expect(sut.helpActive[1]).toBe(true);
        });
    });

    describe('#clearDestination', () => {

        it('should clear destination', () => {
            sut.attributes = {
                notificationSettings: [{
                     type: 'EMAIL',
                     destination: 's@t.com',
                     language: 'en',
                     notificationPreference: {
                         pickup: false,
                         clearanceDelay: false,
                         customsClearance: false,
                         exception: false,
                         outForDelivery: false,
                         delivered: false
                     }
                }]
            };

            sut.clearDestination(sut.attributes.notificationSettings[0]);
            expect(sut.attributes.notificationSettings[0].destination).toBe('');
        });
    });

    describe('#canAddContactNotification', () => {
        let contactNotificationsInfoForm;

        describe('valid notification form', () => {
            beforeEach(() => {
                contactNotificationsInfoForm = {$valid: true};
            });

            it('should allow adding new notification for valid EMAIL notifications', () => {
                sut.attributes.notificationSettings = [
                    {
                        type: 'EMAIL',
                        destination: 'email1@example.com'
                    },
                    {
                        type: 'EMAIL',
                        destination: 'emal2@example.com'
                    }
                ];
                expect(sut.canAddContactNotification(contactNotificationsInfoForm)).toBe(true);
            });

            it('should allow adding new notification for valid SMS notifications', () => {
                sut.attributes.notificationSettings = [
                    {
                        type: 'SMS',
                        phoneCountryCode: '380',
                        destination: '1234567'
                    },
                    {
                        type: 'SMS',
                        phoneCountryCode: '123',
                        destination: '98755331123'
                    }
                ];
                expect(sut.canAddContactNotification(contactNotificationsInfoForm)).toBe(true);
            });

            it('should not allow adding new notification if at least one EMAIL notifications is invalid', () => {
                sut.attributes.notificationSettings = [
                    {
                        type: 'EMAIL',
                        destination: 'email1@example.com'
                    },
                    {
                        type: 'EMAIL',
                        destination: ''
                    }
                ];
                expect(sut.canAddContactNotification(contactNotificationsInfoForm)).toBe(false);
            });

            it('should not allow adding new notification if at least one SMS notifications is invalid', () => {
                sut.attributes.notificationSettings = [
                    {
                        type: 'SMS',
                        destination: ''
                    },
                    {
                        type: 'SMS',
                        destination: '121331414124'
                    }
                ];
                expect(sut.canAddContactNotification(contactNotificationsInfoForm)).toBe(false);
            });

            it('should not allow adding new notification if at least one SMS notifications code is invalid', () => {
                contactNotificationsInfoForm = {$valid: true};
                sut.attributes.notificationSettings = [
                    {
                        type: 'SMS',
                        destination: '121313',
                        phoneCountryCode: '987'
                    },
                    {
                        type: 'SMS',
                        destination: '121331414124',
                        phoneCountryCode: ''
                    }
                ];
                expect(sut.canAddContactNotification(contactNotificationsInfoForm)).toBe(false);
            });

        });

        it('should not allow adding new notification when notifications Form is invalid', () => {
            contactNotificationsInfoForm = {$valid: false};
            sut.attributes.notificationSettings = [
                {
                    type: 'SMS',
                    phoneCountryCode: '380',
                    destination: '1234567'
                }
            ];
            expect(sut.canAddContactNotification(contactNotificationsInfoForm)).toBe(false);
        });
    });
});
