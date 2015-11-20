import WantToShareController from './want-to-share-controller';
import WantToShareService from './want-to-share-service';
import ModalService from './../../../../services/modal/modal-service';
import NavigationService from './../../../../services/navigation-service';
import 'angularMocks';

describe('WantToShareController', () => {

    let sut;
    let $scope;
    let $q;
    let $timeout;
    let modalService;
    let navigationService;
    let wantToShareService;
    let shareDefaultsDefer;

    const defaultsObject = {
        trackingNumber: false,
        label: false,
        pickupConfirmationNumber: false,
        receipt: false,
        customsInvoice: false
    };

    const receivedDefaultsObject = {
        trackingNumber: false,
        label: true,
        pickupConfirmationNumber: false,
        receipt: true,
        customsInvoice: false
    };

    const SHIPMENT_ID = 'shipmentId';

    beforeEach(inject(($http, _$q_, _$timeout_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        $scope = _$rootScope_.$new();

        shareDefaultsDefer = $q.defer();

        modalService = jasmine.mockComponent(new ModalService());

        navigationService = jasmine.mockComponent(new NavigationService());
        navigationService.getParamFromUrl.and.returnValue(SHIPMENT_ID);

        wantToShareService = jasmine.mockComponent(new WantToShareService());
        wantToShareService.getShipmentShareDefaults.and.returnValue(shareDefaultsDefer.promise);
        wantToShareService.shareDetails.and.returnValue(shareDefaultsDefer.promise);

        sut = new WantToShareController($scope, modalService, navigationService, wantToShareService);
    }));

    describe('Constructor', () => {

        it('should have default share options', () => {
            expect(sut.shareDefaults).toEqual(defaultsObject);
        });

        it('should get shipmentId', () => {
            expect(navigationService.getParamFromUrl).toHaveBeenCalledWith(SHIPMENT_ID);
        });

        it('should get default share options', () => {
            expect(wantToShareService.getShipmentShareDefaults).toHaveBeenCalledWith(SHIPMENT_ID);
        });

        it('should store defaults', () => {
            shareDefaultsDefer.resolve(receivedDefaultsObject);
            $timeout.flush();
            expect(sut.shareDefaults).toEqual(receivedDefaultsObject);
        });

    });

    describe('#openShareDialog', () => {
        it('should get sharing info to show in dialog', () => {
            wantToShareService.getShareFields.and.returnValue($q.when());

            sut.openShareDialog();

            expect(wantToShareService.getShareFields).toHaveBeenCalledWith(SHIPMENT_ID);
        });

        it('should fill share details fields with received info', () => {
            const initialSharingInfo = {
                toAddresses: ['a@t.com', 'b@u.com'],
                fromAddress: 'default@dhl.com',
                subject: '',
                message: '',
                details: {
                    trackingNumber: 12345,
                    pickupConfirmationNumber: 12345
                }
            };
            const expectedSharingInfo = {
                toAddresses: 'a@t.com, b@u.com',
                fromAddress: 'default@dhl.com',
                subject: '',
                message: '',
                details: {
                    trackingNumber: 12345,
                    pickupConfirmationNumber: 12345
                }
            };

            wantToShareService.getShareFields.and.returnValue($q.when(initialSharingInfo));

            sut.openShareDialog();
            $scope.$apply();

            expect(sut.sharingInfo).toEqual(expectedSharingInfo);
        });

        it('should handle empty sharing info', () => {
            wantToShareService.getShareFields.and.returnValue($q.when({}));

            sut.openShareDialog();
            $scope.$apply();

            expect(sut.sharingInfo).toEqual({});
        });

        it('should show dialog', () => {
            wantToShareService.getShareFields.and.returnValue($q.when({}));

            sut.openShareDialog();
            $scope.$apply();

            expect(modalService.showDialog).toHaveBeenCalledWith({
                closeOnEsc: true,
                scope: $scope,
                template: jasmine.any(String)
            });
        });
    });

    describe('#shareDetails', () => {
        it('should call the service with required by contract data', () => {
            sut.shareDetails();
            expect(wantToShareService.shareDetails)
                .toHaveBeenCalledWith(SHIPMENT_ID, sut.sharingInfo, sut.shareDefaults);
        });
    });

});
