import wantToShareService from './want-to-share-service';
import 'angularMocks';

describe('wantToShareService', function() {

    let sut;
    let $httpBackend, $httpClone;
    let logService;

    const ERROR = 'some_error';

    const expectedRequestData = {
        shipmentId: 'shipmentId'
    };

    const expectedResponse = {
        data: 'some_data'
    };

    const shareDefaults = {
        data: 'some_data'
    };

    let sharingInfo = {};

    beforeEach(inject(($http, $q, _$httpBackend_) => {
        $httpBackend = _$httpBackend_;

        logService = jasmine.createSpyObj('logService', ['error']);
        $httpClone = $http;
        spyOn($http, 'get').and.callThrough();
        spyOn($http, 'post').and.callThrough();

        sharingInfo = {
            toAddresses: 'address1@a.com, address2@b.com'
        };

        sut = new wantToShareService($http, $q, logService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#getShipmentShareDefaults', () => {

        const url = `/api/shipment/${expectedRequestData.shipmentId}/share/settings`;

        it('should make GET request to the server with correct data', () => {
            sut.getShipmentShareDefaults(expectedRequestData.shipmentId);
            $httpBackend.whenGET(url).respond(200);
            $httpBackend.flush();
            expect($httpClone.get).toHaveBeenCalledWith(url);
        });

        it('should return correct data after called', () => {
            $httpBackend.whenGET(url).respond(200, expectedResponse);
            const shareSettingsPromise = sut.getShipmentShareDefaults(expectedRequestData.shipmentId);

            shareSettingsPromise.then((response) => {
                expect(response).toEqual(expectedResponse);
            });
            $httpBackend.flush();
        });

        it('should log error when error happened', () => {
            $httpBackend.whenGET(url).respond(400, 'some_error');
            const shareSettingsPromise = sut.getShipmentShareDefaults(expectedRequestData.shipmentId);

            shareSettingsPromise.catch(() => {
                expect(logService.error).toHaveBeenCalled();
            });
            $httpBackend.flush();
        });

        it('should return error when error happened', () => {
            $httpBackend.whenGET(url).respond(400, ERROR);
            const shareSettingsPromise = sut.getShipmentShareDefaults(expectedRequestData.shipmentId);

            shareSettingsPromise.catch((err) => {
                expect(err).toBe(ERROR);
            });
            $httpBackend.flush();
        });
    });

    describe('#getShareFields', () => {

        const url = `/api/shipment/${expectedRequestData.shipmentId}/share/fields`;

        it('should make GET request to the server with correct data', () => {
            sut.getShareFields(expectedRequestData.shipmentId);
            $httpBackend.whenGET(url).respond(200);
            $httpBackend.flush();
            expect($httpClone.get).toHaveBeenCalledWith(url);
        });

        it('should return correct data after called', () => {
            $httpBackend.whenGET(url).respond(200, expectedResponse);
            const shareSettingsPromise = sut.getShareFields(expectedRequestData.shipmentId);

            shareSettingsPromise.then((response) => {
                expect(response).toEqual(expectedResponse);
            });
            $httpBackend.flush();
        });

        it('should log error when error happened', () => {
            $httpBackend.whenGET(url).respond(400, 'some_error');
            const shareSettingsPromise = sut.getShareFields(expectedRequestData.shipmentId);

            shareSettingsPromise.catch(() => {
                expect(logService.error).toHaveBeenCalled();
            });
            $httpBackend.flush();
        });

        it('should return error when error happened', () => {
            $httpBackend.whenGET(url).respond(400, ERROR);
            const shareSettingsPromise = sut.getShareFields(expectedRequestData.shipmentId);

            shareSettingsPromise.catch((err) => {
                expect(err).toBe(ERROR);
            });
            $httpBackend.flush();
        });
    });

    describe('#shareDetails', () => {

        const url = `/api/shipment/${expectedRequestData.shipmentId}/share`;

        it('should make POST request with correct data', () => {
            const shareObject = sharingInfo;
            shareObject.details = shareDefaults;

            sut.shareDetails(expectedRequestData.shipmentId, sharingInfo, shareDefaults);
            $httpBackend.whenPOST(url).respond(200);
            $httpBackend.flush();

            shareObject.toAddresses = sharingInfo.toAddresses.split(',').map((item) => item.trim());

            expect($httpClone.post).toHaveBeenCalledWith(url, shareObject);
        });

        it('should log error when error happened', () => {
            $httpBackend.whenPOST(url).respond(400, 'some_error');
            const shareDetails = sut.shareDetails(expectedRequestData.shipmentId, sharingInfo, shareDefaults);

            shareDetails.catch(() => {
                expect(logService.error).toHaveBeenCalled();
            });
            $httpBackend.flush();
        });

        it('should return error when error happened', () => {
            $httpBackend.whenPOST(url).respond(400, ERROR);
            const shareDetails = sut.shareDetails(expectedRequestData.shipmentId, sharingInfo, shareDefaults);

            shareDetails.catch((err) => {
                expect(err).toBe(ERROR);
            });
            $httpBackend.flush();
        });

    });

});
