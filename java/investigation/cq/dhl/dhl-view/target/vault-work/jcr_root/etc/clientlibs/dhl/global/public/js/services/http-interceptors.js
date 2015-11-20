define(['exports', 'ewf', './http_interceptors/errors-interceptor', './http_interceptors/session-expired-interceptor'], function (exports, _ewf, _http_interceptorsErrorsInterceptor, _http_interceptorsSessionExpiredInterceptor) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].config(httpConfig);

    httpConfig.$inject = ['$httpProvider', '$windowProvider'];

    function httpConfig($httpProvider, $windowProvider) {
        $httpProvider.interceptors.push('sessionExpiredInterceptor', 'errorsInterceptor');

        /*disable cache for IE*/
        var userAgent = $windowProvider.$get().navigator.userAgent;
        if (userAgent.includes('MSIE') || userAgent.includes('.NET')) {
            $httpProvider.defaults.cache = false;
            $httpProvider.defaults.headers.get = $httpProvider.defaults.headers.get || {};
            // disable IE ajax request caching
            /*If-Modified-Since header to a zero date, we�re forcing IE to skip it�s local cache check with any expiration
             date. Here is a reference http://benjii.me/2014/07/ie-is-caching-my-angular-requests-to-asp-net-mvc/*/
            $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
        }
    }
});
//# sourceMappingURL=http-interceptors.js.map
