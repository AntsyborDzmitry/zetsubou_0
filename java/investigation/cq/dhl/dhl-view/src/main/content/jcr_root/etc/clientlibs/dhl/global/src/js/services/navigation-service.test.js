import NavigationService from './navigation-service';

describe('navigationService', () => {
    const COUNTRY_ID = 'ukr';
    const LANG_ID = 'en';

    let sut;
    let $window;

    function makeLoginUrl(countryId, langId) {
        return 'http://localhost:4502/content/dhl/' + countryId + '/' + langId + '/auth/login.html';
    }

    beforeEach(() => {
        $window = {
            location: {
                href: makeLoginUrl(COUNTRY_ID, LANG_ID),
                protocol: 'http:',
                hostname: 'localhost'
            }
        };
        sut = new NavigationService($window);
    });

    describe('#getCountryLang', () => {
        let urlParts;

        beforeEach(() => {
            urlParts = sut.getCountryLang();
        });

        it('returns correct country code', () => {
            expect(urlParts.countryId).toBe(COUNTRY_ID);
        });

        it('returns correct country lang', () => {
            expect(urlParts.langId).toBe(LANG_ID);
        });
    });

    describe('#changeLang', () => {
        it('changes lang in url', () => {
            const NEW_LANG = 'ar';

            sut.changeLang(NEW_LANG);
            const urlParts = sut.getCountryLang();
            expect(urlParts.langId).toBe(NEW_LANG);
        });
    });

    describe('#changeCountry', () => {
        it('should send browser to the same page in requested country', () => {
            sut.changeCountry('deu');
            expect($window.location.href).toEqual(makeLoginUrl('deu', 'en'));
        });

        it('should show alert when trying to redirect to an unimplemented country (Japan)' +
            ' and redirect to USA instead', () => {
            $window.alert = jasmine.createSpy('alert');

            sut.changeCountry('jpn');

            expect($window.alert)
                .toHaveBeenCalledWith('Only USA and Germany are available for now. Redirecting to USA.');
            expect($window.location.href).toEqual(makeLoginUrl('usa', 'en'));
        });
    });

    describe('#redirectToLogin', () => {
        it('should redirect to login page', () => {
            spyOn(sut, 'location');
            sut.redirectToLogin();
            expect(sut.location).toHaveBeenCalledWith(sut.paths.LOGIN_PAGE);
        });
    });

    describe('#redirectToLoginWithCountryId', () => {
        it('should redirect to login page in another country (Germany)', () => {
            sut.redirectToLoginWithCountryId('deu');
            expect($window.location.href).toEqual(makeLoginUrl('deu', 'en'));
        });

        it('should show alert when trying to redirect to login page in an unimplemented country (Japan)' +
            ' and redirect to USA instead', () => {
            $window.alert = jasmine.createSpy('alert');

            sut.redirectToLoginWithCountryId('jpn');

            expect($window.alert)
                .toHaveBeenCalledWith('Only USA and Germany are available for now. Redirecting to USA.');
            expect($window.location.href).toEqual(makeLoginUrl('usa', 'en'));
        });
    });

    describe('#getOriginFromUrl', () => {
        it('should NOT return location origin with port if port is NOT specified', () => {
            const origin = sut.getOriginFromUrl();
            expect(origin).toEqual($window.location.protocol + '//' + $window.location.hostname);
        });

        it('should return location origin with port if port specified', () => {
            $window.location.port = '8080';
            const origin = sut.getOriginFromUrl();
            const expected = $window.location.protocol + '//' + $window.location.hostname + ':' + $window.location.port;
            expect(origin).toEqual(expected);
        });

        it('should return location origin if $window.location.origin exists', () => {
            $window.location.origin = 'http://localhost:8080';
            const origin = sut.getOriginFromUrl();
            expect(origin).toEqual($window.location.origin);
        });
    });

    describe('#redirect', () => {
        it('writes path to $window.location', () => {
            const url = 'http://google.com';
            sut.redirect(url);

            expect($window.location).toEqual(url);
        });
    });
});
