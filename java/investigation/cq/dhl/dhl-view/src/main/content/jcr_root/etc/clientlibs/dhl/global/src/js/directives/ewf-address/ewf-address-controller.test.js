import EwfAddressController from './ewf-address-controller';
import EwfAddressService from './ewf-address-service';
import LocationService from './../../services/location-service';
import EwfSpinnerService from './../../services/ewf-spinner-service';

describe('EwfAddressController', () => {
    let sut;
    let mockEwfAddressService;
    let mockLocationService;
    let mockLocationServiceDefferred;
    let mockCountries;
    let ewfSpinnerServiceMock;
    let $scope;
    let $q;
    let $timeout;

    beforeEach(inject((_$q_, _$rootScope_, _$timeout_) => {
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;
        $q = _$q_;
        const mockAttrService = {
            track: () => {}
        };

        mockCountries = [
            {value: 'US', name: 'USA'},
            {value: 'UA', name: 'Ukraine'},
            {value: 'PL', name: 'Poland'},
            {value: 'DE', name: 'Germany'}
        ];

        mockLocationServiceDefferred = $q.defer();

        ewfSpinnerServiceMock = jasmine.mockComponent(new EwfSpinnerService());
        mockEwfAddressService = jasmine.mockComponent(new EwfAddressService());
        mockLocationService = jasmine.mockComponent(new LocationService());
        mockLocationService.loadAvailableLocations.and.returnValue(mockLocationServiceDefferred.promise);

        sut = new EwfAddressController($scope,
            {},
            mockAttrService,
            mockEwfAddressService,
            mockLocationService,
            ewfSpinnerServiceMock
        );

        sut.attributes.address = {
            addressDetails: {
                countryCode: 'US'
            }
        };

        $scope.$apply();
    }));

    describe('On controller initiation', () => {
        beforeEach(() => {
            sut.init();
        });

        it('should call to server for countries data', () => {
            mockLocationServiceDefferred.resolve();
            expect(mockLocationService.loadAvailableLocations).toHaveBeenCalled();
        });

        it('should retrieve countries data', () => {
            mockLocationServiceDefferred.resolve(mockCountries);
            $scope.$apply();
            expect(sut.attributes.address.countries).toEqual(mockCountries);
        });

        it('should create an empty object for address if it was not created before', () => {
            delete sut.attributes.address;
            mockLocationServiceDefferred.resolve(mockCountries);
            $scope.$apply();
            expect(sut.attributes.address.countries).toEqual(mockCountries);
        });
    });

    describe('shipment address defaults on init', () => {
        const defaults = {
            residentialDefault: true
        };

        beforeEach(() => {
            mockEwfAddressService.getShipmentAddressDefaults.and.returnValue($q.when(defaults));
        });

        it('should load shipment address defaults if it is needed', () => {
            sut.init({
                setResidentialFlagFromProfile: true
            });

            $scope.$apply();

            expect(mockEwfAddressService.getShipmentAddressDefaults).toHaveBeenCalledWith();
            expect(sut.attributes.defaults.residentialDefault).toEqual(defaults.residentialDefault);
        });

        it('should not load shipment address defaults if it is not needed', () => {
            sut.init({
                setResidentialFlagFromProfile: false
            });

            expect(mockEwfAddressService.getShipmentAddressDefaults).not.toHaveBeenCalled();
        });
    });

    describe('#getAddresses', () => {
        it('should get addresses by query string', () => {
            const query = 'some address query';
            const countryCode = sut.attributes.address.addressDetails.countryCode;

            mockLocationServiceDefferred.resolve(mockCountries);
            $scope.$apply();

            sut.getAddresses(query);
            expect(mockEwfAddressService.getAddresses).toHaveBeenCalledWith(countryCode, query);
        });

        it('should take country from scope if attributes is not set', () => {
            sut.attributes.address = {};
            $scope.address = {
                countryCode: 'US'
            };
            const query = 'some address query';
            const countryCode = $scope.address.countryCode;

            mockLocationServiceDefferred.resolve(mockCountries);
            $scope.$apply();

            sut.getAddresses(query);
            expect(mockEwfAddressService.getAddresses).toHaveBeenCalledWith(countryCode, query);
        });
    });

    describe('#getZipCodes', () => {
        it('should get addresses by query string', () => {
            const query = 'some zipCode query';
            const countryCode = sut.attributes.address.addressDetails.countryCode;

            mockLocationServiceDefferred.resolve(mockCountries);
            $scope.$apply();

            sut.getZipCodes(query);
            expect(mockEwfAddressService.addressSearchByZipCode).toHaveBeenCalledWith(countryCode, query);
        });
    });

    describe('#getCities', () => {
        it('should get addresses by query string', () => {
            const query = 'some city query';
            const countryCode = sut.attributes.address.addressDetails.countryCode;

            mockLocationServiceDefferred.resolve(mockCountries);
            $scope.$apply();

            sut.getCities(query);
            expect(mockEwfAddressService.addressSearchByCity).toHaveBeenCalledWith(countryCode, query);
        });
    });

    describe('#addressSelected', () => {
        it('should set address details when address have been selected', () => {
            const address = {
                fullAddress: 'some full address',
                data: {
                    city: 'some city',
                    zip: '12345',
                    district: 'some district'
                }
            };

            const expectedObject = {
                addrLine1: address.fullAddress,
                city: address.data.city,
                zipOrPostCode: address.data.zip,
                stateOrProvince: address.data.district,
                countryCode: sut.attributes.address.addressDetails.countryCode
            };

            sut.addressSelected(address);

            expect(sut.attributes.address.addressDetails).toEqual(expectedObject);
        });
    });

    describe('#nicknameGenerator', () => {
        it('should generate nick name from username and company', () => {
            const username = 'some username';
            const company = 'some company';
            sut.attributes.address.name = username;
            sut.attributes.address.company = company;

            sut.nicknameGenerator();

            expect(sut.attributes.address.nickname).toEqual(`${username} at ${company}`);
        });

        it('should generate nick name from company when username is empty', () => {
            const username = '';
            const company = 'some company';
            sut.attributes.address.company = company;

            sut.nicknameGenerator();

            expect(sut.attributes.address.nickname).toEqual(`${username} at ${company}`);
        });

        it('should generate nick name from username when company is empty', () => {
            const username = 'some username';
            const company = '';
            sut.attributes.address.name = username;

            sut.nicknameGenerator();

            expect(sut.attributes.address.nickname).toEqual(`${username} at ${company}`);
        });
    });

    describe('#zipCodeOrCitySelected', () => {
        it('should set address details when zip code have been selected', () => {
            const address = {
                city: 'some city',
                stateName: 'some state',
                postalCode: '12345'
            };

            const expectedObject = {
                city: address.city,
                zipOrPostCode: address.postalCode,
                stateOrProvince: address.stateName,
                countryCode: sut.attributes.address.addressDetails.countryCode
            };

            sut.zipCodeOrCitySelected(address);

            expect(sut.attributes.address.addressDetails).toEqual(expectedObject);
        });
    });

    describe('#onCountrySelect', () => {
        it('should update ewfForm rules according to new country code', () => {
            const ewfFormCtrl = jasmine.createSpyObj('ewfFormCtrl', ['reloadRules']);
            const name = 'United States';
            const code2 = 'US';

            sut.onCountrySelect({name, code2}, ewfFormCtrl);

            expect(ewfFormCtrl.reloadRules).toHaveBeenCalledWith(code2);
        });
    });

    describe('#getCountry', () => {
        it('should call for spinner service on country call', () => {
            sut.init();
            mockLocationServiceDefferred.resolve(mockCountries);
            $timeout.flush();
            expect(ewfSpinnerServiceMock.applySpinner).toHaveBeenCalled();
        });
    });

    describe('#isResidentialFlagVisible', () => {
        it('should return true when there is no need in hiding logic', () => {
            sut.attributes.settings = {
                setResidentialFlagFromProfile: false
            };
            expect(sut.isResidentialFlagVisible()).toBe(true);
        });

        it('should return true if country is selected', () => {
            sut.attributes = {
                settings: {
                    setResidentialFlagFromProfile: true
                },
                address: {
                    addressDetails: {
                        countryCode: 'UA'
                    }
                }
            };
            expect(sut.isResidentialFlagVisible()).toBe(true);
        });

        it('should return false if country is not selected', () => {
            sut.attributes = {
                settings: {
                    setResidentialFlagFromProfile: true
                },
                address: {
                    addressDetails: {}
                }
            };
            expect(sut.isResidentialFlagVisible()).toBe(false);
        });
    });
});
