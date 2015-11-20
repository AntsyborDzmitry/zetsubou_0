import PickupsController from './pickups-controller';
import NavigationService from './../../../services/navigation-service';

describe('EwfSearchController', () => {
    let sut, $q, $timeout, deferedGet, deferedSet;
    let profileShipmentServiceMock, navigationServiceMock, logServiceMock, $filter;

    beforeEach(inject((_$q_, _$timeout_, _$rootScope_, _$filter_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $filter = _$filter_;

        deferedGet = $q.defer();
        deferedSet = $q.defer();

        logServiceMock = jasmine.createSpyObj('logService', ['log', 'error']);
        profileShipmentServiceMock = jasmine.createSpyObj(
            'profileShipmentService',
            ['getPickupsData', 'savePickupsData']
        );
        profileShipmentServiceMock = jasmine.createSpyObj(
            'profileShipmentService',
            [
                'getPickupsData',
                'savePickupsData'
            ]);
        navigationServiceMock = jasmine.mockComponent(new NavigationService());

        profileShipmentServiceMock.getPickupsData.and.returnValue(deferedGet.promise);
        navigationServiceMock.getParamFromUrl.and.returnValue('section');
        profileShipmentServiceMock.savePickupsData.and.returnValue(deferedSet.promise);

        sut = new PickupsController(logServiceMock, $q, profileShipmentServiceMock, $filter, navigationServiceMock);
    }));

    it('should check that pickups section is initialized', () => {
        const mockData = {
            pickupDefaultType: 'NONE',
            pickupDetails: {
                pickupLocation: {
                    addressLine: 'address',
                    city: 'city',
                    zipOrPostCode: 'postCode'
                },
                pickupLocationType: 'NONE',
                instructions: '',
                pickupWindow: {
                    earliestTime: 0,
                    latestTime: 0
                }
            }
        };

        sut.init();
        deferedGet.resolve(mockData);
        $timeout.flush();

        expect(profileShipmentServiceMock.getPickupsData).toHaveBeenCalled();
        expect(sut.pickupSettings.pickupAddress).toBe('address, city, postCode');
    });

    it('should set pickupAddress as empty string if pickup location empty object', () => {
        const mockData = {
            pickupDefaultType: 'NONE',
            pickupDetails: {
                pickupLocation: {
                    addressLine: '',
                    city: '',
                    zipOrPostCode: ''
                },
                pickupLocationType: 'NONE',
                instructions: '',
                pickupWindow: {
                    earliestTime: 0,
                    latestTime: 0
                }
            }
        };

        sut.init();
        deferedGet.resolve(mockData);
        $timeout.flush();

        expect(profileShipmentServiceMock.getPickupsData).toHaveBeenCalled();
        expect(sut.pickupSettings.pickupAddress).toBe('');
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

    describe('#toggleTabIsEditing', () => {
        it('Should toggle tabIsEditing', () => {
            sut.tabIsEditing = false;
            sut.toggleTabIsEditing();
            expect(sut.tabIsEditing).toBe(true);
        });
    });
});
