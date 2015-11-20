import ewf from 'ewf';
import './../pickup/pickup-service';
import './../../../services/date-time-service';

ewf.factory('shipmentProductPresenterFactory', ShipmentProductPresenterFactory);

ShipmentProductPresenterFactory.$inject = ['$filter', 'nlsService', 'pickupService', 'dateTimeService'];

export default function ShipmentProductPresenterFactory($filter, nlsService, pickupService, dateTimeService) {
    return {
        createProductPresenter
    };

    function createProductPresenter(data, timeZone = 'Z') {
        let estimatedDelivery = preProcessDate(data.estimatedDelivery);

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
            const day = $filter('date')(estimatedDelivery, 'EEEE').toLowerCase();
            return nlsService.getTranslationSync('datetime.' + day);
        }

        function formatDeliveryDate() {
            return $filter('date')(estimatedDelivery, 'd');
        }

        function formatDeliveryMonth() {
            const month = $filter('date')(estimatedDelivery, 'MMMM').toLowerCase();
            return nlsService.getTranslationSync('datetime.' + month);
        }

        function formatDeliveredBy() {
            if (isEndOfDay()) {
                return nlsService.getTranslationSync('shipment.shipment_products_delivery_by_end_of_day');
            }

            const timeMask = nlsService.getTranslationSync(
                    'shipment.shipment_products_delivery_by_time_mask'
                ) || 'shortTime';
            return $filter('date')(estimatedDelivery, timeMask).toLowerCase();
        }

        function isEndOfDay() {
            const time = $filter('date')(estimatedDelivery, 'shortTime');
            return (time === '11:59 PM');
        }

        function formatBookBy() {
            const latestBooking = pickupService.getLatestBooking(data);
            return dateTimeService.getFormattedTime(latestBooking, true);
        }

        function formatLatestPickup() {
            return dateTimeService.getFormattedTime(data.pickupEndTime, true);
        }

        function formatCost(value) {
            return $filter('number')(value, 2);
        }

        function getCostDetails() {
            const details = data.summary.payment.details.map((detail) => {
                const nlsKey = `shipment.details_${transformStringToNlsKey(detail.name)}`;
                let name = nlsService.getTranslationSync(nlsKey).replace('{label}', detail.label || '');
                if (name === nlsKey) {
                    name = toTitleCase(detail.name);
                }
                const value = calculateCostDetailsValue(detail);

                return {name, value};
            });

            return details.sort((first, second) => second.value - first.value);
        }

        function transformStringToNlsKey(name) {
            return name.toLowerCase().replace(/[\s\/:]/g, '_').replace(/&/g, 'and');
        }

        function calculateCostDetailsValue(detail) {
            const val = detail.taxes
                ? detail.taxes.reduce((sum, tax) => sum + tax.baseValue, 0)
                : detail.price.value;
            return formatCost(val);
        }

        function getMoneyBackGuaranteeData() {
            let applicable = !!data.summary.moneyBackGuarantee;
            let text = nlsService.getTranslationSync('shipment.shipment_products_details_money_back_guarantee');
            let tooltip = nlsService.getTranslationSync(
                'shipment.shipment_products_details_money_back_guarantee_tooltip'
            );
            tooltip = tooltip.replace('{product_name}', data.name);
            return {
                applicable,
                text,
                tooltip
            };
        }

        function getReceiveDeliveryNotificationsData() {
            let applicable = !!data.summary.receiveDeliveryNotifications;
            let text = nlsService.getTranslationSync(
                'shipment.shipment_products_details_receive_delivery_notifications'
            );
            let tooltip = nlsService.getTranslationSync(
                'shipment.shipment_products_details_receive_delivery_notifications_tooltip'
            );
            return {
                applicable,
                text,
                tooltip
            };
        }

        function getDeliveryDateShort() {
            let dateShortString = '';
            if (estimatedDelivery) {
                const deliveryDay = $filter('date')(estimatedDelivery, 'EEEE').toLowerCase();
                const deliveryMonth = $filter('date')(estimatedDelivery, 'MMMM').toLowerCase();
                const dayWeek = nlsService.getTranslationSync('datetime.' + deliveryDay + '_short');
                const dayNumber = formatDeliveryDate();
                const month = nlsService.getTranslationSync('datetime.' + deliveryMonth + '_short');
                const year = $filter('date')(estimatedDelivery, 'yyyy');
                dateShortString = `${dayWeek}, ${dayNumber} ${month}, ${year}`;
            }
            return dateShortString;
        }

        function getVolumetricWeight() {
            if (data.volumetricWeight) {
                const volumetricUnit = data.volumetricUnit.toLowerCase();
                return `${data.volumetricWeight} ${volumetricUnit}`;
            }
        }

        function toTitleCase(key) {
            return key.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
        }
    }
}
