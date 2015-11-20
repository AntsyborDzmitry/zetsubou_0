import RuleService from 'services/rule-service';
import LogService from 'services/log-service';
import NavigationService from './navigation-service';
import CountryCodeConverter from './temp-catalyst-country-code-converter';
import 'angularMocks';

describe('#RuleService', () => {

    let sut, getRequestDeferred, logServiceMock, navigationServiceMock, countryCodeConverterMock;
    let $http, $q, $timeout, $window;

    const groupName = 'testGroupName';
    const fieldName = 'test.setting.name';
    const otherFieldName = 'other.test.setting.name';
    const settingValue = 'testSettingValue';
    const rejectError = 'rejectError';
    const countryCodeUA = 'UA';
    const countryCodeUS = 'US';
    const successResponse = {
        status: 200,
        data: {}
    };

    successResponse.data[groupName] = [{
        field: fieldName,
        value: settingValue
    }];

    beforeEach(inject((_$q_, _$timeout_, _$window_) => {
        $q = _$q_;
        $timeout = _$timeout_;
        $window = _$window_;

        getRequestDeferred = $q.defer();

        $http = {
            get: jasmine.createSpy('get').and.returnValue(getRequestDeferred.promise)
        };

        navigationServiceMock = jasmine.mockComponent(new NavigationService($window));
        navigationServiceMock.getCountryLang.and.returnValue({countryId: countryCodeUS});
        logServiceMock = jasmine.mockComponent(new LogService($window));
        countryCodeConverterMock = jasmine.mockComponent(new CountryCodeConverter());
        countryCodeConverterMock.fromThreeLetterToCatalystFormat.and.returnValue(countryCodeUS);

        sut = new RuleService($http, $q, logServiceMock, navigationServiceMock, countryCodeConverterMock);
    }));

    it('should get group settings', () => {
        sut.acquireSetting(`${groupName}.${fieldName}`, countryCodeUA)
            .then((response) => {
                expect(response).toBe(settingValue);
                expect($http.get).toHaveBeenCalledWith(`/api/rules/${groupName}/${countryCodeUA}`);
                expect(logServiceMock.log).not.toHaveBeenCalled();
                expect(countryCodeConverterMock.fromThreeLetterToCatalystFormat).not.toHaveBeenCalled();
                expect(navigationServiceMock.getCountryLang).not.toHaveBeenCalled();
            });

        getRequestDeferred.resolve(successResponse);
        $timeout.flush();
    });

    it('should get group settings with current country', () => {
        sut.acquireSetting(`${groupName}.${fieldName}`)
            .then((response) => {
                expect(response).toBe(settingValue);
                expect($http.get).toHaveBeenCalledWith(`/api/rules/${groupName}/${countryCodeUS}`);
                expect(logServiceMock.log).not.toHaveBeenCalled();
                expect(countryCodeConverterMock.fromThreeLetterToCatalystFormat).toHaveBeenCalled();
                expect(navigationServiceMock.getCountryLang).toHaveBeenCalled();
            });

        getRequestDeferred.resolve(successResponse);
        $timeout.flush();
    });

    it('should not get group settings', () => {
        sut.acquireSetting(`${groupName}.${otherFieldName}`, countryCodeUA)
            .catch((error) => {
                const responseValue = `form ${groupName} loaded successfully, but no field ${otherFieldName}`;
                expect(error).toBe(responseValue);
                expect($http.get).toHaveBeenCalledWith(`/api/rules/${groupName}/${countryCodeUA}`);
                expect(logServiceMock.log).toHaveBeenCalledWith(responseValue);
                expect(countryCodeConverterMock.fromThreeLetterToCatalystFormat).not.toHaveBeenCalled();
                expect(navigationServiceMock.getCountryLang).not.toHaveBeenCalled();
            });

        getRequestDeferred.resolve(successResponse);
        $timeout.flush();
    });

    it('should reject call to endpoint', () => {
        sut.acquireSetting(`${groupName}.${fieldName}`, countryCodeUA)
            .catch((error) => {
                expect(error).toBe(rejectError);
                expect($http.get).toHaveBeenCalledWith(`/api/rules/${groupName}/${countryCodeUA}`);
                expect(logServiceMock.log).toHaveBeenCalledWith(rejectError);
                expect(countryCodeConverterMock.fromThreeLetterToCatalystFormat).not.toHaveBeenCalled();
                expect(navigationServiceMock.getCountryLang).not.toHaveBeenCalled();
            });

        getRequestDeferred.reject(rejectError);
        $timeout.flush();
    });
});
