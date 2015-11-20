define(['exports', 'module', 'ewf', './pickup-service', './../../../services/date-time-service', './../shipment-products/shipment-products-service', './../../../services/modal/modal-service', './../../../services/config-service', './../ewf-shipment-step-base-controller'], function (exports, module, _ewf, _pickupService, _servicesDateTimeService, _shipmentProductsShipmentProductsService, _servicesModalModalService, _servicesConfigService, _ewfShipmentStepBaseController) {
    'use strict';

    module.exports = EwfPickupController;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _EwfShipmentStepBaseController = _interopRequireDefault(_ewfShipmentStepBaseController);

    EwfPickupController.$inject = ['$scope', '$timeout', '$sce', '$location', 'nlsService', 'pickupService', 'shipmentService', 'shipmentProductsService', 'dateTimeService', 'modalService', 'configService'];

    EwfPickupController.prototype = new _EwfShipmentStepBaseController['default']('schedule-pickup');

    _ewf2['default'].controller('EwfPickupController', EwfPickupController);

    function EwfPickupController($scope, $timeout, $sce, $location, nlsService, pickupService, shipmentService, shipmentProductsService, dateTimeService, modalService, configService) {
        var vm = this;

        var SHIPPING_START_TYPE = {
            PICKUP: 'pickup',
            DROPOFF: 'dropoff'
        };

        var PICKUP_TYPES = {
            PICKUP: 'YES_COURIER',
            PICKUP_SCHEDULED: 'NO_SCHEDULED',
            DROPOFF: 'NO_DROP_OFF'
        };

        var UOM_KEYS = [{
            nlsKey: 'shipment.package_details_kg',
            value: 'KG'
        }, {
            nlsKey: 'shipment.package_details_lb',
            value: 'LB'
        }];

        var PICKUP_LOCATION_OTHER = { name: 'OTHER' };

        var defaultValues = {
            pickupLocationType: null,
            pickupWindow: {
                earliestTime: null,
                latestTime: null
            }
        };

        var displayPickupWindowCallback = null;
        var pendingUserProfileDefaults = false;
        var shipperAddress = null;

        Object.assign(vm, {
            onInit: onInit,
            onEdit: onEdit,
            onNextClick: onNextClick,
            resolvePickupLocationName: resolvePickupLocationName,
            getCurrentIncompleteData: getCurrentIncompleteData,
            isPickupRequired: isPickupRequired,
            isDropoffRequred: isDropoffRequred,
            isOtherPickupLocation: isOtherPickupLocation,
            setPickupWindowDisplayCallback: setPickupWindowDisplayCallback,
            getFormattedTime: getFormattedTime,
            changePickupDate: changePickupDate,
            loadShipmentData: loadShipmentData,
            onPickupTypeSelection: onPickupTypeSelection,
            isNextButtonVisible: isNextButtonVisible,
            openTSANotification: openTSANotification,
            closeScheduledPickupNotification: closeScheduledPickupNotification,
            editPickupAddress: editPickupAddress,
            updatePickupAddress: updatePickupAddress,

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
            SHIPPING_START_TYPE: SHIPPING_START_TYPE,
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
            var packagingCIKey = 'Pickup. .request.dhl.packaging';

            configService.getBoolean(packagingCIKey, shipmentService.getShipmentCountry()).then(setPackagingsAvailability);
        }

        function setPackagingsAvailability(packagingsAvailable) {
            vm.packagingsAvailable = packagingsAvailable;
        }

        function setDefaultValues() {
            getBookingReferenceNumber().then(getUserProfileDefaultValues);
        }

        function getBookingReferenceNumber() {
            var pickupDate = shipmentService.getShipmentProduct().pickupDate;
            var pickupAddress = shipmentService.getFormattedShipperAddress();
            return pickupService.getBookingReferenceNumber(pickupDate, pickupAddress).then(function (number) {
                vm.referenceNumber = number;
                vm.howStartShipping = SHIPPING_START_TYPE.DROPOFF;
            })['catch'](function () {
                vm.referenceNumber = null;
            })['finally'](function () {
                vm.isPickupScheduled = !!vm.referenceNumber;
            });
        }

        function setInitialPackagings() {
            var packagings = shipmentService.getPickupData().packageList;
            var packagingsExist = packagings && Array.isArray(packagings);

            vm.requirePackagings = packagingsExist && packagings.length;
            vm.packagings = packagingsExist ? packagings : [];
        }

        function updateTSAAvailability() {
            var key = 'General Settings. .enable.tsa.privacy.act.notification';
            vm.isTSANotificationShown = false;
            configService.getBoolean(key, vm.shipmentCountry).then(function (isTSANotificationShown) {
                vm.isTSANotificationShown = isTSANotificationShown;
            });
        }

        function processShipperAddress() {
            var newShipperAddress = shipmentService.getShipperAddress();
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
            pickupService.getUserProfileDefaultValues().then(function (data) {
                setPickupType(data.pickupDefaultType);
                setPickupLocationDefaultValue(data.pickupDetails);
                setPickupInstructionsDefaultValue(data.pickupDetails);
                setPickupWindowDefaultValues(data.pickupDetails);
            })['finally'](function () {
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
            return vm.isPickupScheduled || pickupType === PICKUP_TYPES.DROPOFF || pickupType === PICKUP_TYPES.PICKUP_SCHEDULED;
        }

        function isPickupAvailable(pickupType) {
            return pickupType === PICKUP_TYPES.PICKUP;
        }

        function setPickupLocationDefaultValue(data) {
            var pickupLocation = data.pickupLocationType.replace('_', ' ').toUpperCase();
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
            pickupService.getPickupLocations(vm.shipmentCountry).then(setPickupLocationsList).then(setPickupLocation);
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
            var key = pickupLocation.name.toLowerCase().replace(/\s/g, '_');
            return nlsService.getTranslationSync('shipment.pickup_' + key);
        }

        function updatePickupWindow() {
            var product = shipmentService.getShipmentProduct();
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
            var date = product.pickupDate;
            vm.pickupDate = {
                originalDate: date,
                month: dateTimeService.getLocalizedMonth(date),
                date: dateTimeService.getFormattedDate(date),
                day: dateTimeService.getFormattedDay(date, vm.timezoneOffset),
                shortDate: dateTimeService.getShortDate(date)
            };
        }

        function setPickupTimeOptions(product) {
            var _vm$pickupTime = vm.pickupTime;
            var readyByTime = _vm$pickupTime.readyByTime;
            var closeTime = _vm$pickupTime.closeTime;

            setPickupTime(product);
            if (isValidSelectedPickupTime(readyByTime, closeTime)) {
                vm.pickupTime.readyByTime = readyByTime;
                vm.pickupTime.closeTime = closeTime;
            }
        }

        function setPickupTime(product) {
            var pickupTimeDefaults = defaultValues.pickupWindow;
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
            var latestBookingTime = pickupService.getLatestBooking(product);
            return dateTimeService.getFormattedTime(latestBookingTime, vm.amPmMarker);
        }

        function isValidSelectedPickupTime(readyByTime, closeTime) {
            return readyByTime && closeTime && readyByTime >= vm.pickupTime.earliestPickup && readyByTime <= vm.pickupTime.pickupCutoffTime && readyByTime >= vm.pickupTime.minReadyByTime && closeTime - readyByTime >= vm.pickupTime.leadTime && closeTime <= vm.pickupTime.latestPickup && closeTime >= vm.pickupTime.pickupCutoffTime + vm.pickupTime.leadTime;
        }

        function displayPickupSlider() {
            var rangeSliderOptions = {
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

            rangeSliderOptions.onFinish = function (val) {
                vm.pickupTime.readyByTime = val.from;
                vm.pickupTime.closeTime = val.to;
            };

            rangeSliderOptions.prettify = vm.getFormattedTime;

            $timeout(function () {
                if (displayPickupWindowCallback) {
                    displayPickupWindowCallback(rangeSliderOptions);
                    vm.isPickupSliderShown = true;
                }
            });
        }

        function onNextClick(form, ewfFormCtrl) {
            if (form.$invalid && ewfFormCtrl.ewfValidation()) {
                return;
            }

            if (vm.requirePackagings) {
                var packagingsForm = vm.pickupPackagingsForm;

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
            vm.pickupLocation = vm.pickupLocation || { name: '' };
            vm.totalPickupWeight.unit = '';
            setPickupDataToShipmentService();
        }

        function setPickupDataToShipmentService() {
            var uomKey = UOM_KEYS.find(function (uom) {
                return uom.nlsKey === vm.totalPickupWeight.unit;
            });
            var addressDetails = vm.pickupAddress.addressDetails;
            var data = {
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
            var bookByMessage = '';
            if (vm.pickupTime.latestBooking) {
                var bookByTime = vm.pickupTime.latestBooking;
                var message = nlsService.getTranslationSync('shipment.pickup_latest_time_for_today');
                bookByMessage = message.replace('{book_by_time}', '<b>' + bookByTime + '</b>');
            }

            vm.bookByMessage = $sce.trustAsHtml(bookByMessage);
        }

        function setPickupWindowDisplayCallback(callback) {
            displayPickupWindowCallback = callback;
        }

        function getFormattedTime(value) {
            var milliseconds = dateTimeService.minToMs(value);
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
                template: '<div ewf-modal nls-title=shipment.pickup_tsa_privacy_act_notice id=customsInvoiceTemplates><p>PRIVACY ACT NOTICE</p><p>49 USC 114 authorizes the collection of this information. The information you provide will be used to qualify you or verify your status as a possible \"known shipper\".</p><p>Providing this information is voluntary, however, failure to provide the information will prevent you from qualifying as a \"known shipper\". This information will be disclosed to TSA personnel and contractors or other agents including IACs in the maintenance and operation of the known shipper program.</p><p>TSA may share the information with airport operators, foreign air carriers, IACs, law enforcement agencies, and others in accordance with the Privacy Act, 5 USC Section 552a.</p><p>For additional details, see the system of records notice for Transportation Security Threat Assessment System (DHS/TSA 002) published in the Federal Register.</p><p>For additional details on the content of this notice please visit <a ng-href=\"http://www.tsa.gov/\" target=_blank>www.tsa.gov</a> or <a ng-href=\"http://gpoaccess.gov/\" target=_blank>www.gpoaccess.gov</a>.</p><footer class=\"area__footer a-right\"><a class=\"btn btn_success\" ng-click=ewfModalCtrl.close()><span nls=common.modal_ok_button_label></span></a></footer></div>'
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
            var addressForm = vm.pickupAddressForm;

            return addressForm.validate() && addressForm.$valid;
        }
    }
});
//# sourceMappingURL=ewf-pickup-controller.js.map
