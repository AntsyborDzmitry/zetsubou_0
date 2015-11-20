define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = NavigationService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('navigationService', NavigationService);

    NavigationService.$inject = ['$window'];

    /**
     * Navigation Service. Need to work with URL params and for navigation
     *
     * @param {angular.$window} $window
     */

    function NavigationService($window) {
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

        var PATHS = {
            LOGIN_PAGE: 'auth/login.html'
        };
        this.paths = Object.assign({}, PATHS);

        function getCountryLang() {
            var url = $window.location.href;
            var urlParts = /content\/dhl\/(\w{3,})\/(\w{2})/.exec(url);
            if (urlParts === null) {
                throw new Error('can\'t identify country from url "' + url + '"');
            }

            var _urlParts = _slicedToArray(urlParts, 3);

            var countryId = _urlParts[1];
            var langId = _urlParts[2];

            if (countryId === 'master_languages') {
                countryId = 'usa';
            }
            return {
                countryId: countryId, langId: langId
            };
        }

        /**
         * Full change url but stay in the same country and language
         *
         * @param {String} path
         */
        function location(path) {
            var url = $window.location.href;
            var newUrl = url.replace(/(content\/dhl\/\w{3}\/\w{2})\/.+/, '$1/' + path);
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
            var url = $window.location.href;
            var newUrl = url.replace(/(content\/dhl\/\w{3})\/\w{2}/, '$1/' + newLang);
            $window.location.href = newUrl;
        }

        function getPath() {
            var url = $window.location.pathname;
            // url after /content/dhl/ctr/lg
            return url.substring(20);
        }

        function changeCountry(to) {
            var from = getCountryLang().countryId;
            if (from !== to) {
                var url = $window.location.href;

                var normalizedCountryTo = to.toLowerCase();
                var filteredCountry = filterNotImplementedCountries(normalizedCountryTo);

                var newUrl = url.replace(/(content\/dhl\/\w{3})\/\w{2}/, 'content/dhl/' + filteredCountry + '/en');
                $window.location.href = newUrl;
            }
        }

        function redirectToLoginWithCountryId(countryId) {
            var url = $window.location.href;
            var filteredCountry = filterNotImplementedCountries(countryId.toLowerCase());
            var newUrl = url.replace(/(content\/dhl\/\w{3}\/\w{2})\/.+/, 'content/dhl/' + filteredCountry + '/en/auth/login.html');

            $window.location.href = newUrl;
        }

        //TODO remove when more countries are available
        function filterNotImplementedCountries(countryCode) {
            var normalizedCountryCode = countryCode.toLowerCase();
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
            var parameter = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + parameter + '=([^&#]*)'),
                results = regex.exec($window.location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        function getOriginFromUrl() {
            var origin = '';
            if ($window.location.origin) {
                origin = $window.location.origin;
            } else {
                origin = $window.location.protocol + '//' + $window.location.hostname + ($window.location.port ? ':' + $window.location.port : '');
            }
            return origin;
        }
    }
});
//# sourceMappingURL=navigation-service.js.map
