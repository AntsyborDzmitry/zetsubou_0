import EwfPickupController from './ewf-pickup-controller';
import PickupService from './pickup-service';
import ShipmentService from './../ewf-shipment-service';
import EwfShipmentStepBaseController from './../ewf-shipment-step-base-controller';
import NlsService from './../../../services/nls-service';
import DateTimeService from './../../../services/date-time-service';
import ShipmentProductsService from './../shipment-products/shipment-products-service';
import ModalService from './../../../services/modal/modal-service';
import ConfigService from './../../../services/config-service';
import 'angularMocks';

describe('EwfPickupController', () => {
    let sut;
    let $q, $timeout, $sce, $location, $scope;
    let nlsService, pickupService, shipmentService, configService;
    let dateTimeService, shipmentProductsService, modalService;
    let defer, defaultsDefer;
    let product, pickupLocations;

    beforeEach(inject((_$q_, _$timeout_, _$sce_, _$location_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $sce = _$sce_;
        $scope = _$rootScope_.$new();
        $location = _$location_;
        defer = $q.defer();
        defaultsDefer = $q.defer();


        nlsService = jasmine.mockComponent(new NlsService());
        pickupService = jasmine.mockComponent(new PickupService());
        shipmentService = jasmine.mockComponent(new ShipmentService());
        dateTimeService = jasmine.mockComponent(new DateTimeService());
        shipmentProductsService = jasmine.mockComponent(new ShipmentProductsService());
        modalService = jasmine.mockComponent(new ModalService());
        configService = jasmine.mockComponent(new ConfigService());

        shipmentService.getShipmentCountry.and.returnValue('US');
        shipmentProductsService.getShipmentTimezoneOffset.and.returnValue(-18000000);
        pickupService.getPickupLocations.and.returnValue(defer.promise);
        pickupService.getUserProfileDefaultValues.and.returnValue(defaultsDefer.promise);
        pickupService.getBookingReferenceNumber.and.returnValue($q.when());
        nlsService.getTranslationSync.and.returnValue('');

        product = {
            pickupDate: '01-01-2014',
            bookingCutoffOffset: 5400000,
            pickupStartTime: 43200000,
            pickupEndTime: 86400000,
            pickupCutoffTime: 75600000
        };
        pickupLocations = [
            {name: 'FRONT DOOR'},
            {name: 'BACK DOOR'},
            {name: 'RECEPTION'},
            {name: 'LOADING DOCK'},
            {name: 'OTHER'}
        ];
        shipmentService.getShipmentProduct.and.returnValue(product);

        dateTimeService.minToMs = function(time) {
            return time * 60000;
        };

        dateTimeService.msToMin = function(time) {
            return time / 60000;
        };

        sut = new EwfPickupController($scope,
                                      $timeout,
                                      $sce,
                                      $location,
                                      nlsService,
                                      pickupService,
                                      shipmentService,
                                      shipmentProductsService,
                                      dateTimeService,
                                      modalService,
                                      configService);
    }));

    describe('#constructor', () => {
        it('should be instance of EwfShipmentStepBaseController', () => {
            expect(sut instanceof EwfShipmentStepBaseController).toBe(true);
        });
        it('should set name property', () => {
            expect(sut.name).toBe('schedule-pickup');
        });
    });

    describe('#onInit', () => {
        let defaults;

        beforeEach(() => {
            defaults = {
                pickupDefaultType: 'NONE',
                pickupDetails: {
                    pickupLocationType: 'Front_door',
                    pickupLocationOtherDescription: null,
                    instructions: null,
                    pickupWindow: {
                        earliestTime: 800,
                        latestTime: 1380
                    }
                }
            };
            sut.isPickupScheduled = false;
            pickupService.getBookingReferenceNumber.and.returnValue($q.when(2));
            shipmentService.getPickupData.and.returnValue({});
        });

        it('should save shipment country to shipmentCountry', () => {
            const country = 'UK';
            shipmentService.getShipmentCountry.and.returnValue(country);
            sut.onInit();
            expect(sut.shipmentCountry).toBe(country);
        });

        it('should set total pickup weight and its uom', () => {
            const data = {
                value: '20',
                unit: 'shipment.package_details_kg'
            };
            shipmentService.getTotalWeight.and.returnValue(data);
            sut.onInit();
            expect(sut.totalPickupWeight).toEqual(data);
        });

        it('should pre-set reference number', () => {
            const pickupDate = jasmine.any(String);
            const pickupAddress = jasmine.any(Object);
            shipmentService.getShipmentProduct.and.returnValue({pickupDate});
            shipmentService.getFormattedShipperAddress.and.returnValue(pickupAddress);
            sut.onInit();
            $timeout.flush();
            expect(pickupService.getBookingReferenceNumber).toHaveBeenCalledWith(pickupDate, pickupAddress);
            expect(sut.referenceNumber).toBe(2);
        });

        it('should get list of pickup default values from user profile', () => {
            sut.onInit();
            $timeout.flush();
            expect(pickupService.getUserProfileDefaultValues).toHaveBeenCalled();
        });

        it('should not pre-select pickup/dropoff needed if there are no user profile default values', () => {
            const deferred = $q.defer();
            sut.howStartShipping = null;
            pickupService.getBookingReferenceNumber.and.returnValue(deferred.promise);
            sut.onInit();
            defaultsDefer.reject();
            deferred.reject();
            $timeout.flush();
            expect(sut.howStartShipping).toBe(null);
        });

        it('should pre-select pickup needed by user profile defaults', () => {
            const deferred = $q.defer();
            defaults.pickupDefaultType = 'YES_COURIER';
            pickupService.getBookingReferenceNumber.and.returnValue(deferred.promise);
            sut.onInit();
            defaultsDefer.resolve(defaults);
            deferred.reject();
            $timeout.flush();
            expect(sut.howStartShipping).toBe('pickup');
        });

        it('should pre-select dropoff if there is scheduled pickup if there are user default values', () => {
            const pickupDate = jasmine.any(String);
            const pickupAddress = jasmine.any(Object);
            shipmentService.getShipmentProduct.and.returnValue({pickupDate});
            shipmentService.getFormattedShipperAddress.and.returnValue(pickupAddress);
            sut.onInit();
            defaultsDefer.resolve(defaults);
            $timeout.flush();
            expect(sut.howStartShipping).toBe('dropoff');
        });

        it('should pre-select dropoff if there is scheduled pickup if there are no default values', () => {
            const pickupDate = jasmine.any(String);
            const pickupAddress = jasmine.any(Object);
            shipmentService.getShipmentProduct.and.returnValue({pickupDate});
            shipmentService.getFormattedShipperAddress.and.returnValue(pickupAddress);
            sut.onInit();
            defaultsDefer.reject();
            $timeout.flush();
            expect(sut.howStartShipping).toBe('dropoff');
        });

        it('should pre-select dropoff needed by user profile defaults', () => {
            const deferred = $q.defer();
            defaults.pickupDefaultType = 'NO_DROP_OFF';
            pickupService.getBookingReferenceNumber.and.returnValue(deferred.promise);
            sut.onInit();
            defaultsDefer.resolve(defaults);
            deferred.reject();
            $timeout.flush();
            expect(sut.howStartShipping).toBe('dropoff');
        });

        it('should pre-select dropoff needed by user profile defaults if scheduled pickup is selected', () => {
            defaults.pickupDefaultType = 'NO_SCHEDULED';
            sut.onInit();
            defaultsDefer.resolve(defaults);
            $timeout.flush();
            expect(sut.howStartShipping).toBe('dropoff');
        });

        it('should not update pickup/dropoff needed if default value for pickup type is NONE', () => {
            const deferred = $q.defer();
            pickupService.getBookingReferenceNumber.and.returnValue(deferred.promise);
            defaults.pickupDefaultType = 'NONE';
            sut.onInit();
            deferred.reject();
            defaultsDefer.resolve(defaults);
            $timeout.flush();
            expect(sut.howStartShipping).toBe(null);
        });

        it('should set default value to pickup location', () => {
            sut.onInit();
            defaultsDefer.resolve(defaults);
            defer.resolve(pickupLocations);
            $timeout.flush();
            expect(sut.pickupLocation).toEqual(pickupLocations[0]);
        });

        it('should set default value to pickup instructions', () => {
            const text = 'some text';
            defaults.pickupDetails.instructions = text;
            sut.onInit();
            defaultsDefer.resolve(defaults);
            $timeout.flush();
            expect(sut.pickupSpecialInstructions).toBe(text);
        });

        it('should set default value to pickup window', () => {
            const originalReadyByTime = 720;
            sut.pickupTime = {
                readyByTime: null,
                closeTime: null
            };
            const resultExpected = {
                minReadyByTime: originalReadyByTime,
                readyByTime: defaults.pickupDetails.pickupWindow.earliestTime,
                closeTime: defaults.pickupDetails.pickupWindow.latestTime
            };
            dateTimeService.getReadyByTime.and.returnValue(originalReadyByTime);
            sut.onInit();
            defaultsDefer.resolve(defaults);
            $timeout.flush();
            expect(sut.pickupTime).toEqual(jasmine.objectContaining(resultExpected));
        });

        it('should adjust pickup section after getting default values', () => {
            sut.onInit();
            defaultsDefer.resolve(defaults);
            $timeout.flush();
            expect(pickupService.getPickupLocations).toHaveBeenCalledWith(sut.shipmentCountry);
            expect(shipmentService.getShipmentProduct).toHaveBeenCalled();
        });

        it('should adjust pickup section after fail to get default values', () => {
            sut.onInit();
            defaultsDefer.reject();
            $timeout.flush();
            expect(pickupService.getPickupLocations).toHaveBeenCalledWith(sut.shipmentCountry);
            expect(shipmentService.getShipmentProduct).toHaveBeenCalled();
        });

        it('should get shipper address and set it as pickup address', () => {
            const address = {
                addressDetails: {},
                name: 'some_name'
            };
            shipmentService.getShipperAddress.and.returnValue(address);
            sut.onInit();
            defaultsDefer.reject();
            $timeout.flush();
            expect(sut.pickupAddress).toEqual(address);
            expect(sut.pickupAddressNew).toEqual(address);
        });

        it('pulls initial packagings and defines if packagings are required', () => {
            const packageList = [{id: 'asd'}, {id: 'sdf'}];
            shipmentService.getPickupData.and.returnValue({packageList});

            sut.onInit();

            expect(sut.packagings).toEqual(packageList);
            expect(sut.requirePackagings).toBeTruthy();
        });

        it('hides packagings if pulled packagings are empty', () => {
            shipmentService.getPickupData.and.returnValue({packageList: []});

            sut.onInit();

            expect(sut.requirePackagings).toBeFalsy();
        });
    });

    describe('#onEdit', () => {
        let pickupTimeExpected;

        beforeEach(() => {
            sut.howStartShipping = 'pickup';
            nlsService.getTranslationSync.and.returnValue('');
            dateTimeService.isToday.and.returnValue(true);
            dateTimeService.getFormattedTime.and.returnValue('5:00 pm');
            configService.getBoolean.and.returnValue($q.when(true));

            pickupTimeExpected = {
                latestBooking: '5:00 pm',
                earliestPickup: 720,
                latestPickup: 1440,
                readyByTime: 800,
                closeTime: 1440,
                leadTime: 90,
                pickupCutoffTime: 1260,
                minReadyByTime: 800
            };
        });

        it('should save shipment country to shipmentCountry', () => {
            const country = 'UK';
            shipmentService.getShipmentCountry.and.returnValue(country);
            sut.onEdit();
            expect(sut.shipmentCountry).toBe(country);
        });

        it('should get list of pickup locations', () => {
            sut.onEdit();
            defer.resolve(pickupLocations);
            $timeout.flush();
            expect(sut.pickupLocations).toBe(pickupLocations);
        });

        it('should set pickupLocation to value from new pickup location list if it is already selected', () => {
            sut.pickupLocation = {name: 'BACK DOOR'};
            sut.onEdit();
            defer.resolve(pickupLocations);
            $timeout.flush();
            expect(sut.pickupLocation).toBe(pickupLocations[1]);
        });

        it('should clear pickupLocation if new locations list does not contain previously selected value', () => {
            pickupLocations = [
                {name: 'FRONT DOOR'},
                {name: 'RECEPTION'}
            ];
            sut.pickupLocation = {name: 'BACK DOOR'};
            sut.onEdit();
            defer.resolve(pickupLocations);
            $timeout.flush();
            expect(sut.pickupLocation).toBeUndefined();
        });

        it('should clear other description if pickup location type is not Other', () => {
            pickupLocations = [
                {name: 'FRONT DOOR'},
                {name: 'RECEPTION'}
            ];
            sut.pickupLocation = {name: 'BACK DOOR'};
            sut.pickupLocationOtherDescription = 'description';
            sut.onEdit();
            defer.resolve(pickupLocations);
            $timeout.flush();
            expect(sut.pickupLocationOtherDescription).toBe(null);
        });

        it('should not clear other description if pickup location type is Other', () => {
            pickupLocations = [
                {name: 'FRONT DOOR'},
                {name: 'RECEPTION'}
            ];
            sut.pickupLocation = {name: 'OTHER'};
            const text = 'description';
            sut.pickupLocationOtherDescription = text;
            sut.onEdit();
            defer.resolve(pickupLocations);
            $timeout.flush();
            expect(sut.pickupLocationOtherDescription).toBe(text);
        });

        it('should set isBookByMessageShown to true if pickup date is the same as today date', () => {
            dateTimeService.isToday.and.returnValue(true);
            sut.onEdit();
            expect(sut.isBookByMessageShown).toBe(true);
        });

        it('should set pickup date', () => {
            const resultExpected = {
                originalDate: product.pickupDate,
                month: 'October',
                date: '8',
                day: 'Today',
                shortDate: '10/08/2015'
            };
            dateTimeService.getFormattedDate.and.returnValue('8');
            dateTimeService.getLocalizedMonth.and.returnValue('October');
            dateTimeService.getFormattedDay.and.returnValue('Today');
            dateTimeService.getShortDate.and.returnValue('10/08/2015');
            sut.onEdit();
            expect(sut.pickupDate).toEqual(resultExpected);
        });

        it('should set pickupTime', () => {
            dateTimeService.getReadyByTime.and.returnValue(800);
            sut.onEdit();
            expect(sut.pickupTime).toEqual(pickupTimeExpected);
        });

        it('should not set latestBooking if pickup date is not the same current date', () => {
            dateTimeService.isToday.and.returnValue(false);
            dateTimeService.getReadyByTime.and.returnValue(800);
            sut.onEdit();
            expect(sut.pickupTime.latestBooking).toEqual(null);
        });

        it('should set bookBy message', () => {
            const resultExpected = 'The latest time a pickup request can be made for today is <b>5:00 pm</b>';
            const message = 'The latest time a pickup request can be made for today is {book_by_time}';
            spyOn($sce, 'trustAsHtml');
            $sce.trustAsHtml.and.returnValue(resultExpected);
            nlsService.getTranslationSync.and.returnValue(message);
            dateTimeService.isToday.and.returnValue(true);
            sut.onEdit();
            expect(sut.bookByMessage).toBe(resultExpected);
        });

        it('should not set book by message if pickup date is not the same as today date', () => {
            sut.bookByMessage = '';
            dateTimeService.isToday.and.returnValue(false);
            sut.onEdit();
            expect(sut.bookByMessage).toBe('');
        });

        it('should update pickupTime except readyByTime and closeTime if they are valid for new pickup window', () => {
            pickupTimeExpected.earliestPickup = 760;
            pickupTimeExpected.latestPickup = 1400;
            pickupTimeExpected.readyByTime = 900;
            pickupTimeExpected.closeTime = 1350;
            pickupTimeExpected.minReadyByTime = 760;

            product.pickupStartTime = 45600000;
            product.pickupEndTime = 84000000;

            sut.pickupTime = {
                readyByTime: 900,
                closeTime: 1350
            };
            dateTimeService.getReadyByTime.and.returnValue(760);
            sut.onEdit();
            expect(sut.pickupTime).toEqual(pickupTimeExpected);
        });

        it('should update whole pickupTime if readyByTime or closeTime is outside of new pickup window', () => {
            pickupTimeExpected.earliestPickup = 950;
            pickupTimeExpected.latestPickup = 1400;
            pickupTimeExpected.readyByTime = 950;
            pickupTimeExpected.closeTime = 1400;
            pickupTimeExpected.minReadyByTime = 950;

            product.pickupStartTime = 57000000;
            product.pickupEndTime = 84000000;

            sut.pickupTime = {
                readyByTime: 900,
                closeTime: 1300
            };
            dateTimeService.getReadyByTime.and.returnValue(950);
            sut.onEdit();
            expect(sut.pickupTime).toEqual(pickupTimeExpected);
        });

        it('updates whole pickupTime if interval between readyByTime and closeTime is less than lead time', () => {
            pickupTimeExpected.earliestPickup = 950;
            pickupTimeExpected.latestPickup = 1400;
            pickupTimeExpected.readyByTime = 950;
            pickupTimeExpected.closeTime = 1400;
            pickupTimeExpected.leadTime = 400;
            pickupTimeExpected.minReadyByTime = 950;

            product.bookingCutoffOffset = 24000000;
            product.pickupStartTime = 57000000;
            product.pickupEndTime = 84000000;

            sut.pickupTime = {
                readyByTime: 900,
                closeTime: 1300
            };
            dateTimeService.getReadyByTime.and.returnValue(950);
            sut.onEdit();
            expect(sut.pickupTime).toEqual(pickupTimeExpected);
        });

        it('should disable pickup address edit mode', () => {
            sut.pickupAddressEditMode = true;
            sut.onEdit();
            expect(sut.pickupAddressEditMode).toBe(false);
        });

        it('should display pickup slider after its adjusting', () => {
            sut.isPickupSliderShown = false;
            const callback = jasmine.createSpy('callback');
            dateTimeService.getReadyByTime.and.returnValue(jasmine.any('Number'));
            sut.setPickupWindowDisplayCallback(callback);
            sut.onEdit();
            $timeout.flush();
            expect(sut.isPickupSliderShown).toBe(true);
        });

        it('should not display pickup slider if it was not adjusted', () => {
            sut.isPickupSliderShown = false;
            sut.onEdit();
            $timeout.flush();
            expect(sut.isPickupSliderShown).toBe(false);
        });

        it('updates packagings availability, setting it to non-visible meanwhile', () => {
            const packagingsAvailable = true;
            configService.getBoolean.and.returnValue($q.when(packagingsAvailable));
            const shipperCountry = 'GB';
            shipmentService.getShipmentCountry.and.returnValue(shipperCountry);

            sut.onEdit();
            expect(sut.packagingsAvailable).toBe(false);

            $timeout.flush();

            expect(configService.getBoolean).toHaveBeenCalledWith('Pickup. .request.dhl.packaging', shipperCountry);
            expect(sut.packagingsAvailable).toBe(packagingsAvailable);
        });

        it('should display TSA Notification if shipper country allows to display it', () => {
            const key = 'General Settings. .enable.tsa.privacy.act.notification';
            configService.getBoolean.and.returnValue($q.when(true));
            sut.isTSANotificationShown = false;
            sut.onEdit();
            $timeout.flush();
            expect(configService.getBoolean).toHaveBeenCalledWith(key, sut.shipmentCountry);
            expect(sut.isTSANotificationShown).toBe(true);
        });

        it('should hide TSA Notification if shipper country does not allow to display it', () => {
            configService.getBoolean.and.returnValue($q.when(false));
            sut.isTSANotificationShown = true;
            sut.onEdit();
            $timeout.flush();
            expect(sut.isTSANotificationShown).toBe(false);
        });

        it('should hide TSA Notification if there is no rule for TSA notification', () => {
            configService.getBoolean.and.returnValue($q.reject());
            sut.isTSANotificationShown = true;
            sut.onEdit();
            $timeout.flush();
            expect(sut.isTSANotificationShown).toBe(false);
        });

        it('should update reference number and display it if there is scheduled pickup', () => {
            const referenceNumber = 2;
            const pickupDate = '01-01-2015';
            shipmentService.getShipmentProduct.and.returnValue({pickupDate});
            shipmentService.getFormattedShipperAddress.and.returnValue({});
            pickupService.getBookingReferenceNumber.and.returnValue($q.when(referenceNumber));
            sut.onEdit();
            $timeout.flush();
            expect(sut.referenceNumber).toBe(referenceNumber);
            expect(sut.isPickupScheduled).toBe(true);
        });

        it('should clear reference number and hide it if there is no scheduled pickup', () => {
            const pickupDate = '01-01-2015';
            sut.referenceNumber = 2;
            shipmentService.getShipmentProduct.and.returnValue({pickupDate});
            shipmentService.getFormattedShipperAddress.and.returnValue({});
            pickupService.getBookingReferenceNumber.and.returnValue($q.reject());
            sut.onEdit();
            $timeout.flush();
            expect(sut.referenceNumber).toBe(null);
            expect(sut.isPickupScheduled).toBe(false);
        });

        it('should update pickup address if the shipper address has changed', () => {
            const oldAddress = {
                addressDetails: {
                    addrLine1: 'old address'
                }
            };
            const newAddress = {
                addressDetails: {
                    addrLine1: 'new address'
                }
            };
            sut.pickupAddress = {};
            shipmentService.getShipperAddress.and.returnValue(oldAddress);
            shipmentService.getPickupData.and.returnValue({});
            sut.onInit();
            defaultsDefer.reject();
            $timeout.flush();
            shipmentService.getShipperAddress.and.returnValue(newAddress);
            sut.onEdit();
            $timeout.flush();
            expect(sut.pickupAddress).toEqual(newAddress);
        });

        it('should not update pickup address if the shipper address does not changed', () => {
            const shipperAddress = {
                addressDetails: {
                    addrLine1: 'old address'
                }
            };
            const newAddress = {
                addressDetails: {
                    addrLine1: 'new address'
                }
            };
            shipmentService.getShipperAddress.and.returnValue(shipperAddress);
            shipmentService.getPickupData.and.returnValue({});
            sut.onInit();
            defaultsDefer.reject();
            $timeout.flush();

            sut.pickupAddress = angular.copy(newAddress);
            sut.onEdit();
            $timeout.flush();
            expect(sut.pickupAddress).toEqual(newAddress);
        });
    });

    describe('#resolvePickupLocationName', () => {
        it('should return localization for each pickup location', () => {
            const pickupLocation = {
                name: 'FRONT DOOR'
            };
            const key = 'shipment.pickup_front_door';
            const nameExpected = 'Front Door';
            nlsService.getTranslationSync.and.returnValue(nameExpected);
            const result = sut.resolvePickupLocationName(pickupLocation);
            expect(nlsService.getTranslationSync).toHaveBeenCalledWith(key);
            expect(result).toBe(nameExpected);
        });
    });

    describe('#onNextClick', () => {
        let ewfFormCtrl, form, data;
        const name = 'Terry Smith';
        const company = 'Acme Company';
        const pickupAddress = {
            countryCode: 'US',
            addressLine1: '620 Park Avenue',
            postCode: '10011',
            cityName: 'New York',
            stateOrProvince: 'New York'
        };

        beforeEach(() => {
            const pickupDate = '01-01-2014';
            data = {
                pickupDetails: {
                    pickupLocation: {name, company, pickupAddress},
                    pickupLocationType: 'FRONT DOOR',
                    pickupLocationOtherDescription: '',
                    instructions: null,
                    pickupDate,
                    pickupWindow: {
                        earliestTime: 720 * 60000,
                        latestTime: 1200 * 60000
                    }
                },
                totalWeight: {
                    unit: 'KG',
                    value: 3.1
                },
                packageList: null,
                needCourier: false
            };

            ewfFormCtrl = jasmine.createSpyObj('ewfFormCtrl', ['ewfValidation']);
            ewfFormCtrl.ewfValidation.and.returnValue(true);
            sut.howStartShipping = 'pickup';
            form = {$invalid: false};
            sut.pickupLocation = {name: 'FRONT DOOR'};
            sut.totalPickupWeight = {
                unit: 'shipment.package_details_kg',
                value: '3.1'
            };
            sut.pickupTime = {
                readyByTime: 720,
                closeTime: 1200
            };
            sut.pickupDate = {
                originalDate: pickupDate
            };

            const $valid = true;
            const $invalid = false;
            const validate = jasmine.createSpy('validate');
            validate.and.returnValue(true);
            sut.pickupPackagingsForm = {
                $valid,
                $invalid,
                validate
            };
            sut.pickupAddress = {
                addressDetails: {
                    addrLine1: pickupAddress.addressLine1,
                    city: pickupAddress.cityName,
                    countryCode: pickupAddress.countryCode,
                    countryName: 'USA',
                    stateOrProvince: pickupAddress.stateOrProvince,
                    zipOrPostCode: pickupAddress.postCode
                },
                company,
                name
            };
        });

        it('should call next click callback', () => {
            let nextCallback = jasmine.createSpy('nextCallback');
            sut.setNextCallback(nextCallback);
            sut.onNextClick(form, ewfFormCtrl);
            expect(nextCallback).toHaveBeenCalled();
        });

        it('should set pickup data to shipment service if form is valid and pickup is needed', () => {
            const instructions = 'instructions';
            sut.pickupSpecialInstructions = instructions;
            data.pickupDetails.instructions = instructions;
            sut.onNextClick(form, ewfFormCtrl);
            expect(shipmentService.setPickupData).toHaveBeenCalledWith(data);
        });

        it('should set pickupLocationOtherDescription to shipment service if pickup location type is Other', () => {
            const instructions = 'instructions';
            sut.pickupLocation = {name: 'OTHER'};
            sut.pickupLocationOtherDescription = 'description';
            data.pickupDetails.pickupLocationType = 'OTHER';
            data.pickupDetails.pickupLocationOtherDescription = 'description';
            data.pickupDetails.instructions = instructions;
            sut.pickupSpecialInstructions = instructions;
            sut.onNextClick(form, ewfFormCtrl);
            expect(shipmentService.setPickupData).toHaveBeenCalledWith(data);
        });

        it('should not call next click callback and not set pickup data to shipment service if form is invalid', () => {
            let nextCallback = jasmine.createSpy('nextCallback');
            form = {$invalid: true};
            sut.onNextClick(form, ewfFormCtrl);
            expect(nextCallback).not.toHaveBeenCalled();
            expect(shipmentService.setPickupData).not.toHaveBeenCalled();
        });

        it('should not call next click callback if pickup is not needed', () => {
            let nextCallback = jasmine.createSpy('nextCallback');
            sut.howStartShipping = 'dropoff';
            sut.onNextClick(form, ewfFormCtrl);
            expect(nextCallback).not.toHaveBeenCalled();
        });

        it('stores packagings information to shipment dto if only packagings are required', () => {
            const packagings = [{id: 'some_box', qty: 3}];
            sut.packagings = packagings;
            let requirePackagings = true;
            sut.requirePackagings = requirePackagings;
            data.needCourier = requirePackagings;
            data.packageList = packagings;

            sut.onNextClick(form, ewfFormCtrl);
            expect(shipmentService.setPickupData).toHaveBeenCalledWith(data);

            requirePackagings = false;
            sut.requirePackagings = requirePackagings;
            data.needCourier = requirePackagings;
            data.packageList = null;

            sut.onNextClick(form, ewfFormCtrl);
            expect(shipmentService.setPickupData).toHaveBeenCalledWith(data);
        });

        it('rejects step completion if packagings are required and packagings form is invalid', () => {
            sut.requirePackagings = true;
            sut.pickupPackagingsForm.$valid = false;
            sut.pickupPackagingsForm.$invalid = true;
            sut.pickupPackagingsForm.validate.and.returnValue(false);

            sut.onNextClick(form, ewfFormCtrl);

            expect(shipmentService.setPickupData).not.toHaveBeenCalled();
        });

        it('allows step completion if packagings are required and packagings form is valid', () => {
            sut.requirePackagings = true;

            sut.onNextClick(form, ewfFormCtrl);

            expect(shipmentService.setPickupData).toHaveBeenCalled();
        });

        it('does not care about packagings form if packagings are not required', () => {
            sut.requirePackagings = false;
            sut.pickupPackagingsForm.$valid = false;
            sut.pickupPackagingsForm.$invalid = true;
            sut.pickupPackagingsForm.validate.and.returnValue(false);

            sut.onNextClick(form, ewfFormCtrl);

            expect(shipmentService.setPickupData).toHaveBeenCalled();
        });
    });

    describe('#getCurrentIncompleteData', () => {
        it('should set incomplete pickup data', () => {
            const expectedShipmentData = {
                pickupDetails: {
                    pickupLocation: {
                        name: null,
                        company: null,
                        pickupAddress: {
                            countryCode: null,
                            addressLine1: null,
                            postCode: null,
                            cityName: null,
                            stateOrProvince: null
                        }
                    },
                    instructions: null,
                    pickupLocationOtherDescription: '',
                    pickupLocationType: '',
                    pickupDate: null,
                    pickupWindow: {
                        earliestTime: 0,
                        latestTime: 0
                    }
                },
                totalWeight: {
                    unit: '',
                    value: 0
                },
                packageList: null,
                needCourier: false
            };

            sut.howStartShipping = 'pickup';
            sut.getCurrentIncompleteData();

            expect(shipmentService.setPickupData).toHaveBeenCalledWith(expectedShipmentData);
        });
    });

    describe('#isPickupRequired', () => {
        it('should return true if howStartShipping is pickup', () => {
            sut.howStartShipping = 'pickup';
            expect(sut.isPickupRequired()).toBe(true);
        });

        it('should return false if howStartShipping is not pickup', () => {
            sut.howStartShipping = 'dropoff';
            expect(sut.isPickupRequired()).toBe(false);
        });
    });

    describe('#isDropoffRequred', () => {
        it('should return true if howStartShipping is pickup', () => {
            sut.howStartShipping = 'dropoff';
            expect(sut.isDropoffRequred()).toBe(true);
        });

        it('should return false if howStartShipping is not pickup', () => {
            sut.howStartShipping = 'pickup';
            expect(sut.isDropoffRequred()).toBe(false);
        });
    });

    describe('#isOtherPickupLocation', () => {
        it('should return true if other pickup location is selected', () => {
            sut.pickupLocation = {name: 'OTHER'};
            expect(sut.isOtherPickupLocation()).toBe(true);
        });

        it('should return false if other pickup location is not selected', () => {
            sut.pickupLocation = {name: 'FRONT DOOR'};
            expect(sut.isOtherPickupLocation()).toBe(false);
        });
    });

    describe('#setPickupWindowDisplayCallback', () => {
        const readyByTime = 800;
        const leadTime = 90;

        const options = {
            min: 720,
            max: 1440,
            from: readyByTime,
            to: 1440,

            /*eslint-disable quote-props*/
            'from_max': 1260,
            'to_min': 1260 + leadTime,
            'min_interval': leadTime

            /*eslint-enable quote-props*/
        };

        it('should set argument to callback function which is called with pickupTime options in onEdit', () => {
            const callback = jasmine.createSpy('callback');
            configService.getBoolean.and.returnValue($q.when(true));
            dateTimeService.getReadyByTime.and.returnValue(readyByTime);
            configService.getBoolean.and.returnValue($q.when(true));
            sut.setPickupWindowDisplayCallback(callback);

            sut.onEdit();
            $timeout.flush();

            expect(callback).toHaveBeenCalledWith(jasmine.objectContaining(options));
        });
    });

    describe('#getFormattedTime', () => {
        it('should format time from minutes format to hours and minutes', () => {
            const time = 720;
            const timeExpected = '12:00 pm';
            dateTimeService.getFormattedTime.and.returnValue(timeExpected);
            expect(sut.getFormattedTime(time)).toBe(timeExpected);
        });
    });

    describe('#changePickupDate', () => {
       it('should navigate to shipment products', () => {
            const hash = 'shipment-products';
            spyOn($location, 'hash');
            sut.changePickupDate();
            expect($location.hash).toHaveBeenCalledWith(hash);
       });
    });

    describe('#onPickupTypeSelection', () => {
       it('should set pickup slider options if pickup is required', () => {
           sut.howStartShipping = 'pickup';
           const callback = jasmine.createSpy('callback');
           sut.setPickupWindowDisplayCallback(callback);
           sut.onPickupTypeSelection();
           $timeout.flush();
           expect(callback).toHaveBeenCalled();
       });
    });

    describe('#loadShipmentData', () => {
        const shipmentData = {
            pickup: {
                pickupDetails: {
                    pickupLocationType: 'Location Type',
                    pickupLocationOtherDescription: 'Location Description',
                    instructions: 'Instructions',
                    pickupWindow: {
                        earliestTime: 43200000,
                        latestTime: 72000000
                    }
                },
                totalWeight: {
                    unit: 'KG',
                    value: 3
                }
            }
        };
        const pickupData = {
            pickupLocation: {
                name: 'Location Type'
            },
            pickupLocationOtherDescription: 'Location Description',
            pickupSpecialInstructions: 'Instructions',
            pickupTime: {
                readyTime: 720,
                closeTime: 1200
            },
            totalPickupWeight: {
                unit: 'KG',
                value: 3
            }
        };

        beforeEach(() => {
            shipmentService.getPickupModelData.and.returnValue(pickupData);
            sut.loadShipmentData(shipmentData);
        });

        it('should populate controller with shipment data', () => {
            expect(shipmentService.getPickupModelData).toHaveBeenCalledWith(shipmentData);
            expect(sut).toEqual(jasmine.objectContaining(pickupData));
        });
    });

    describe('#isNextButtonVisible', () => {
        it('should return true if pickup is selected', () => {
            sut.howStartShipping = 'pickup';
            expect(sut.isNextButtonVisible()).toBe(true);
        });

        it('should return true if dropoff is selected', () => {
            sut.howStartShipping = 'dropoff';
            expect(sut.isNextButtonVisible()).toBe(true);
        });

        it('should return false if pickup or dropoff is not selected', () => {
            sut.howStartShipping = null;
            expect(sut.isNextButtonVisible()).toBe(false);
        });
    });

    describe('#openTSANotification', () => {
        it('should open TSA Privacy Notification modal dialog', () => {
            sut.openTSANotification();
            expect(modalService.showDialog).toHaveBeenCalled();
        });
    });

    describe('#closeScheduledPickupNotification', () => {
        it('should close scheduled pickup notification', () => {
            sut.closeScheduledPickupNotification();
            expect(sut.isPickupScheduled).toBe(false);
        });
    });

    describe('#editPickupAddress', () => {
        it('should enable disabled pickup address edit mode ', () => {
            sut.pickupAddressEditMode = false;
            sut.editPickupAddress();
            expect(sut.pickupAddressEditMode).toBe(true);
        });
    });

    describe('#updatePickupAddress', () => {
        beforeEach(() => {
            sut.pickupAddressEditMode = true;

            const pickupAddressForm = jasmine.createSpyObj('form', ['validate']);
            pickupAddressForm.$valid = true;
            pickupAddressForm.validate.and.returnValue(true);
            sut.pickupAddressForm = pickupAddressForm;
        });

        it('should disable enabled pickup address edit mode ', () => {
            sut.updatePickupAddress();
            expect(sut.pickupAddressEditMode).toBe(false);
        });

        it('won\'t update pickup addres if its form is invalid', () => {
            sut.pickupAddressForm.$valid = false;
            sut.updatePickupAddress();
            expect(sut.pickupAddressEditMode).toBe(true);
        });

        it('should update pickup address with new data', () => {
            sut.pickupAddressNew = {
                addressDetails: {},
                name: 'some_name',
                company: 'some_company'
            };

            sut.updatePickupAddress();
            expect(sut.pickupAddress).toEqual(sut.pickupAddressNew);
        });
    });
});
