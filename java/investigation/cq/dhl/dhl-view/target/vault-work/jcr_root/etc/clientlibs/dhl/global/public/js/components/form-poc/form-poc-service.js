define(['exports', 'ewf'], function (exports, _ewf) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('formPocService', formPocService);

    formPocService.inject = ['$http', '$q', '$window'];

    function formPocService($http, $q, $window) {

        this.getFormConfig = getFormConfig;

        function getFormConfig(fieldsToHide) {
            var defer = $q.defer();
            var hideRules = {};
            for (var i = 1; i <= fieldsToHide; i += 1) {
                hideRules['company_' + i] = true;
            }

            $window.setTimeout(function () {
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
});
//# sourceMappingURL=form-poc-service.js.map
