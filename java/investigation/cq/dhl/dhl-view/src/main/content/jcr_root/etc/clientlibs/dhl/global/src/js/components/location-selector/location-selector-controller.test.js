/**
 * Test suit for location selector component
 */
import LocationSelectorController from './location-selector-controller';
import 'angularMocks';

describe('LocationSelectorController', () => {
    let sut, locationService, storageMock, navigationService, logService, nlsService;

    function initSut() {
        sut = new LocationSelectorController(logService, navigationService, nlsService, locationService);
    }

    beforeEach(() => {
        locationService = jasmine.createSpyObj(
            'locationService',
            ['loadAvailableLocations', 'getCountry', 'getStoredCountry']
        );
        const promiseMockLocation = jasmine.createSpyObj('promise', ['then', 'catch']);
        const promiseMockLocation2 = jasmine.createSpyObj('promise', ['then', 'catch']);
        promiseMockLocation.then.and.returnValue(promiseMockLocation2);
        locationService.loadAvailableLocations.and.returnValue(promiseMockLocation);
        locationService.getStoredCountry.and.returnValue('ukr');

        navigationService = jasmine.createSpyObj('navigationService', ['redirectToLoginWithCountryId']);

        nlsService = jasmine.createSpyObj('nlsService', ['getDictionary']);
        const promiseMockNls = jasmine.createSpyObj('promise', ['then', 'catch']);
        const promiseMockNls2 = jasmine.createSpyObj('promise', ['then', 'catch']);
        promiseMockNls.then.and.returnValue(promiseMockNls2);
        nlsService.getDictionary.and.returnValue(promiseMockNls);

        storageMock = (function() {
            const storage = {};
            return {
                set: function(key, value) {
                    storage[key] = value || '';
                },
                get: function(key) {
                    return storage[key];
                }};
        }());
        logService = jasmine.createSpyObj('logService', ['error']);
    });

    describe('#constructor', () => {
        const country = {
            code3: 'ukr',
            name: 'Ukraine'
        };

        it('should not redirect to login page if location wasn`t remembered before', () => {
            locationService.getCountry.and.returnValue(null);

            initSut();

            expect(navigationService.redirectToLoginWithCountryId).not.toHaveBeenCalled();
        });

        it('remember should be true by default', () => {
            initSut();
            expect(sut.rememberLocation).toEqual(true);
        });

        it('should get saved location from localStorage', () => {
            storageMock.set('defaultCountry', country.code3);
            initSut();
            expect(storageMock.get('defaultCountry')).toEqual(country.code3);
        });

        it('should load available locations on init', () => {
            initSut();
            expect(locationService.loadAvailableLocations).toHaveBeenCalled();
        });
    });
});
