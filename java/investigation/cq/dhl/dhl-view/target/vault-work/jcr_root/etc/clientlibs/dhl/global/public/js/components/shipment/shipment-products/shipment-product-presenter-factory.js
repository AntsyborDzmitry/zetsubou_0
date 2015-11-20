define(['exports', 'module', 'ewf', './../pickup/pickup-service', './../../../services/date-time-service'], function (exports, module, _ewf, _pickupPickupService, _servicesDateTimeService) {
    'use strict';

    module.exports = ShipmentProductPresenterFactory;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].factory('shipmentProductPresenterFactory', ShipmentProductPresenterFactory);

    ShipmentProductPresenterFactory.$inject = ['$filter', 'nlsService', 'pickupService', 'dateTimeService'];

    function ShipmentProductPresenterFactory($filter, nlsService, pickupService, dateTimeService) {
        return {
            createProductPresenter: createProductPresenter
        };

        function createProductPresenter(data) {
            var timeZone = arguments.length <= 1 || arguments[1] === undefined ? 'Z' : arguments[1];

            var estimatedDelivery = preProcessDate(data.estimatedDelivery);

            return new ShipmentProductPresenter();

            function ShipmentProductPresenter() {
                this.name = data.name;
                this.code = data.code;
                this.estimatedDelivery = data.estimatedDelivery;
                this.deliveryDay = formatDeliveryDay();
                this.deliveryDate = formatDeliveryDate();
                this.deliveryMonth = formatDeliveryMonth();
                this.deliveredBy = formatDeliveredBy();
                this.bookBy = formatBookBy();
                this.latestPickup = formatLatestPickup();
                this.costTotal = formatCost(data.summary.payment.total.value);
                this.costDetails = getCostDetails();
                this.moneyBackGuarantee = getMoneyBackGuaranteeData();
                this.receiveDeliveryNotifications = getReceiveDeliveryNotificationsData();
                this.deliveryDateShort = getDeliveryDateShort();
                this.volumetricWeight = getVolumetricWeight();
            }

            function preProcessDate(strDate) {
                return strDate.replace('Z', timeZone);
            }

            function formatDeliveryDay() {
                var day = $filter('date')(estimatedDelivery, 'EEEE').toLowerCase();
                return nlsService.getTranslationSync('datetime.' + day);
            }

            function formatDeliveryDate() {
                return $filter('date')(estimatedDelivery, 'd');
            }

            function formatDeliveryMonth() {
                var month = $filter('date')(estimatedDelivery, 'MMMM').toLowerCase();
                return nlsService.getTranslationSync('datetime.' + month);
            }

            function formatDeliveredBy() {
                if (isEndOfDay()) {
                    return nlsService.getTranslationSync('shipment.shipment_products_delivery_by_end_of_day');
                }

                var timeMask = nlsService.getTranslationSync('shipment.shipment_products_delivery_by_time_mask') || 'shortTime';
                return $filter('date')(estimatedDelivery, timeMask).toLowerCase();
            }

            function isEndOfDay() {
                var time = $filter('date')(estimatedDelivery, 'shortTime');
                return time === '11:59 PM';
            }

            function formatBookBy() {
                var latestBooking = pickupService.getLatestBooking(data);
                return dateTimeService.getFormattedTime(latestBooking, true);
            }

            function formatLatestPickup() {
                return dateTimeService.getFormattedTime(data.pickupEndTime, true);
            }

            function formatCost(value) {
                return $filter('number')(value, 2);
            }

            function getCostDetails() {
                var details = data.summary.payment.details.map(function (detail) {
                    var nlsKey = 'shipment.details_' + transformStringToNlsKey(detail.name);
                    var name = nlsService.getTranslationSync(nlsKey).replace('{label}', detail.label || '');
                    if (name === nlsKey) {
                        name = toTitleCase(detail.name);
                    }
                    var value = calculateCostDetailsValue(detail);

                    return { name: name, value: value };
                });

                return details.sort(function (first, second) {
                    return second.value - first.value;
                });
            }

            function transformStringToNlsKey(name) {
                return name.toLowerCase().replace(/[\s\/:]/g, '_').replace(/&/g, 'and');
            }

            function calculateCostDetailsValue(detail) {
                var val = detail.taxes ? detail.taxes.reduce(function (sum, tax) {
                    return sum + tax.baseValue;
                }, 0) : detail.price.value;
                return formatCost(val);
            }

            function getMoneyBackGuaranteeData() {
                var applicable = !!data.summary.moneyBackGuarantee;
                var text = nlsService.getTranslationSync('shipment.shipment_products_details_money_back_guarantee');
                var tooltip = nlsService.getTranslationSync('shipment.shipment_products_details_money_back_guarantee_tooltip');
                tooltip = tooltip.replace('{product_name}', data.name);
                return {
                    applicable: applicable,
                    text: text,
                    tooltip: tooltip
                };
            }

            function getReceiveDeliveryNotificationsData() {
                var applicable = !!data.summary.receiveDeliveryNotifications;
                var text = nlsService.getTranslationSync('shipment.shipment_products_details_receive_delivery_notifications');
                var tooltip = nlsService.getTranslationSync('shipment.shipment_products_details_receive_delivery_notifications_tooltip');
                return {
                    applicable: applicable,
                    text: text,
                    tooltip: tooltip
                };
            }

            function getDeliveryDateShort() {
                var dateShortString = '';
                if (estimatedDelivery) {
                    var deliveryDay = $filter('date')(estimatedDelivery, 'EEEE').toLowerCase();
                    var deliveryMonth = $filter('date')(estimatedDelivery, 'MMMM').toLowerCase();
                    var dayWeek = nlsService.getTranslationSync('datetime.' + deliveryDay + '_short');
                    var dayNumber = formatDeliveryDate();
                    var month = nlsService.getTranslationSync('datetime.' + deliveryMonth + '_short');
                    var year = $filter('date')(estimatedDelivery, 'yyyy');
                    dateShortString = dayWeek + ', ' + dayNumber + ' ' + month + ', ' + year;
                }
                return dateShortString;
            }

            function getVolumetricWeight() {
                if (data.volumetricWeight) {
                    var volumetricUnit = data.volumetricUnit.toLowerCase();
                    return data.volumetricWeight + ' ' + volumetricUnit;
                }
            }

            function toTitleCase(key) {
                return key.toLowerCase().replace(/\b\w/g, function (letter) {
                    return letter.toUpperCase();
                });
            }
        }
    }
});
//# sourceMappingURL=shipment-product-presenter-factory.js.map
