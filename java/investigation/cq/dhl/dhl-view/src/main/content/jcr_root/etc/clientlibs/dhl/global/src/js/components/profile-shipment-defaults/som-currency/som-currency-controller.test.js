import SomCurrencyController from './som-currency-controller';
import ProfileShipmentService from './../services/profile-shipment-service';
import NavigationService from './../../../services/navigation-service';
import 'angularMocks';
import angular from 'angular';

describe('SomCurrencyController', () => {
    let sut;
    let $q;
    let $timeout;
    let profileShipmentServiceMock;
    let navigationServiceMock;
    let serviceDeferred;
    const serviceResponse = {
        name: 'some mock response'
    };

    const SOM_CURRENCY_URL_PARAMETER = 'somCurrency';

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        serviceDeferred = $q.defer();

        navigationServiceMock = jasmine.mockComponent(new NavigationService());
        profileShipmentServiceMock = jasmine.mockComponent(new ProfileShipmentService());
        profileShipmentServiceMock.getDefaultSomAndCurrency.and.returnValue(serviceDeferred.promise);
        profileShipmentServiceMock.updateDefaultSomAndCurrency.and.returnValue(serviceDeferred.promise);

        sut = new SomCurrencyController(profileShipmentServiceMock, navigationServiceMock);
    }));

    describe('#preloadDefaultSomAndCurrency', () => {
        it('should load default som and currency using service', () => {
            sut.preloadDefaultSomAndCurrency();
            expect(profileShipmentServiceMock.getDefaultSomAndCurrency).toHaveBeenCalled();
        });

        it('should save returned som and currency to "defaultSomAndCurrency"', () => {
            sut.preloadDefaultSomAndCurrency();
            serviceDeferred.resolve(serviceResponse);
            $timeout.flush();
            expect(sut.defaultSomAndCurrency).toBe(serviceResponse);
        });
    });

    describe('#updateDefaultSomAndCurrency', () => {
        beforeEach(() => {
            sut.defaultSomAndCurrency = {
                som: 'imperial',
                somList: [{}, {}],
                defaultCurrency: 'UAH',
                defaultCurrencyList: [],
                defaultInsuranceCurrency: 'GBP',
                defaultInsuranceCurrencyList: []
            };
        });

        it('should update default som and currency defaults using service', () => {
            const expectedServerUpdateData = {
                som: sut.defaultSomAndCurrency.som,
                defaultCurrency: sut.defaultSomAndCurrency.defaultCurrency,
                defaultInsuranceCurrency: sut.defaultSomAndCurrency.defaultInsuranceCurrency
            };
            sut.updateDefaultSomAndCurrency();
            expect(profileShipmentServiceMock.updateDefaultSomAndCurrency)
                .toHaveBeenCalledWith(expectedServerUpdateData);
        });

        it('should on success update clear serverErrorMessage', () => {
            sut.serverErrorMessage = 'some_error_message';
            sut.updateDefaultSomAndCurrency();
            serviceDeferred.resolve({});
            $timeout.flush();

            expect(sut.serverErrorMessage).toBe('');
        });

        it('should on success update set isEditing to false', () => {
            sut.isEditing = true;
            sut.updateDefaultSomAndCurrency();
            serviceDeferred.resolve({});
            $timeout.flush();

            expect(sut.isEditing).toBe(false);
        });

        it('should on error store it to serverErrorMessage', () => {
            const errorResponseData = {
                message: 'some_error_message'
            };
            sut.serverErrorMessage = '';
            sut.updateDefaultSomAndCurrency();
            serviceDeferred.reject(errorResponseData);
            $timeout.flush();

            expect(sut.serverErrorMessage).toBe(errorResponseData.message);
        });
    });

    describe('#isSomList', () => {
        it('should return false if no "somList" in server response', () => {
            sut.defaultSomAndCurrency = {
                som: 'standard'
            };
            expect(sut.isSomList()).toBe(false);
        });

        it('should return true if there is "somList" in server response', () => {
            sut.defaultSomAndCurrency = {
                som: 'standard',
                somList: [{key: 'som_standard'}]
            };
            expect(sut.isSomList()).toBe(true);
        });

    });

    describe('#toggleLayout', () => {
        it('should reset SoM and Currency to initial defaults if closing editing mode', () => {
            const defaultSomCurrency = {name: 'some default SoM and Currency Data'};

            serviceDeferred.resolve(angular.copy(defaultSomCurrency));
            sut.preloadDefaultSomAndCurrency();
            $timeout.flush();

            sut.defaultSomAndCurrency.uom = 'standard';
            sut.defaultSomAndCurrency.defaultInsuranceCurrency = 'USD';

            sut.isEditing = true;
            sut.toggleLayout();

            expect(sut.defaultSomAndCurrency).toEqual(defaultSomCurrency);
        });

        it('should toggle isEditing flag with toggleLayout function', () => {
            sut.isEditing = true;
            sut.toggleLayout();
            expect(sut.isEditing).toBe(false);
            sut.toggleLayout();
            expect(sut.isEditing).toBe(true);
        });

        it('should clear serverErrorMessage on toggle', () => {
            sut.serverErrorMessage = 'some error message';
            sut.toggleLayout();
            expect(sut.serverErrorMessage).toBe('');
        });
    });

    it('should show section', () => {
        navigationServiceMock.getParamFromUrl.and.returnValue(SOM_CURRENCY_URL_PARAMETER);
        sut = new SomCurrencyController(profileShipmentServiceMock, navigationServiceMock);
        sut.isEditing = false;
        sut.preloadSectionFromUrl();
        expect(sut.isEditing).toEqual(true);
    });

    it('should hide section', () => {
        navigationServiceMock.getParamFromUrl.and.returnValue('otherTab');
        sut = new SomCurrencyController(profileShipmentServiceMock, navigationServiceMock);
        sut.isEditing = true;
        sut.preloadSectionFromUrl();
        expect(sut.isEditing).toEqual(false);
    });
});
