import ewf from 'ewf';

ewf.service('navigationService', NavigationService);

NavigationService.$inject = ['$window'];

/**
 * Navigation Service. Need to work with URL params and for navigation
 *
 * @param {angular.$window} $window
 */
export default function NavigationService($window) {
    this.getCountryLang = getCountryLang;
    this.redirect = redirect;
    this.location = location;
    this.changeLang = changeLang;
    this.getPath = getPath;
    this.changeCountry = changeCountry;
    this.redirectToLoginWithCountryId = redirectToLoginWithCountryId;
    this.getParamFromUrl = getParamFromUrl;
    this.redirectToLogin = redirectToLogin;
    this.getOriginFromUrl = getOriginFromUrl;

    const PATHS = {
        LOGIN_PAGE: 'auth/login.html'
    };
    this.paths = Object.assign({}, PATHS);

    function getCountryLang() {
        const url = $window.location.href;
        const urlParts = /content\/dhl\/(\w{3,})\/(\w{2})/.exec(url);
        if (urlParts === null) {
            throw new Error('can\'t identify country from url "' + url + '"');
        }
        let [, countryId, langId] = urlParts;
        if (countryId === 'master_languages') {
            countryId = 'usa';
        }
        return {
            countryId, langId
        };
    }

    /**
     * Full change url but stay in the same country and language
     *
     * @param {String} path
     */
    function location(path) {
        const url = $window.location.href;
        const newUrl = url.replace(/(content\/dhl\/\w{3}\/\w{2})\/.+/, '$1/' + path);
        $window.location.href = newUrl;
    }

    function redirect(path) {
        $window.location = path;
    }

    /**
     * Navigate on the same page with specified language
     *
     * @param {String} newLang
     */
    function changeLang(newLang) {
        const url = $window.location.href;
        const newUrl = url.replace(/(content\/dhl\/\w{3})\/\w{2}/, '$1/' + newLang);
        $window.location.href = newUrl;
    }

    function getPath() {
        const url = $window.location.pathname;
        // url after /content/dhl/ctr/lg
        return url.substring(20);
    }

    function changeCountry(to) {
        const from = getCountryLang().countryId;
        if (from !== to) {
            const url = $window.location.href;

            const normalizedCountryTo = to.toLowerCase();
            const filteredCountry = filterNotImplementedCountries(normalizedCountryTo);

            const newUrl = url.replace(/(content\/dhl\/\w{3})\/\w{2}/, 'content/dhl/' + filteredCountry + '/en');
            $window.location.href = newUrl;
        }
    }

    function redirectToLoginWithCountryId(countryId) {
        const url = $window.location.href;
        const filteredCountry = filterNotImplementedCountries(countryId.toLowerCase());
        const newUrl = url.replace(/(content\/dhl\/\w{3}\/\w{2})\/.+/,
                            'content/dhl/' + filteredCountry + '/en/auth/login.html');

        $window.location.href = newUrl;
    }

    //TODO remove when more countries are available
    function filterNotImplementedCountries(countryCode) {
        const normalizedCountryCode = countryCode.toLowerCase();
        if (normalizedCountryCode !== 'usa' && normalizedCountryCode !== 'deu') {
            $window.alert('Only USA and Germany are available for now. Redirecting to USA.');
            return 'usa';
        }

        return countryCode;
    }

    function redirectToLogin() {
        this.location(PATHS.LOGIN_PAGE);
    }

    function getParamFromUrl(param) {
        //http://stackoverflow.com/a/901144/1719874
        const parameter = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + parameter + '=([^&#]*)'),
            results = regex.exec($window.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    function getOriginFromUrl() {
        let origin = '';
        if ($window.location.origin) {
            origin = $window.location.origin;
        } else {
            origin = $window.location.protocol + '//' + $window.location.hostname +
                                ($window.location.port ? ':' + $window.location.port : '');
        }
        return origin;
    }
}
