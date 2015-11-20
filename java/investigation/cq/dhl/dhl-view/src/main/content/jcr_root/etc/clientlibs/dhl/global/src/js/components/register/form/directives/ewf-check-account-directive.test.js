import EwfCheckAccount from './ewf-check-account-directive';

describe('EwfCheckAccount', () => {
    let $http;

    let navigationService;
    let countryCodeConverter;

    let countryId;
    let countryCode;

    beforeEach(inject((_$http_) => {
        $http = _$http_;

        countryId = 'some country id';
        countryCode = 'some country code';

        navigationService = {
            getCountryLang: jasmine.createSpy('getCountryLang').and.returnValue({
                countryId
            })
        };

        countryCodeConverter = {
            fromThreeLetterToCatalystFormat:
                jasmine.createSpy('fromThreeLetterToCatalystFormat').and.returnValue(countryCode)
        };
    }));

    describe('#link', () => {
        it('should bind "input" event to element', () => {
            const sut = new EwfCheckAccount($http, navigationService, countryCodeConverter);

            const element = {
                bind: jasmine.createSpy('bind')
            };

            sut.link(null, element);

            expect(element.bind).toHaveBeenCalledWith('input', jasmine.any(Function));
        });
    });
});
