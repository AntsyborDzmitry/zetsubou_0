import ShipmentPrintController from './shipment-print-controller';
import ShipmentPrintService from './shipment-print-service';
import NlsService from './../../../services/nls-service';
import 'angularMocks';

describe('ShipmentPrintController', () => {
    let $q;
    let sut;
    let $scope;
    let $window;
    let modalService;
    let nlsDefer;
    let logService;
    let nlsService;
    let pickUpInfoDefer;
    let navigationService;
    let trackingNumberDefer;
    let shipmentPrintService;
    let documentsDefer;

    const SHIPMENT_ID = 1;

    beforeEach(inject((_$q_, _$rootScope_, _$window_) => {
        $q = _$q_;
        $scope = _$rootScope_.$new();
        $window = _$window_;

        modalService = jasmine.createSpyObj('modalService', ['showDialog']);

        documentsDefer = $q.defer();
        trackingNumberDefer = $q.defer();
        pickUpInfoDefer = $q.defer();

        nlsDefer = $q.defer();

        navigationService = jasmine.createSpyObj('navigationService', ['getParamFromUrl']);
        logService = jasmine.createSpyObj('logService', ['log', 'error']);
        nlsService = jasmine.mockComponent(new NlsService());

        shipmentPrintService = jasmine.mockComponent(
            new ShipmentPrintService(null, null, $window, logService, nlsService)
        );

        navigationService.getParamFromUrl.and.returnValue(SHIPMENT_ID);

        shipmentPrintService.getDocumentsForPrinting.and.returnValue(documentsDefer.promise);
        shipmentPrintService.getTrackingNumber.and.returnValue(trackingNumberDefer.promise);
        shipmentPrintService.getPickUpInfo.and.returnValue(pickUpInfoDefer.promise);

        nlsService.getTranslation.and.returnValue(nlsDefer.promise);

        sut = new ShipmentPrintController(
            $scope,
            modalService,
            logService,
            shipmentPrintService,
            $window,
            $q,
            navigationService,
            nlsService
        );
    }));

    //TODO: add tests for printing
    describe('#previewDocument', () => {

        const doc = 'PDF BASE64';

        it('should set waybill document as previewed document, if called with waybill param', () => {
            sut.waybillDocument = doc;
            sut.previewDocument(sut.DOCUMENT_TYPES.WAYBILL);
            $scope.$apply();
            expect($scope.previewedDocument).toEqual(doc);
        });

        it('should set receipt document as previewed document, if called with receipt param', () => {
            sut.receiptDocument = doc;
            sut.previewDocument(sut.DOCUMENT_TYPES.RECEIPT);
            $scope.$apply();
            expect($scope.previewedDocument).toEqual(doc);
        });

        it('should set invoice document as previewed document, if called with invoice param', () => {
            sut.invoiceDocument = doc;
            sut.previewDocument(sut.DOCUMENT_TYPES.INVOICE);
            $scope.$apply();
            expect($scope.previewedDocument).toEqual(doc);
        });

        it('should open dialog', () => {
            sut.previewDocument(sut.DOCUMENT_TYPES.WAYBILL);
            $scope.$apply();
            expect(modalService.showDialog).toHaveBeenCalled();
        });

        it('should call for documents for printing', () => {
            expect(shipmentPrintService.getDocumentsForPrinting).toHaveBeenCalledWith(SHIPMENT_ID);
        });

        it('should show print button after documents is processed', () => {
            const response = {
                data: {
                    documents: [
                        {
                            documentType: sut.DOCUMENT_TYPES.WAYBILL,
                            pdfBase64: '=0123456789ABCDEF1011'
                        }
                    ]
                }
            };
            documentsDefer.resolve(response);
            $scope.$apply();

            expect(sut.documentsAssigned).toBe(true);
        });

        it('should call for Shipment Tracking number', () => {
            expect(shipmentPrintService.getTrackingNumber).toHaveBeenCalledWith(SHIPMENT_ID);
        });

        it('should store Shipment Tracking number', () => {
            const TRACKING_NUMBER = 12345;
            trackingNumberDefer.resolve(TRACKING_NUMBER);
            $scope.$apply();

            expect(sut.trackingNumber).toEqual(TRACKING_NUMBER);
        });

        it('should set error if can not get a tracking number', () => {
            trackingNumberDefer.reject();
            $scope.$apply();

            expect(sut.error).toEqual('errors.tracking_number_receive');
        });

        it('should call for Shipment Pickup Info', () => {
            expect(shipmentPrintService.getPickUpInfo).toHaveBeenCalledWith(SHIPMENT_ID);
        });

        it('should store Shipment Pickup Info', () => {
            const pickUp = {
                pickupDate: '12.03.2016',
                confirmationNumber: '48984984'
            };
            pickUpInfoDefer.resolve(pickUp);
            $scope.$apply();

            expect(sut.pickUpDate).toEqual(pickUp.pickupDate);
            expect(sut.pickUpNumber).toEqual(pickUp.confirmationNumber);
        });

    });

});
