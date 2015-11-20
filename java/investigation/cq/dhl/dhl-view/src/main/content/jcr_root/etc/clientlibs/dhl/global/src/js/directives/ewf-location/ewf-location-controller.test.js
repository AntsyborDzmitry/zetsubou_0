import EwfLocationController from './ewf-location-controller';
import LocationService from './../../services/location-service';
import NavigationService from './../../services/navigation-service';
import 'angularMocks';

describe('#EwfLocationController', () => {

    let sut, getRequestDeferred, locationService, navigationService;
    let $q, $timeout;

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        getRequestDeferred = $q.defer();

        locationService = jasmine.mockComponent(new LocationService());
        locationService.loadAvailableLocations.and.returnValue(getRequestDeferred.promise);

        navigationService = jasmine.mockComponent(new NavigationService());

        sut = new EwfLocationController(locationService, navigationService);
    }));

    it('should initialize controller\'s availableLocations property', () => {
        const successResponse = {
            testProperty: 'testString'
        };

        getRequestDeferred.resolve(successResponse);
        $timeout.flush();

        expect(sut.availableLocations).toBe(successResponse);
        expect(locationService.loadAvailableLocations).toHaveBeenCalled();
    });

    describe('#logInAnotherCountry', () => {
        it('should send browser to login in requested country', () => {
            sut.logInAnotherCountry('deu');
            expect(navigationService.redirectToLoginWithCountryId).toHaveBeenCalledWith('deu');
        });
    });
});
