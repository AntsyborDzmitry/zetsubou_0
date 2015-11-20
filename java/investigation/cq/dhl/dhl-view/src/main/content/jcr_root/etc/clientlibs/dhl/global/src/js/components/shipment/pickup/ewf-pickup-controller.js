import ewf from 'ewf';
import './pickup-service';
import './../../../services/date-time-service';
import './../shipment-products/shipment-products-service';
import './../../../services/modal/modal-service';
import './../../../services/config-service';
import EwfShipmentStepBaseController from './../ewf-shipment-step-base-controller';

EwfPickupController.$inject = [
    '$scope',
    '$timeout',
    '$sce',
    '$location',
    'nlsService',
    'pickupService',
    'shipmentService',
    'shipmentProductsService',
    'dateTimeService',
    'modalService',
    'configService'
];

EwfPickupController.prototype = new EwfShipmentStepBaseController('schedule-pickup');

ewf.controller('EwfPickupController', EwfPickupController);
export default function EwfPickupController($scope,
                                            $timeout,
                                            $sce,
                                            $location,
                                            nlsService,
                                            pickupService,
                                            shipmentService,
                                            shipmentProductsService,
                                            dateTimeService,
                                            modalService,
                                            configService) {
    const vm = this;

    const SHIPPING_START_TYPE = {
        PICKUP: 'pickup',
        DROPOFF: 'dropoff'
    };

    const PICKUP_TYPES = {
        PICKUP: 'YES_COURIER',
        PICKUP_SCHEDULED: 'NO_SCHEDULED',
        DROPOFF: 'NO_DROP_OFF'
    };

    const UOM_KEYS = [
        {
            nlsKey: 'shipment.package_details_kg',
            value: 'KG'
        },
        {
            nlsKey: 'shipment.package_details_lb',
            value: 'LB'
        }
    ];

    const PICKUP_LOCATION_OTHER = {name: 'OTHER'};

    const defaultValues = {
        pickupLocationType: null,
        pickupWindow: {
            earliestTime: null,
            latestTime: null
        }
    };

    let displayPickupWindowCallback = null;
    let pendingUserProfileDefaults = false;
    let shipperAddress = null;

    Object.assign(vm, {
        onInit,
        onEdit,
        onNextClick,
        resolvePickupLocationName,
        getCurrentIncompleteData,
        isPickupRequired,
        isDropoffRequred,
        isOtherPickupLocation,
        setPickupWindowDisplayCallback,
        getFormattedTime,
        changePickupDate,
        loadShipmentData,
        onPickupTypeSelection,
        isNextButtonVisible,
        openTSANotification,
        closeScheduledPickupNotification,
        editPickupAddress,
        updatePickupAddress,

        pickupDate: {
            originalDate: null
        },
        pickupTime: {
            readyByTime: null,
            closeTime: null
        },
        pickupAddress: {
            addressDetails: {
                addrLine1: null,
                city: null,
                countryCode: null,
                countryName: null,
                stateOrProvince: null,
                zipOrPostCode: null
            },
            name: null,
            company: null
        },
        pickupAddressNew: {},
        referenceNumber: null,
        isBookByMessageShown: false,
        bookByMessage: '',
        pickupWindowSettings: {},
        howStartShipping: null,
        pickupLocations: [],
        pickupLocation: null,
        pickupLocationOtherDescription: '',
        pickupSpecialInstructions: null,
        totalPickupWeight: {
            value: null,
            unit: null
        },
        SHIPPING_START_TYPE,
        isPickupScheduled: false,
        pickupAddressEditMode: false,
        packagings: [],
        requirePackagings: false,
        packagingsAvailable: false,
        pickupPackagingsForm: null,
        isPickupSliderShown: false,
        isTSANotificationShown: false
    });

    function onInit() {
        pendingUserProfileDefaults = true;
        saveShipperAddress();
        initShipperCountry();
        vm.totalPickupWeight = shipmentService.getTotalWeight();
        setDefaultValues();
        setInitialPackagings();
    }

    function saveShipperAddress() {
        shipperAddress = shipmentService.getShipperAddress();
    }

    function onEdit() {
        vm.isPickupSliderShown = false;
        initShipperCountry();
        updateTSAAvailability();
        if (!pendingUserProfileDefaults) {
            getBookingReferenceNumber();
            processShipperAddress();
            adjustPickupSection();
        }
        vm.pickupAddressEditMode = false;
        updatePackagingsAvailability();
    }

    function initShipperCountry() {
        vm.shipmentCountry = shipmentService.getShipmentCountry();
    }

    function updatePackagingsAvailability() {
        vm.packagingsAvailable = false;
        const packagingCIKey = 'Pickup. .request.dhl.packaging';

        configService
            .getBoolean(packagingCIKey, shipmentService.getShipmentCountry())
            .then(setPackagingsAvailability);
    }

    function setPackagingsAvailability(packagingsAvailable) {
        vm.packagingsAvailable = packagingsAvailable;
    }

    function setDefaultValues() {
        getBookingReferenceNumber().then(getUserProfileDefaultValues);
    }

    function getBookingReferenceNumber() {
        const pickupDate = shipmentService.getShipmentProduct().pickupDate;
        const pickupAddress = shipmentService.getFormattedShipperAddress();
        return pickupService.getBookingReferenceNumber(pickupDate, pickupAddress)
            .then((number) => {
                vm.referenceNumber = number;
                vm.howStartShipping = SHIPPING_START_TYPE.DROPOFF;
            })
            .catch(() => {
                vm.referenceNumber = null;
            })
            .finally(() => {
                vm.isPickupScheduled = !!vm.referenceNumber;
            });
    }

    function setInitialPackagings() {
        const packagings = shipmentService.getPickupData().packageList;
        const packagingsExist = packagings && Array.isArray(packagings);

        vm.requirePackagings = packagingsExist && packagings.length;
        vm.packagings = packagingsExist ? packagings : [];
    }

    function updateTSAAvailability() {
        const key = 'General Settings. .enable.tsa.privacy.act.notification';
        vm.isTSANotificationShown = false;
        configService.getBoolean(key, vm.shipmentCountry)
            .then((isTSANotificationShown) => {
                vm.isTSANotificationShown = isTSANotificationShown;
            });
    }

    function processShipperAddress() {
        const newShipperAddress = shipmentService.getShipperAddress();
        if (!angular.equals(shipperAddress, newShipperAddress)) {
            shipperAddress = newShipperAddress;
            setPickupAddress();
        }
    }

    function adjustPickupSection() {
        vm.pickupAddressNew = angular.copy(vm.pickupAddress);
        vm.pickupLocations = [];
        processPickupLocations();
        updatePickupWindow();
    }

    function getUserProfileDefaultValues() {
        pickupService.getUserProfileDefaultValues()
            .then((data) => {
                setPickupType(data.pickupDefaultType);
                setPickupLocationDefaultValue(data.pickupDetails);
                setPickupInstructionsDefaultValue(data.pickupDetails);
                setPickupWindowDefaultValues(data.pickupDetails);
            })
            .finally(() => {
                pendingUserProfileDefaults = false;
                setPickupAddress();
                adjustPickupSection();
            });
    }

    function setPickupType(type) {
        vm.howStartShipping = null;

        if (isDropoffAvailable(type)) {
            vm.howStartShipping = SHIPPING_START_TYPE.DROPOFF;
        } else if (isPickupAvailable(type)) {
            vm.howStartShipping = SHIPPING_START_TYPE.PICKUP;
        }
    }

    function isDropoffAvailable(pickupType) {
        return vm.isPickupScheduled ||
            pickupType === PICKUP_TYPES.DROPOFF || pickupType === PICKUP_TYPES.PICKUP_SCHEDULED;
    }

    function isPickupAvailable(pickupType) {
        return pickupType === PICKUP_TYPES.PICKUP;
    }

    function setPickupLocationDefaultValue(data) {
        const pickupLocation = data.pickupLocationType.replace('_', ' ').toUpperCase();
        defaultValues.pickupLocationType = pickupLocation;
    }

    function setPickupInstructionsDefaultValue(data) {
        if (!vm.pickupSpecialInstructions) {
            vm.pickupSpecialInstructions = data.instructions;
        }
    }

    function setPickupWindowDefaultValues(data) {
        defaultValues.pickupWindow = data.pickupWindow;
    }

    function processPickupLocations() {
        pickupService.getPickupLocations(vm.shipmentCountry)
            .then(setPickupLocationsList)
            .then(setPickupLocation);
    }

    function setPickupLocationsList(data) {
        vm.pickupLocations = data;
        vm.pickupLocations.push(PICKUP_LOCATION_OTHER);
    }

    function setPickupLocation() {
        if (vm.pickupLocation) {
            vm.pickupLocation = vm.pickupLocations.find(isPickupLocation);
        }
        vm.pickupLocation = vm.pickupLocation || vm.pickupLocations.find(isDefaultLocation);
        if (!vm.isOtherPickupLocation()) {
            vm.pickupLocationOtherDescription = null;
        }
    }

    function isDefaultLocation(location) {
        return defaultValues.pickupLocationType === location.name;
    }

    function isPickupLocation(location) {
        return vm.pickupLocation.name === location.name;
    }

    function setPickupAddress() {
        vm.pickupAddress = angular.copy(shipperAddress);
    }

    function resolvePickupLocationName(pickupLocation) {
        const key = pickupLocation.name.toLowerCase().replace(/\s/g, '_');
        return nlsService.getTranslationSync(`shipment.pickup_${key}`);
    }

    function updatePickupWindow() {
        const product = shipmentService.getShipmentProduct();
        vm.timezoneOffset = shipmentProductsService.getShipmentTimezoneOffset();
        vm.isBookByMessageShown = dateTimeService.isToday(product.pickupDate, vm.timezoneOffset);
        // TODO: add real method to get 24 hour format from Support Utility
        vm.amPmMarker = true;
        setPickupDate(product);
        setPickupTimeOptions(product);
        displayPickupSlider();

        if (vm.isBookByMessageShown) {
            setBookByMessage();
        }
    }

    function setPickupDate(product) {
        const date = product.pickupDate;
        vm.pickupDate = {
            originalDate: date,
            month: dateTimeService.getLocalizedMonth(date),
            date: dateTimeService.getFormattedDate(date),
            day: dateTimeService.getFormattedDay(date, vm.timezoneOffset),
            shortDate: dateTimeService.getShortDate(date)
        };
    }

    function setPickupTimeOptions(product) {
        const {readyByTime, closeTime} = vm.pickupTime;
        setPickupTime(product);
        if (isValidSelectedPickupTime(readyByTime, closeTime)) {
            vm.pickupTime.readyByTime = readyByTime;
            vm.pickupTime.closeTime = closeTime;
        }
    }

    function setPickupTime(product) {
        const pickupTimeDefaults = defaultValues.pickupWindow;
        vm.pickupTime = {
            latestBooking: vm.isBookByMessageShown ? getLatestBooking(product) : null,
            earliestPickup: dateTimeService.msToMin(product.pickupStartTime),
            latestPickup: dateTimeService.msToMin(product.pickupEndTime),
            readyByTime: getReadyByTime(product),
            closeTime: dateTimeService.msToMin(product.pickupEndTime),
            leadTime: dateTimeService.msToMin(product.bookingCutoffOffset),
            pickupCutoffTime: dateTimeService.msToMin(product.pickupCutoffTime)
        };
        vm.pickupTime.minReadyByTime = vm.pickupTime.readyByTime;

        if (isValidSelectedPickupTime(pickupTimeDefaults.earliestTime, pickupTimeDefaults.latestTime)) {
            vm.pickupTime.readyByTime = pickupTimeDefaults.earliestTime;
            vm.pickupTime.closeTime = pickupTimeDefaults.latestTime;
        }
    }

    function getReadyByTime(product) {
        return dateTimeService.getReadyByTime(product.pickupStartTime, vm.timezoneOffset, product.pickupDate);
    }

    function getLatestBooking(product) {
        const latestBookingTime = pickupService.getLatestBooking(product);
        return dateTimeService.getFormattedTime(latestBookingTime, vm.amPmMarker);
    }

    function isValidSelectedPickupTime(readyByTime, closeTime) {
        return readyByTime && closeTime &&
            readyByTime >= vm.pickupTime.earliestPickup && readyByTime <= vm.pickupTime.pickupCutoffTime &&
            readyByTime >= vm.pickupTime.minReadyByTime && (closeTime - readyByTime) >= vm.pickupTime.leadTime &&
            closeTime <= vm.pickupTime.latestPickup &&
            closeTime >= (vm.pickupTime.pickupCutoffTime + vm.pickupTime.leadTime);
    }

    function displayPickupSlider() {
        let rangeSliderOptions = {
            min: vm.pickupTime.earliestPickup,
            max: vm.pickupTime.latestPickup,
            from: vm.pickupTime.readyByTime,
            to: vm.pickupTime.closeTime,
            type: 'double',
            step: 15,
            grid: true,

            /*eslint-disable quote-props*/
            'from_min': vm.pickupTime.minReadyByTime,
            'from_max': vm.pickupTime.pickupCutoffTime,
            'to_min': vm.pickupTime.pickupCutoffTime + vm.pickupTime.leadTime,
            'drag_interval': true,
            'min_interval': vm.pickupTime.leadTime,
            'hide_min_max': true,
            'grid_num': 4

            /*eslint-enable quote-props*/
        };

        rangeSliderOptions.onFinish = function(val) {
            vm.pickupTime.readyByTime = val.from;
            vm.pickupTime.closeTime = val.to;
        };

        rangeSliderOptions.prettify = vm.getFormattedTime;

        $timeout(() => {
            if (displayPickupWindowCallback) {
                displayPickupWindowCallback(rangeSliderOptions);
                vm.isPickupSliderShown = true;
            }
        });
    }

    function onNextClick(form, ewfFormCtrl) {
        if ((form.$invalid && ewfFormCtrl.ewfValidation())) {
            return;
        }

        if (vm.requirePackagings) {
            const packagingsForm = vm.pickupPackagingsForm;

            if (!packagingsForm.validate() || packagingsForm.$invalid) {
                return;
            }
        }

        vm.nextCallback();

        if (vm.isPickupRequired()) {
            setPickupDataToShipmentService();
        }
    }

    function getCurrentIncompleteData() {
        vm.pickupLocation = vm.pickupLocation || {name: ''};
        vm.totalPickupWeight.unit = '';
        setPickupDataToShipmentService();
    }

    function setPickupDataToShipmentService() {
        const uomKey = UOM_KEYS.find((uom) => (uom.nlsKey === vm.totalPickupWeight.unit));
        const addressDetails = vm.pickupAddress.addressDetails;
        const data = {
            pickupDetails: {
                pickupLocation: {
                    name: vm.pickupAddress.name,
                    company: vm.pickupAddress.company,
                    pickupAddress: {
                        countryCode: addressDetails.countryCode,
                        addressLine1: addressDetails.addrLine1,
                        postCode: addressDetails.zipOrPostCode,
                        cityName: addressDetails.city,
                        stateOrProvince: addressDetails.stateOrProvince
                    }
                },
                pickupLocationType: vm.pickupLocation.name,
                pickupLocationOtherDescription: vm.isOtherPickupLocation() ? vm.pickupLocationOtherDescription : '',
                instructions: vm.pickupSpecialInstructions,
                pickupDate: vm.pickupDate.originalDate,
                pickupWindow: {
                    earliestTime: dateTimeService.minToMs(vm.pickupTime.readyByTime),
                    latestTime: dateTimeService.minToMs(vm.pickupTime.closeTime)
                }
            },
            totalWeight: {
                unit: uomKey ? uomKey.value : '',
                value: Number(vm.totalPickupWeight.value)
            },
            packageList: vm.requirePackagings ? vm.packagings : null,
            needCourier: vm.requirePackagings
        };

        shipmentService.setPickupData(data);
    }

    function isPickupRequired() {
        return vm.howStartShipping === SHIPPING_START_TYPE.PICKUP;
    }

    function isDropoffRequred() {
        return vm.howStartShipping === SHIPPING_START_TYPE.DROPOFF;
    }

    function isOtherPickupLocation() {
        return vm.pickupLocation && vm.pickupLocation.name === PICKUP_LOCATION_OTHER.name;
    }

    function setBookByMessage() {
        let bookByMessage = '';
        if (vm.pickupTime.latestBooking) {
            const bookByTime = vm.pickupTime.latestBooking;
            const message = nlsService.getTranslationSync('shipment.pickup_latest_time_for_today');
            bookByMessage = message.replace('{book_by_time}', `<b>${bookByTime}</b>`);
        }

        vm.bookByMessage = $sce.trustAsHtml(bookByMessage);
    }

    function setPickupWindowDisplayCallback(callback) {
        displayPickupWindowCallback = callback;
    }

    function getFormattedTime(value) {
        const milliseconds = dateTimeService.minToMs(value);
        return dateTimeService.getFormattedTime(milliseconds, vm.amPmMarker, vm.timezoneOffset);
    }

    function changePickupDate() {
        $location.hash('shipment-products');
    }

    function loadShipmentData(data) {
        Object.assign(vm, shipmentService.getPickupModelData(data));
    }

    function onPickupTypeSelection() {
        if (isPickupRequired()) {
            displayPickupSlider();
        }
    }

    function isNextButtonVisible() {
        return vm.isPickupRequired() || vm.isDropoffRequred();
    }

    function openTSANotification() {
        modalService.showDialog({
            scope: $scope,
            closeOnEsc: true,
            windowClass: 'ngdialog-theme-default ewf-modal_width_large',
            templateUrl: 'pickup-tsa-privacy-notification-popup.html'
        });
    }

    function closeScheduledPickupNotification() {
        vm.isPickupScheduled = false;
    }

    function editPickupAddress() {
        vm.pickupAddressEditMode = true;
    }

    function updatePickupAddress() {
        if (validatePickupAddressForm()) {
            vm.pickupAddressEditMode = false;
            vm.pickupAddress = angular.copy(vm.pickupAddressNew);
        }
    }

    function validatePickupAddressForm() {
        const addressForm = vm.pickupAddressForm;

        return addressForm.validate() && addressForm.$valid;
    }
}
