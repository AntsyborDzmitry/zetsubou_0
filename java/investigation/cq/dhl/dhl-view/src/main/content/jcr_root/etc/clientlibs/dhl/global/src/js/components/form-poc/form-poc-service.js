import ewf from 'ewf';

ewf.service('formPocService', formPocService);

formPocService.inject = ['$http', '$q', '$window'];

function formPocService($http, $q, $window) {

    this.getFormConfig = getFormConfig;

    function getFormConfig(fieldsToHide) {
        const defer = $q.defer();
        const hideRules = {};
        for (let i = 1; i <= fieldsToHide; i += 1) {
            hideRules['company_' + i] = true;
        }

        $window.setTimeout(function() {
            defer.resolve(hideRules);
        });

        return defer.promise;


        //return $http.post('/api')
        //    .success(function(data) {
        //        return data;
        //    })
        //    .error(function(data) {
        //        //TODO Handle error codes from services differently
        //        logService.log('e-mail verification failed: ' + data);
        //        return $q.reject(data);
        //    });
    }

}
