import ShipmentProductPresenterFactory from './shipment-product-presenter-factory';
import PickupService from './../pickup/pickup-service';
import DateTimeService from './../../../services/date-time-service';
import 'angularMocks';

describe('ShipmentProductPresenterFactory', () => {
    let sut;
    let factory;
    let $filter;
    let nlsService, pickupService, dateTimeService;
                    //1439467200
    let timestamp = '2015-08-05T10:30:00.000Z';
                            //1439510340
    let endOfDayTimestamp = '2015-08-05T23:59:00.000Z';
    let productData = {
        estimatedDelivery: timestamp,
        pickupEndTime: 5400000,
        pickupCutoffTime: 5400000,
        bookingCutoffOffset: 5400000,
        summary: {
            moneyBackGuarantee: true,
            receiveDeliveryNotifications: true,
            payment: {
                total: {
                    value: 20.290001
                },
                details: [{
                    code: 'SPRQT',
                    name: 'Transportation Charge',
                    price: {
                        currency: 'USD',
                        value: 14.87
                    },
                    taxes: [
                        {
                            baseValue: 12.82,
                            currency: 'USD',
                            value: 2.05
                        }
                    ]
                }]
            }
        }
    };

    function initSut(customData) {
        const data = {};
        const timeZone = '-04:00';
        angular.extend(data, productData);
        angular.extend(data, customData);
        sut = new factory.createProductPresenter(data, timeZone);
    }

    beforeEach(inject((_$filter_) => {
        $filter = _$filter_;
        nlsService = jasmine.createSpyObj('nlsService', ['getTranslationSync']);
        nlsService.getTranslationSync.and.returnValue('some translated string');

        pickupService = jasmine.mockComponent(new PickupService());
        pickupService.getLatestBooking.and.returnValue(5400000);

        dateTimeService = jasmine.mockComponent(new DateTimeService());

        factory = new ShipmentProductPresenterFactory($filter, nlsService, pickupService, dateTimeService);
    }));

    describe('.name', () => {
        it('should set product name', () => {
            const name = 'something';
            initSut({name});
            expect(sut.name).toBe(name);
        });
    });

    describe('.code', () => {
        it('should set product name', () => {
            const code = '0';
            initSut({code});
            expect(sut.code).toBe(code);
        });
    });

    describe('.deliveredBy', () => {
        let filterSpy;
        let dateSpy;

        beforeEach(() => {
            filterSpy = jasmine.createSpy('filterSpy');
            dateSpy = jasmine.createSpy('dateSpy');
            factory = new ShipmentProductPresenterFactory(filterSpy, nlsService, pickupService, dateTimeService);
        });

        it('should set deliveredBy as End fo Day for estimated time 11:59 PM', () => {
            const endOfDay = 'End of Day';
            dateSpy.and.returnValue('11:59 PM');
            filterSpy.and.returnValue(dateSpy);
            nlsService.getTranslationSync.and.returnValue(endOfDay);
            initSut({
                estimatedDelivery: endOfDayTimestamp
            });
            expect(sut.deliveredBy).toBe(endOfDay);
        });

        it('should set deliveredBy to formatted time when estimated time not 11:59 PM', () => {
            dateSpy.and.returnValue('12:00 PM');
            filterSpy.and.returnValue(dateSpy);
            initSut({
                estimatedDelivery: timestamp
            });
            expect(sut.deliveredBy).toBe('12:00 pm');
        });
    });

    describe('.deliveryDay', () => {
        it('should be translated day week string', () => {
            const dayExpected = 'Wednesday';
            const nlsKey = 'datetime.wednesday';
            nlsService.getTranslationSync.and.returnValue(dayExpected);
            initSut({
                estimatedDelivery: timestamp
            });
            expect(nlsService.getTranslationSync).toHaveBeenCalledWith(nlsKey);
            expect(sut.deliveryDay).toBe(dayExpected);
        });
    });

    describe('.deliveryMonth', () => {
        it('should be translated month string', () => {
            const monthExpected = 'August';
            const nlsKey = 'datetime.august';
            nlsService.getTranslationSync.and.returnValue(monthExpected);
            initSut({
                estimatedDelivery: timestamp
            });
            expect(nlsService.getTranslationSync).toHaveBeenCalledWith(nlsKey);
            expect(sut.deliveryMonth).toBe(monthExpected);
        });
    });

    describe('.deliveryDate', () => {
        it('should be translated month string', () => {
            const dateExpected = '5';
            initSut({
                estimatedDelivery: timestamp
            });
            expect(sut.deliveryDate).toBe(dateExpected);
        });
    });

    describe('.costTotal', () => {
        it('should be formatted with 2 decimal places', () => {
            initSut();
            expect(sut.costTotal).toBe('20.29');
        });

    });

    describe('.costDetails', () => {
        it('should be an array of formatted payment details', () => {
            const costDetailsExpected = [{
                name: 'Transportation Charge',
                value: '12.82'
            }];
            const nameReturned = 'Transportation Charge';
            const nlsKey = 'shipment.details_transportation_charge';
            nlsService.getTranslationSync.and.returnValue(nameReturned);
            initSut();
            expect(nlsService.getTranslationSync).toHaveBeenCalledWith(nlsKey);
            expect(sut.costDetails).toEqual(jasmine.objectContaining(costDetailsExpected));
        });

        it('should ascended order cost details by value', () => {
            productData.summary.payment.details = [
                {
                    name: 'FUEL SURCHARGE',
                    price: {
                        value: 0.52
                    }
                },
                {
                    name: 'Transportation Charge',
                    price: {
                        value: 14.87
                    }
                }
            ];
            initSut();
            expect(sut.costDetails[0].value).toEqual('14.87');
        });

        it('should save payment detail name from DCT if there are no translation', () => {
            productData.summary.payment.details = [
                {
                    name: '12:00 PREMIUM',
                    price: {
                        value: 12.82
                    }
                }
            ];
            const costDetailsExpected = [{
                name: '12:00 Premium',
                value: '12.82'
            }];
            const nlsKey = 'shipment.details_12_00_premium';
            nlsService.getTranslationSync.and.returnValue(nlsKey);
            initSut();
            expect(nlsService.getTranslationSync).toHaveBeenCalledWith(nlsKey);
            expect(sut.costDetails).toEqual(jasmine.objectContaining(costDetailsExpected));
        });
    });

    describe('.bookBy and .latestPickup', () => {
        const timeExpected = '1:30 am';

        beforeEach(() => {
            dateTimeService.getFormattedTime.and.returnValue(timeExpected);
        });

        it('should be formatted time string', () => {
            initSut();
            expect(sut.bookBy).toBe(timeExpected);
        });

        it('should be formatted time string', () => {
            initSut({
                latestPickup: 5400000 // 1:30 am
            });
            expect(sut.latestPickup).toBe(timeExpected);
        });
    });

    describe('.deliveryDateShort', () => {
        it('should be formatted short date string', () => {
            const dateShortExpected = 'Wed, 5 Aug, 2015';
            nlsService.getTranslationSync = function(arg) {
                switch (arg) {
                    case 'datetime.wednesday_short':
                        return 'Wed';
                    case 'datetime.august_short':
                        return 'Aug';
                    default:
                        return '';
                }
            };
            initSut({
                estimatedDelivery: timestamp
            });
            expect(sut.deliveryDateShort).toBe(dateShortExpected);
        });
    });

    describe('.volumetricWeight', () => {
        it('should set product volumetricWeight with size and units', () => {
            const volumetricWeightExpected = '2 lb';
            initSut({
                volumetricWeight: 2,
                volumetricUnit: 'LB'
            });
            expect(sut.volumetricWeight).toBe(volumetricWeightExpected);
        });
    });
});
