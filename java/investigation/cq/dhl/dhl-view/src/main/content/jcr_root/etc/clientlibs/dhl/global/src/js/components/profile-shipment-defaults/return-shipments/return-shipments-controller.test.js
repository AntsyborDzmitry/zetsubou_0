import returnShipmentsController from './return-shipments-controller';
import ProfileShipmentService from './../services/profile-shipment-service';
import NavigationService from './../../../services/navigation-service';
import 'angularMocks';

describe('returnShipmentsController', () => {
    let sut, $q, $timeout, $scope, deferedGet;
    let logServiceMock, profileShipmentServiceMock, navigationServiceMock;

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $scope = _$rootScope_.$new();
        deferedGet = $q.defer();

        profileShipmentServiceMock = jasmine.mockComponent(new ProfileShipmentService());

        profileShipmentServiceMock.getReturnShipments.and.returnValue(deferedGet.promise);
        profileShipmentServiceMock.updateReturnShipments.and.returnValue(deferedGet.promise);
        navigationServiceMock = jasmine.mockComponent(new NavigationService());
        logServiceMock = jasmine.createSpyObj('logService', ['log', 'error']);

        navigationServiceMock.getParamFromUrl.and.returnValue('section');

        sut = new returnShipmentsController(
            $scope,
            $q,
            profileShipmentServiceMock,
            logServiceMock,
            navigationServiceMock);
    }));

    it('should check if service is called', () => {
        const successResponse = {
            status: 200,
            returnLabelType: 2,
            returnLabelSendType: 0,
            instructions: 'Go left and then forward. Ask John.'
        };

        deferedGet.resolve(successResponse);
        $timeout.flush();

        expect(profileShipmentServiceMock.getReturnShipments).toHaveBeenCalled();

        expect(sut.returnLabelType).toBe(successResponse.returnLabelType);
        expect(sut.returnLabelSendType).toBe(successResponse.returnLabelSendType);
        expect(sut.instructions).toBe(successResponse.instructions);
    });

    it('should display error if service failed', () => {
        const rejectResponse = {
            status: 500,
            data: {
                message: 'fail'
            }
        };
        deferedGet.reject(rejectResponse);
        $timeout.flush();
        expect(profileShipmentServiceMock.getReturnShipments).toHaveBeenCalled();
    });

    it('should check if shipment data updated', () => {
        const successResponse = {
            status: 200,
            returnLabelType: 2,
            returnLabelSendType: 0,
            instructions: 'Go left and then forward. Ask John.'
        };

        sut.updateReturnShipments();

        deferedGet.resolve(successResponse);
        $timeout.flush();
        expect(profileShipmentServiceMock.updateReturnShipments).toHaveBeenCalled();

        expect(sut.returnShipmentsResponse).toBe(successResponse);
    });

    describe('#toggleLayout', () => {
        it('Should toggle isEditing flag with toggleLayout function', () => {
            sut.isEditing = true;
            sut.toggleLayout();
            expect(sut.isEditing).toBe(false);
            sut.toggleLayout();
            expect(sut.isEditing).toBe(true);
        });
    });

    describe('#preloadSectionFromUrl', () => {
        it('should load data from url', () => {
            sut.preloadSectionFromUrl();
            expect(navigationServiceMock.getParamFromUrl).toHaveBeenCalled();
        });
    });

    describe('#toggleLayout', () => {
        it('Should toggle isEditing flag with toggleLayout function', () => {
            sut.isEditing = false;
            sut.toggleLayout();
            expect(sut.isEditing).toBe(true);
        });
    });
});
