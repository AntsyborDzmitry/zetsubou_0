import ewf from 'ewf';
import EwfShipmentStepBaseController from './../ewf-shipment-step-base-controller';
import './../ewf-shipment-service';
import './shipment-products-service';
import './shipment-product-presenter-factory';
import './../../../services/date-time-service';

EwfShipmentProductsController.prototype = new EwfShipmentStepBaseController('shipment-products');
EwfShipmentProductsController.$inject = [
    '$scope',
    '$filter',
    '$timeout',
    '$document',
    'shipmentService',
    'shipmentProductsService',
    'shipmentProductPresenterFactory',
    'nlsService',
    'dateTimeService'
];

ewf.controller('EwfShipmentProductsController', EwfShipmentProductsController);
export default function EwfShipmentProductsController(
    $scope,
    $filter,
    $timeout,
    $document,
    shipmentService,
    shipmentProductsService,
    shipmentProductPresenterFactory,
    nlsService,
    dateTimeService
) {
    // view model
    const vm = this;

    const DATE_FORMAT = 'yyyy-MM-dd';
    const DATE_FORMAT_FULL = 'yyyy-MM-ddTHH:mm:ss.sss';
    const DATE_FORMAT_HOURS = 'HH:mm';
    const DATE_FORMAT_ESTIMATE = 'MMM dd, y, h:mm a';
    const PREVIEW_COUNT = 6;
    const MAX_SHIPMENT_INTERVAL = 90;

    // properties
    Object.assign(vm, {
        shipmentDates: [],
        shipmentTimeZone: null,
        userTimeZone: null,
        products: [],
        productsOrigin: [],
        activeDate: null,
        selectedProduct: null,
        disclaimerVisible: false,
        visibleDetailsIndex: null,
        isFasterMessageShown: false,
        timeMask: '',
        shipmentEstimateMessage: '',

        disabledDates: [],
        enabledDates: [],
        disabledDays: [],
        timeZoneOffset: null,
        favoriteProduct: '',

        calendarSelectedDate: null,
        dctErrorMessageShown: false,
        dctNotFoundMessageShown: false,

        // methods
        onInit,
        loadShipmentDates,
        generateShipmentDates,
        addWatchers,
        onEditClick,
        onEdit,
        displayProductsByDate,
        selectProduct,
        showDisclaimer,
        toggleDetails,
        isDetailsVisible,
        getCurrentFastestProductName,
        getFasterMessageTranslation,
        openCalendar,
        formatShipmentDate,
        isDateDisabled,
        normalizeDate,
        datesEquals,
        getMinDate,
        formatDateFull,
        updateShipmentEstimateMessage,
        countMaxDate,
        getFavoriteProduct,
        formatShipmentMonth,
        loadShipmentData
    });

    function onInit() {
        initLocalizedTimeMask();

        vm.userTimeZone = formatTZOffsetToStrTZ(-(new Date().getTimezoneOffset() * 60 * 1000));
        vm.maxShipmentDate = vm.countMaxDate(new Date(), MAX_SHIPMENT_INTERVAL);

        vm.addWatchers();
        vm.updateShipmentEstimateMessage(new Date());
        nlsService.getDictionary('datetime');
    }

    function countMaxDate(date, interval) {
        date.setDate(date.getDate() + interval);
        return date;
    }

    function addWatchers() {
        $scope.$watch(() => {
            return vm.calendarOpened;
        }, onCalendarOpenedChanged);

        $scope.$watch(() => {
            return vm.calendarSelectedDate;
        }, onCalendarSelectedDateChanged);
    }

    function initLocalizedTimeMask() {
        vm.timeMask = nlsService.getTranslationSync('shipment.shipment_products_delivery_by_time_mask');
    }

    function onCalendarOpenedChanged(value) {
        if (value) {
            $document.bind('click', closeCalendar);
        } else {
            $document.unbind('click', closeCalendar);
        }
    }

    function onCalendarSelectedDateChanged(date) {
        if (date) {
            let realDate = date;
            let alreadyAdded = vm.shipmentDates.find((dt) => datesEquals(realDate, dt));
            if (alreadyAdded) {
                realDate = alreadyAdded;
            } else {
                vm.shipmentDates[PREVIEW_COUNT] = realDate;
            }
            vm.displayProductsByDate(realDate);
            vm.calendarOpened = false;
        }
    }

    function loadShipmentDates() {
        shipmentProductsService.getShipmentDates(
            shipmentService.getShipmentCountry(),
            shipmentService.getShipmentPostCode(),
            shipmentService.getShipmentCityName()
        )
            .then((data) => {
                const dateSelectedFromCalendar = vm.shipmentDates && vm.shipmentDates[PREVIEW_COUNT];

                vm.disabledDays = data.disabledDays || [];
                vm.shipmentTimeZoneOffset = data.timeZoneOffset;
                vm.shipmentTimeZone = formatTZOffsetToStrTZ(data.timeZoneOffset);//date.timeZone;
                vm.disabledDates = data.disabledDates || [];
                vm.enabledDates = data.enabledDates || [];

                vm.shipmentDates = vm.generateShipmentDates(PREVIEW_COUNT);

                if (dateSelectedFromCalendar) {
                    vm.shipmentDates.push(dateSelectedFromCalendar);
                }

                vm.displayProductsByDate(vm.shipmentDates && (vm.activeDate || vm.shipmentDates[0]));
            });
    }

    function formatTZOffsetToStrTZ(timezoneOffset = 0) {
        let date = new Date(Math.abs(timezoneOffset));
        date.setTime(date.getTime() + date.getTimezoneOffset() / 60 * 3600000);
        let strTime = $filter('date')(date, DATE_FORMAT_HOURS);
        return timezoneOffset < 0
            ? `-${strTime}`
            : `+${strTime}`;
    }

    function getMinDate() {
        return vm.shipmentDates.length && vm.shipmentDates[0];
    }

    function updateShipmentEstimateMessage(date) {
        let message = nlsService.getTranslationSync('shipment.shipment_rate_estimate_message');
        let formattedDate = $filter('date')(new Date(date), DATE_FORMAT_ESTIMATE);

        vm.shipmentEstimateMessage = message.replace('{date}', formattedDate);
    }

    function generateShipmentDates(count = 0) {
        const dates = [];

        for (let i = 0, j = 0; i < count; ++j) {
            let date = new Date();
            date.setDate(date.getDate() + j);
            date = normalizeDate(date);

            if (!isDateDisabled(date, null, false)) {
                i++;
                dates.push(date);
            }
        }

        return dates;
    }

    function normalizeDate(date) {
        return dateTimeService.normalizeDate(date, vm.shipmentTimeZoneOffset);
    }

    function datesEquals(date1, date2) {
        let fullDate1 = date1;
        if (fullDate1 instanceof Date) {
            fullDate1 = formatDate(fullDate1);
        }

        let fullDate2 = date2;
        if (fullDate2 instanceof Date) {
            fullDate2 = formatDate(fullDate2);
        }

        return getDateFromFullDate(fullDate1) === getDateFromFullDate(fullDate2);
    }

    function getDateFromFullDate(fullDate) {
        return fullDate.substring(0, DATE_FORMAT.length);
    }

    function formatDate(date, format = DATE_FORMAT) {
        return $filter('date')(date, format);
    }

    function formatDateFull(date) {
        return formatDate(date, DATE_FORMAT_FULL) + vm.shipmentTimeZone;
    }

    function nullifyTime(date) {
        const dateWithoutTime = new Date(date);
        dateWithoutTime.setHours(0);
        dateWithoutTime.setMinutes(0);
        dateWithoutTime.setSeconds(0);
        dateWithoutTime.setMilliseconds(0);
        return dateWithoutTime;
    }

    function openCalendar() {
        $timeout(() => {
            vm.calendarOpened = true;
        }, 100);
    }

    function closeCalendar() {
        $scope.$apply(() => {
            vm.calendarOpened = false;
        });
    }

    function isDateDisabled(date, mode, normalize) {
        if (vm.enabledDates.some((dt) => datesEquals(date, dt))) {
            return false;
        }

        return (date > vm.maxShipmentDate)
            || vm.disabledDates.some((dt) => datesEquals(date, dt))
            || vm.disabledDays.some((day) => {
                const normalizedDate = normalize ? normalizeDate(date) : date;
                return normalizedDate.getDay() === (day - 1);
            });
    }

    function selectProduct(product, index) {
        const productOrigin = vm.productsOrigin[index];
        shipmentService.setShipmentProduct(productOrigin);
        shipmentService.setShipmentDate(vm.formatDateFull(nullifyTime(vm.activeDate)));
        vm.selectedProduct = product;
        vm.nextCallback();
    }

    function displayProductsByDate(date) {
        vm.activeDate = date;
        vm.products = [];
        vm.toggleDetails(null);
        vm.dctErrorMessageShown = false;
        vm.dctNotFoundMessageShown = false;

        const formattedDate = formatDateFull(nullifyTime(date));
        shipmentProductsService.getProductsByDate(formattedDate, shipmentService.getQuotesRequestData(date))
            .then((products) => {
                vm.productsOrigin = products;
                if (products) {
                    vm.products = applyProductPresenter(products);
                } else {
                    vm.dctNotFoundMessageShown = true;
                }
            })
            .catch((response) => {
                vm.productsOrigin = [];
                vm.products = [];
                if (response.status === 404) {
                    vm.dctNotFoundMessageShown = true;
                } else if (response.status >= 400) {
                    vm.dctErrorMessageShown = true;
                }
            });
    }

    function applyProductPresenter(products) {
        return products.map((prod) => shipmentProductPresenterFactory.createProductPresenter(prod, vm.userTimeZone));
    }

    function onEditClick() {
        vm.editCallback();
    }

    function onEdit() {
        vm.disclaimerVisible = false;
        shipmentProductsService.clearProductsCache();
        vm.loadShipmentDates();
        if (vm.activeDate) {
            vm.displayProductsByDate(vm.activeDate);
        }
        vm.getFavoriteProduct();
    }

    function showDisclaimer() {
        vm.disclaimerVisible = true;
    }

    function toggleDetails(index) {
        if (vm.visibleDetailsIndex === index) {
            vm.visibleDetailsIndex = null;
        } else {
            vm.visibleDetailsIndex = index;
        }
    }

    function isDetailsVisible(index) {
        return (vm.visibleDetailsIndex === index);
    }

    function getCurrentFastestProductName() {
        if (vm.products && vm.products[0]) {
            return vm.products[0].name;
        }
    }

    function getFasterMessageTranslation() {
        const productName = vm.getCurrentFastestProductName();
        const message = nlsService.getTranslationSync('shipment.shipment_products_get_it_there_faster_message');
        return message.replace('{product_name}', productName);
    }

    function formatShipmentDate(date) {
        return dateTimeService.getFormattedDay(date, vm.shipmentTimeZoneOffset);
    }

    function getFavoriteProduct() {
        return shipmentProductsService.getFavoriteProduct()
            .then((productCode) => {
                vm.favoriteProduct = productCode;
            })
            .catch(() => {
                vm.favoriteProduct = '';
            });
    }

    function formatShipmentMonth(date) {
        return dateTimeService.getLocalizedMonth(date);
    }

    function loadShipmentData(data) {
        Object.assign(vm, shipmentService.getShipmentProductsModelData(data));
    }
}
