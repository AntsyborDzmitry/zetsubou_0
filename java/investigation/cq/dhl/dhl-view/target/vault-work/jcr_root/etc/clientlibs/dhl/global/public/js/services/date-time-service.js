define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = DateTimeService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('dateTimeService', DateTimeService);

    DateTimeService.$inject = ['$filter', 'nlsService'];

    function DateTimeService($filter, nlsService) {
        var publicApi = {
            normalizeDate: normalizeDate,
            getFormattedDate: getFormattedDate,
            getFormattedDay: getFormattedDay,
            getLocalizedMonth: getLocalizedMonth,
            getShortDate: getShortDate,
            getFormattedTime: getFormattedTime,
            getReadyByTime: getReadyByTime,
            msToMin: msToMin,
            minToMs: minToMs,
            isToday: isToday
        };

        function normalizeDate(date) {
            var shipmentTimezoneOffset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            var result = new Date(date),
                timeZoneDiff = shipmentTimezoneOffset + result.getTimezoneOffset() * 60 * 1000;

            result.setTime(result.getTime() + timeZoneDiff);
            return result;
        }

        function getFormattedDate(date) {
            var dateNormalized = normalizeDate(date);
            return $filter('date')(dateNormalized, 'd');
        }

        function getFormattedDay(date, shipmentTimezoneOffset) {
            var localDate = normalizeDate(new Date(), shipmentTimezoneOffset);
            var tomorrow = new Date().setDate(localDate.getDate() + 1);
            var dateFormatted = $filter('date')(date, 'mediumDate');
            var todayFormatted = $filter('date')(localDate, 'mediumDate');
            var tomorrowFormatted = $filter('date')(tomorrow, 'mediumDate');
            var dayFormatted = undefined;
            switch (dateFormatted) {
                case todayFormatted:
                    dayFormatted = 'today';
                    break;
                case tomorrowFormatted:
                    dayFormatted = 'tomorrow';
                    break;
                default:
                    dayFormatted = $filter('date')(date, 'EEEE').toLowerCase();
            }
            return nlsService.getTranslationSync('datetime.' + dayFormatted);
        }

        function getLocalizedMonth(date) {
            var dateNormalized = normalizeDate(date);
            var monthFormatted = $filter('date')(dateNormalized, 'MMMM').toLowerCase();
            return nlsService.getTranslationSync('datetime.' + monthFormatted);
        }

        function getShortDate(date) {
            var dateNormalized = normalizeDate(date);
            return $filter('date')(dateNormalized, 'MM/dd/yyyy');
        }

        function getFormattedTime(time) {
            var withAmPmMarker = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var date = getClosestQuarter(time, true);
            if (withAmPmMarker) {
                return formatAMPM(date);
            }
            return date.getUTCHours() + ':' + formatMinutes(date);
        }

        function formatMinutes(date) {
            var minutes = date.getUTCMinutes();
            return minutes < 10 ? '0' + minutes : minutes;
        }

        function formatAMPM(date) {
            var hours = date.getUTCHours();
            var minutes = formatMinutes(date);
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours %= 12;
            hours = hours ? hours : 12;
            return hours + ':' + minutes + ' ' + ampm;
        }

        function getReadyByTime(earliestPickup, offset, pickupDate) {
            var pickupDateNormalized = normalizeDate(pickupDate);
            var date = new Date();
            var currentTime = getHoursMinutesInMs(date) + offset;
            var readyByTime = currentTime < earliestPickup || pickupDateNormalized > date ? earliestPickup : getReadyByTimeFromCurrentTime(currentTime);
            return msToMin(readyByTime);
        }

        function getReadyByTimeFromCurrentTime(currentTime) {
            var date = getClosestQuarter(currentTime);
            return getHoursMinutesInMs(date);
        }

        function getHoursMinutesInMs(date) {
            return date.getUTCHours() * 3600000 + date.getUTCMinutes() * 60000;
        }

        function msToMin(time) {
            return time / 60000;
        }

        function minToMs(time) {
            return time * 60000;
        }

        function isToday(date, offset) {
            var localDate = normalizeDate(new Date(), offset);
            var today = $filter('date')(localDate, 'yyyy-MM-dd');
            return today === date;
        }

        function getClosestQuarter(time) {
            var adjustToPastTime = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            var PICKUP_TIME_INTERVAL = 15;
            var date = new Date(time);
            var minutesDiff = date.getMinutes() % PICKUP_TIME_INTERVAL;
            if (minutesDiff) {
                var minutes = date.getMinutes() - minutesDiff;
                minutes = adjustToPastTime ? minutes : minutes + PICKUP_TIME_INTERVAL;
                var hours = date.getHours();
                if (minutes === 60) {
                    date.setHours(++hours);
                    minutes = 0;
                }
                date.setMinutes(minutes);
            }
            return date;
        }

        return publicApi;
    }
});
//# sourceMappingURL=date-time-service.js.map
