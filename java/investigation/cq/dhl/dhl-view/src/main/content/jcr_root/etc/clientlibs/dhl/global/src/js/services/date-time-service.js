import ewf from 'ewf';

ewf.service('dateTimeService', DateTimeService);

DateTimeService.$inject = ['$filter', 'nlsService'];

export default function DateTimeService($filter, nlsService) {
    const publicApi = {
        normalizeDate,
        getFormattedDate,
        getFormattedDay,
        getLocalizedMonth,
        getShortDate,
        getFormattedTime,
        getReadyByTime,
        msToMin,
        minToMs,
        isToday
    };

    function normalizeDate(date, shipmentTimezoneOffset = 0) {
        let result = new Date(date),
            timeZoneDiff = shipmentTimezoneOffset + (result.getTimezoneOffset() * 60 * 1000);

        result.setTime(result.getTime() + timeZoneDiff);
        return result;
    }

    function getFormattedDate(date) {
        const dateNormalized = normalizeDate(date);
        return $filter('date')(dateNormalized, 'd');
    }

    function getFormattedDay(date, shipmentTimezoneOffset) {
        const localDate = normalizeDate(new Date(), shipmentTimezoneOffset);
        const tomorrow = new Date().setDate(localDate.getDate() + 1);
        const dateFormatted = $filter('date')(date, 'mediumDate');
        const todayFormatted = $filter('date')(localDate, 'mediumDate');
        const tomorrowFormatted = $filter('date')(tomorrow, 'mediumDate');
        let dayFormatted;
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
        return nlsService.getTranslationSync(`datetime.${dayFormatted}`);
    }

    function getLocalizedMonth(date) {
        const dateNormalized = normalizeDate(date);
        const monthFormatted = $filter('date')(dateNormalized, 'MMMM').toLowerCase();
        return nlsService.getTranslationSync(`datetime.${monthFormatted}`);
    }

    function getShortDate(date) {
        const dateNormalized = normalizeDate(date);
        return $filter('date')(dateNormalized, 'MM/dd/yyyy');
    }

    function getFormattedTime(time, withAmPmMarker = false) {
        const date = getClosestQuarter(time, true);
        if (withAmPmMarker) {
            return formatAMPM(date);
        }
        return `${date.getUTCHours()}:${formatMinutes(date)}`;
    }

    function formatMinutes(date) {
        const minutes = date.getUTCMinutes();
        return (minutes < 10) ? '0' + minutes : minutes;
    }

    function formatAMPM(date) {
        let hours = date.getUTCHours();
        let minutes = formatMinutes(date);
        const ampm = (hours >= 12) ? 'pm' : 'am';
        hours %= 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
    }

    function getReadyByTime(earliestPickup, offset, pickupDate) {
        const pickupDateNormalized = normalizeDate(pickupDate);
        let date = new Date();
        const currentTime = getHoursMinutesInMs(date) + offset;
        const readyByTime = (currentTime < earliestPickup || pickupDateNormalized > date)
            ? earliestPickup
            : getReadyByTimeFromCurrentTime(currentTime);
        return msToMin(readyByTime);
    }

    function getReadyByTimeFromCurrentTime(currentTime) {
        const date = getClosestQuarter(currentTime);
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
        const localDate = normalizeDate(new Date(), offset);
        const today = $filter('date')(localDate, 'yyyy-MM-dd');
        return today === date;
    }

    function getClosestQuarter(time, adjustToPastTime = false) {
        const PICKUP_TIME_INTERVAL = 15;
        const date = new Date(time);
        const minutesDiff = date.getMinutes() % PICKUP_TIME_INTERVAL;
        if (minutesDiff) {
            let minutes = date.getMinutes() - minutesDiff;
            minutes = adjustToPastTime ? minutes : minutes + PICKUP_TIME_INTERVAL;
            let hours = date.getHours();
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
