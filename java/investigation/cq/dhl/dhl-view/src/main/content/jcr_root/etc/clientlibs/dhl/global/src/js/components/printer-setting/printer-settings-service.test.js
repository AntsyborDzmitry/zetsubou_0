import printerSettingsService from './printer-settings-service';
import 'angularMocks';

describe('printerSettingsService', () => {

    let sut, logService, getRequestDeferred;
    let $http, $q, $timeout;

    const PRINTER_SETTINGS_ENDPOINT = '/api/myprofile/shipment/settings/printer';

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        getRequestDeferred = $q.defer();

        $http = {
            get: jasmine.createSpy('get').and.returnValue(getRequestDeferred.promise),
            post: jasmine.createSpy('post').and.returnValue(getRequestDeferred.promise)
        };

        logService = jasmine.createSpyObj('logService', ['error']);

        sut = new printerSettingsService($http, $q, logService);
    }));


    describe('#getPrinterSetings', () => {

        it('should call for $http.get', () => {
            sut.getPrinterSettings();
            expect($http.get).toHaveBeenCalledWith(PRINTER_SETTINGS_ENDPOINT);
        });

        it('should load printer settings ', () => {
            const successResponse = {
                status: 200,
                data: {
                    printerType: 'laser',
                    printReceipt: true,
                    automaticallyPrint: true
                }
            };
            sut.getPrinterSettings()
                .then((response) => {
                    expect(response).toBe(successResponse.data);
                    expect(logService.error).not.toHaveBeenCalled();
                });

            getRequestDeferred.resolve(successResponse);
            $timeout.flush();
        });

        it('should log error when printer data failed', () => {
            const errorResponse = {
                status: 403,
                data: {
                    message: 'fail to load'
                }
            };
            sut.getPrinterSettings()
                .then((response) => {
                    expect(response).toBe(errorResponse.data);
                    expect(logService.error).toHaveBeenCalled();
                });
            getRequestDeferred.reject(errorResponse);
            $timeout.flush();
        });
    });

    describe('#updatePrinterSettings', () => {
        it('should send post method', () => {
            const data = {
                printerType: 'laser',
                printReceipt: true,
                automaticallyPrint: true
            };
            sut.updatePrinterSettings(data);
            expect($http.post).toHaveBeenCalledWith(PRINTER_SETTINGS_ENDPOINT, data);
        });
    });

});
