/**
 * Test suit for dateTimeService
 */
import DateTimeService from './date-time-service';
import NlsService from './nls-service';
import 'angularMocks';

describe('dateTimeService', () => {
    let sut;
    let nlsService;
    let $filter;

    beforeEach(inject((_$filter_) => {
        $filter = _$filter_;
        nlsService = jasmine.mockComponent(new NlsService());

        sut = new DateTimeService($filter, nlsService);
    }));

    describe('#normalizeDate', () => {
        it('should normalize date', () => {
            let date = '2015-09-24T19:00:00.000-05:00';
            const shipmentTimeZoneOffset = -3600000 * 5;
            date = new Date(date);
            let result = sut.normalizeDate(date, shipmentTimeZoneOffset);

            expect(result.getHours()).toEqual(19);
            expect(result.getDate()).toEqual(24);
        });
    });

    describe('#getFormattedDate', () => {
        it('should get localized month from date', () => {
            let timestamp = '2015-09-24T10:30:00.000Z';
            const result = sut.getFormattedDate(timestamp);
            expect(result).toBe('24');
        });
    });

    describe('#getFormattedDay', () => {
        let shipmentDate, shipmentTimeZoneOffset;

        beforeEach(() => {
            shipmentTimeZoneOffset = -(new Date().getTimezoneOffset() * 60 * 1000);
            shipmentDate = new Date();
        });

        it('should translate today week day to "Today"', () => {
            sut.getFormattedDay(shipmentDate, shipmentTimeZoneOffset);
            expect(nlsService.getTranslationSync).toHaveBeenCalledWith('datetime.today');
        });

        it('should translate tomorrow week day to "Tomorrow"', () => {
            shipmentDate.setDate(shipmentDate.getDate() + 1);

            sut.getFormattedDay(shipmentDate, shipmentTimeZoneOffset);
            expect(nlsService.getTranslationSync).toHaveBeenCalledWith('datetime.tomorrow');
        });

        it('should leave not today and tomorrow week day as-is', () => {
            let regexp = '^datetime\\.monday$' +
                '|^datetime\\.tuesday$' +
                '|^datetime\\.wednesday$' +
                '|^datetime\\.thursday$' +
                '|^datetime\\.friday$' +
                '|^datetime\\.saturday$' +
                '|^datetime\\.sunday$';

            shipmentDate.setDate(shipmentDate.getDate() + 2);

            sut.getFormattedDay(shipmentDate, shipmentTimeZoneOffset);
            expect(nlsService.getTranslationSync).not.toHaveBeenCalledWith('datetime.tomorrow');
            expect(nlsService.getTranslationSync).not.toHaveBeenCalledWith('datetime.today');

            expect(nlsService.getTranslationSync.calls.mostRecent().args[0]).toMatch(new RegExp(regexp));
        });
    });

    describe('#getLocalizedMonth', () => {
        it('should get localized month from date', () => {
            let timestamp = '2015-09-24T10:30:00.000Z';
            sut.getLocalizedMonth(timestamp);
            expect(nlsService.getTranslationSync).toHaveBeenCalledWith('datetime.september');
        });
    });

    describe('#getShortDate', () => {
        it('return short date', () => {
            let timestamp = '2015-09-24T10:30:00.000Z';
            expect(sut.getShortDate(timestamp)).toBe('09/24/2015');
        });
    });

    describe('#getFormattedTime', () => {
        let time;

        beforeEach(() => {
            time = 5400000;
        });

        it('should return time in 12 hr format if withAmPMMarker is yes', () => {
            expect(sut.getFormattedTime(time, true)).toBe('1:30 am');
        });

        it('should return time in 24 hr format if withAmPMMarker is no', () => {
            expect(sut.getFormattedTime(time, false)).toBe('1:30');
        });

        it('should adjust minutes to smaller 15 minutes interval', () => {
            time = 5820000; // 1:37
            expect(sut.getFormattedTime(time, false)).toBe('1:30');
        });
    });

    describe('#msToMin', () => {
        it('should return number of minutes from milliseconds', () => {
            const resultExpected = 720;
            const time = resultExpected * 60000;
            expect(sut.msToMin(time)).toBe(resultExpected);
        });
    });

    describe('#minToMs', () => {
        it('should return number of milliseconds from minutes', () => {
            const time = 720;
            const resultExpected = time * 60000;
            expect(sut.minToMs(time)).toBe(resultExpected);
        });
    });

    describe('#getReadyByTime', () => {
        let pickupDate = new Date();
        pickupDate.setHours(pickupDate.getHours() - 1);

        it('should return earliestPickupTime from  if it is larger than current time', () => {
            let date = new Date();
            date.setHours(date.getHours() + 1);
            const dateExpected = date / 60000;
            expect(sut.getReadyByTime(date, 0, pickupDate)).toBe(dateExpected);
        });

        it('should return new ready by time if pickupTime from arguments is less than current time', () => {
            let resultExpected = 36000000 / 60000; // 10:00:00 UTC
            const date = 1000000; // 02:16:40 UTC
            jasmine.clock().mockDate(new Date(1445248534000)); // 9:55:00 UTC
            const result = sut.getReadyByTime(date, 0, 0);
            expect(result).toBe(resultExpected);
        });

        it('should return new ready by time according to timezoneOffset', () => {
            let resultExpected = 43200000 / 60000; // 12:00:00 UTC
            const offset = 7200000;
            const date = 1000000; // 02:16:40 UTC
            jasmine.clock().mockDate(new Date(1445248534000)); // 9:55:00 UTC
            const result = sut.getReadyByTime(date, offset, 0);
            expect(result).toBe(resultExpected);
        });

        it('should return earliestPickupTime from DCT if pickupDate is larger than current date', () => {
            const date = 1000000;
            const dateExpected = date / 60000;
            pickupDate.setHours(pickupDate.getHours() + 24);
            expect(sut.getReadyByTime(date, 0, pickupDate)).toBe(dateExpected);
        });
    });

    describe('#isToday', () => {
        const offset = 0;

        it('should return true if date is the same as today', () => {
            const today = new Date();
            const date = $filter('date')(today, 'yyyy-MM-dd');
            expect(sut.isToday(date, offset)).toBe(true);
        });

        it('should return false if date is not the same as today', () => {
            const date = '2000-10-23';
            expect(sut.isToday(date, offset)).toBe(false);
        });
    });
});
