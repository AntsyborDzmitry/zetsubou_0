define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = sessionExpiredInterceptor;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].factory('sessionExpiredInterceptor', sessionExpiredInterceptor);

    sessionExpiredInterceptor.$inject = ['$q', 'logService', 'loginService', 'navigationService'];

    function sessionExpiredInterceptor($q, logService, loginService, navigationService) {
        return {
            responseError: function responseError(rejection) {
                if (rejection.status === 401) {
                    logService.log('HTTP 401: Session Expired Interceptor - redirect to login page');
                    loginService.saveNextFormTitle(loginService.titles.SESSION_TIMED_OUT);
                    navigationService.redirectToLogin();
                }
                return $q.reject(rejection);
            }
        };
    }
});
//# sourceMappingURL=session-expired-interceptor.js.map
