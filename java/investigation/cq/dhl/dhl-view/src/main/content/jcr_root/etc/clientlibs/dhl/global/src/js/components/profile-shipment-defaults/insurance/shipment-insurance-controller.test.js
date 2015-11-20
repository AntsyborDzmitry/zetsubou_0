import InsuranceController from './shipment-insurance-controller';
import ProfileShipmentService from './../services/profile-shipment-service';
import NavigationService from './../../../services/navigation-service';
import 'angularMocks';

describe('InsuranceController', () => {
    let sut, $q, $timeout, $scope, deferedGet;
    let logServiceMock, profileShipmentServiceMock, navigationServiceMock;

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $scope = _$rootScope_.$new();
        deferedGet = $q.defer();

        profileShipmentServiceMock = jasmine.mockComponent(new ProfileShipmentService());
        navigationServiceMock = jasmine.mockComponent(new NavigationService());

        profileShipmentServiceMock.getShipmentInsurance.and.returnValue(deferedGet.promise);
        profileShipmentServiceMock.updateShipmentInsurance.and.returnValue(deferedGet.promise);
        navigationServiceMock.getParamFromUrl.and.returnValue('section');
        logServiceMock = jasmine.createSpyObj('logService', ['log', 'error']);

        sut = new InsuranceController($scope, $q, profileShipmentServiceMock, logServiceMock, navigationServiceMock);
    }));

    it('should check if service is called', () => {
            const successResponse = {
            status: 200,
            insureShipments: false,
            insureShipmentType: 0,
            insuranceValue: 10,
            insuranceCurrency: 'EUR'
        };

        deferedGet.resolve(successResponse);
        $timeout.flush();

        expect(profileShipmentServiceMock.getShipmentInsurance).toHaveBeenCalled();
        expect(sut.insureShipments).toBe(successResponse.insureShipments);
        expect(sut.insureShipmentType).toBe(successResponse.insureShipmentType);
        expect(sut.insuranceValue).toBe(successResponse.insuranceValue);
        expect(sut.insuranceCurrency).toBe(successResponse.insuranceCurrency);

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
        expect(profileShipmentServiceMock.getShipmentInsurance).toHaveBeenCalled();
    });

    it('should check if insurance data updated', () => {
        const successResponse = {
            status: 200,
            insureShipments: false,
            insureShipmentType: 0,
            insuranceValue: 10,
            insuranceCurrency: 'EUR'
        };
        sut.isEditing = true;

        sut.updateShipmentInsurance();

        deferedGet.resolve(successResponse);
        $timeout.flush();
        expect(profileShipmentServiceMock.updateShipmentInsurance).toHaveBeenCalled();

        expect(sut.insuranceResponse).toBe(successResponse);
        expect(sut.isEditing).toBe(false);
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
