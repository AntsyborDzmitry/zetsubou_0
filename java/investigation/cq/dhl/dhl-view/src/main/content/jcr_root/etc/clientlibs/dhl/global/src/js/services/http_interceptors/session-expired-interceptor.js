import ewf from 'ewf';

ewf.factory('sessionExpiredInterceptor', sessionExpiredInterceptor);

sessionExpiredInterceptor.$inject = ['$q', 'logService', 'loginService', 'navigationService'];

export default function sessionExpiredInterceptor($q, logService, loginService, navigationService) {
    return {
        responseError: function(rejection) {
            if (rejection.status === 401) {
                logService.log('HTTP 401: Session Expired Interceptor - redirect to login page');
                loginService.saveNextFormTitle(loginService.titles.SESSION_TIMED_OUT);
                navigationService.redirectToLogin();
            }
            return $q.reject(rejection);
        }
    };
}
