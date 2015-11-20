import ProfileSettingsDefaultController from './profile-shipment-default-controller';
import 'angularMocks';

describe('ProfileSettingsDefaultController', () => {
    let sut;
    let navigationService;

    beforeEach(() => {
        navigationService = jasmine.createSpyObj('navigationService', ['getParamFromUrl']);
        sut = new ProfileSettingsDefaultController(navigationService);
    });

    describe('#constructor', () => {
        it('should set default to manageShipment', () => {
            expect(sut.currentTab).toBe('manageShipment');
        });
    });

    describe('#preloadTabFromUrl', () => {
        it('should load Url  data with service', () => {
            sut.preloadTabFromUrl();
            expect(navigationService.getParamFromUrl).toHaveBeenCalledWith('tab');
        });
    });
});
