import PrinterSettingController from './printer-settings-controller';
import 'angularMocks';

describe('PrinterSettingController', () => {
    let sut, $q, $timeout, $scope, deferredGet;
    let logServiceMock, printerSettingService;

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $scope = _$rootScope_.$new();
        deferredGet = $q.defer();

        printerSettingService = jasmine.createSpyObj(
            'savingShipmentsService',
            ['getPrinterSettings', 'updatePrinterSettings']
        );

        printerSettingService.getPrinterSettings.and.returnValue(deferredGet.promise);
        printerSettingService.updatePrinterSettings.and.returnValue(deferredGet.promise);
        logServiceMock = jasmine.createSpyObj('logService', ['log', 'error']);

        sut = new PrinterSettingController($scope, $q, $timeout, printerSettingService, logServiceMock);

    }));

    describe('#constructor', () => {
        it('should set default values to empty', () => {
            expect(sut.defautPrinterSettings.printerType).toBe('');
            expect(sut.defautPrinterSettings.printReceipt).toBe(false);
            expect(sut.defautPrinterSettings.automaticallyPrint).toBe(false);
        });

    });

    it('#preloadPrinterSettings', () => {
        let defer;

        beforeEach(() => {
            defer = $q.defer();
            printerSettingService.getPrinterSettings.and.returnValue(defer.promise);
        });

        it('should load printer settings data with service', () => {
            sut.preloadPrinterSettings();
            expect(printerSettingService.getPrinterSettings).toHaveBeenCalled();
        });

        it('should store defaults printer settings', () => {
            const data = {
                printerType: 'laser',
                printReceipt: true,
                automaticallyPrint: true
            };

            const printerType = {key: 'laser', name: 'Laser Printer'};
            sut.printer = '';
            sut.printReceipt = false;
            sut.automaticallyPrint = false;
            sut.preloadPrinterSettings();

            defer.resolve(data);
            $timeout.flush();

            expect(sut.printerType).toBe(printerType);
            expect(sut.printReceipt).toBe(data.printReceipt);
            expect(sut.automaticallyPrint).toBe(data.automaticallyPrint);
        });

    });

    describe('#updatePrinterSettings', () => {
        let defer;


        beforeEach(() => {
            defer = $q.defer();
            printerSettingService.updatePrinterSettings.and.returnValue(defer.promise);
        });

        it('should update saving shipment data with service', () => {

            const expectedObject = {
                printerType: 'laser',
                printReceipt: true,
                automaticallyPrint: true
            };

            sut.printerType = {key: 'laser', name: 'Laser Printer'};
            sut.printReceipt = true;
            sut.automaticallyPrint = true;

            sut.updatePrinterSettings();

            expect(printerSettingService.updatePrinterSettings).toHaveBeenCalledWith(expectedObject);
        });
    });

    describe('#resetValuesToDefault', () => {
        it('Should reset properties to default', () => {
            sut.defautPrinterSettings = {
                printerType: '',
                printReceipt: false,
                automaticallyPrint: false
            };

            sut.printer = {key: 'laser', name: 'Laser Printer'};
            sut.printReceipt = true;
            sut.automaticallyPrint = false;

            sut.resetValuesToDefault();
            expect(sut.printerType).toBe('');
            expect(sut.printReceipt).toBe(false);
            expect(sut.automaticallyPrint).toBe(false);
        });
    });
});
