import ShipmentPrintService from './shipment-print-service';

import 'angularMocks';

describe('ShipmentPrintService', () => {
    let sut;
    let $httpBackend, $httpClone, $window;
    let logService;

    const expectedRequestData = {
        shipmentId: 'shipmentId'
    };

    beforeEach(inject(($http, $q, _$httpBackend_) => {
        $httpBackend = _$httpBackend_;

        logService = jasmine.createSpyObj('logService', ['error']);
        $httpClone = $http;
        spyOn($http, 'get').and.callThrough();
        $window = jasmine.createSpyObj('$window', ['open']);

        sut = new ShipmentPrintService($http, $q, $window, logService);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('#downloadWaybillPdf', () => {
        it('should call for $http.get with correct data', () => {
            sut.downloadWaybillPdf(expectedRequestData.shipmentId);
            expect($window.open).toHaveBeenCalledWith(`/api/shipment/${expectedRequestData.shipmentId}/label/pdf`);
        });
    });

    describe('#downloadReceiptPdf', () => {
        it('should call for $http.get with correct data', () => {
            sut.downloadReceiptPdf(expectedRequestData.shipmentId);
            expect($window.open).toHaveBeenCalledWith(`/api/shipment/${expectedRequestData.shipmentId}/receipt/pdf`);
        });
    });

    describe('#downloadInvoicePdf', () => {
        it('should call for $http.get with correct data', () => {
            sut.downloadInvoicePdf(expectedRequestData.shipmentId);
            expect($window.open).toHaveBeenCalledWith(`/api/shipment/${expectedRequestData.shipmentId}/invoice/pdf`);
        });
    });

    describe('#getTrackingNumber', () => {
        it('should call for $http.get with correct data', () => {
            sut.getTrackingNumber(expectedRequestData.shipmentId);
            $httpBackend.whenGET(`/api/shipment/${expectedRequestData.shipmentId}/trackingInfo`).respond(200);
            $httpBackend.flush();
            expect($httpClone.get).toHaveBeenCalledWith(`/api/shipment/${expectedRequestData.shipmentId}/trackingInfo`);
        });
    });

    describe('#getPickUpInfo', () => {
        // TODO: replace when real end-point will be available
        it('should return any promise', () => {
            const shipmentId = 'test';
            const pickupInfoPromise = sut.getPickUpInfo(shipmentId);

            expect(pickupInfoPromise).toEqual(jasmine.any(Object));
        });
    });

    describe('#getDocumentsForPrinting', () => {
        const url = `/api/shipment/${expectedRequestData.shipmentId}/print/documents`;

        it('should call for $http.get with correct data', () => {
            sut.getDocumentsForPrinting(expectedRequestData.shipmentId);
            $httpBackend.whenGET(url).respond(200);
            $httpBackend.flush();
            expect($httpClone.get).toHaveBeenCalledWith(url);
        });
        it('should respond with 404 error message', () => {
            $httpBackend.whenGET(url).respond(404);
            const documentsPromise = sut.getDocumentsForPrinting(expectedRequestData.shipmentId);

            documentsPromise.catch((response) => {
                expect(response).toEqual(jasmine.any(String));
            });
            $httpBackend.flush();
        });
        it('should respond with 422 error message', () => {
            $httpBackend.whenGET(url).respond(422);
            const documentsPromise = sut.getDocumentsForPrinting(expectedRequestData.shipmentId);

            documentsPromise.catch((response) => {
                expect(response).toEqual(jasmine.any(String));
            });
            $httpBackend.flush();
        });
        it('should respond with default error message', () => {
            $httpBackend.whenGET(url).respond(533);
            const documentsPromise = sut.getDocumentsForPrinting(expectedRequestData.shipmentId);

            documentsPromise.catch((response) => {
                expect(response).toEqual(jasmine.any(String));
            });
            $httpBackend.flush();
        });

    });

});
