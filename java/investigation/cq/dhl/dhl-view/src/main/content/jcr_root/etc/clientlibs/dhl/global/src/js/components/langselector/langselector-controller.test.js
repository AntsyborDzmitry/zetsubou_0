import LanguageController from './langselector-controller';
import LangselectorService from './langselector-service';
import NavigationService from './../../services/navigation-service';

describe('LanguageController', () => {
    let sut, defer;
    let $q, $timeout;
    let navigationService, langselectorService;

    const pagePath = 'some/page-path';
    const countryId = 'US';
    const langId = 'ENG';
    const languages = [{
        id: 'ENG'
    }, {
        id: 'UKR'
    }];

    beforeEach(inject((_$q_, _$timeout_) => {
        $q = _$q_;
        $timeout = _$timeout_;

        defer = $q.defer();

        navigationService = jasmine.mockComponent(new NavigationService());
        langselectorService = jasmine.mockComponent(new LangselectorService());

        navigationService.getCountryLang.and.returnValue({countryId, langId});
        navigationService.getPath.and.returnValue(pagePath);
        navigationService.changeLang.and.returnValue(defer.promise);
        langselectorService.loadAvailableLanguages.and.returnValue(defer.promise);

        sut = new LanguageController(navigationService, langselectorService);
    }));

    it('should use getCountryLang method from navigationService to get countryId and langId', () => {
        expect(navigationService.getCountryLang).toHaveBeenCalled();
    });

    it('should use getPath method from navigationService to ger page path', () => {
        expect(navigationService.getPath).toHaveBeenCalled();
    });

    it('should use loadAvailableLanguages method from langselectorService using received values', () => {
        expect(langselectorService.loadAvailableLanguages).toHaveBeenCalledWith(pagePath, countryId);
    });

    it('shoud set received available languages if request was success', () => {
        defer.resolve(languages);
        $timeout.flush();

        expect(sut.availableLangs).toEqual(languages);
    });

    it('should set current language from response', () => {
        defer.resolve(languages);
        $timeout.flush();

        expect(sut.currentLang.id).toEqual(langId);
    });

    describe('#langChanged', () => {
        beforeEach(() => {
            sut.currentLang = {id: 'UKR'};
            sut.langChanged();
        });

        it('should use changeLang method from navigationService if languages are not equal', () => {
            expect(navigationService.changeLang).toHaveBeenCalledWith('UKR');
        });

        it('should NOT use navigationService if current language is equal to language id', () => {
            navigationService.changeLang.calls.reset();
            sut.currentLang = {id: 'ENG'};
            sut.langChanged();

            expect(navigationService.changeLang).not.toHaveBeenCalled();
        });
    });
});
