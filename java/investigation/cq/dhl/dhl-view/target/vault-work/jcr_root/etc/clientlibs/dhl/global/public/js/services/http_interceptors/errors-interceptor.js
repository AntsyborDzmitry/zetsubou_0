define(['exports', 'ewf'], function (exports, _ewf) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].factory('errorsInterceptor', errorsInterceptor);

    errorsInterceptor.$inject = ['$q', 'logService'];

    function errorsInterceptor($q, logService) {

        /**
         * @param {Object} data - json response in form:
         * {
         *   "fieldErrors": {
         *      "fieldId": ["errCode"]
         *   },
         *   "errors": ["errCode"]
         * }
         */
        function showErrors(data) {
            var fieldErrors = data.fieldErrors;
            if (fieldErrors) {
                Object.keys(fieldErrors).forEach(function (fieldId) {
                    var errors = fieldErrors[fieldId];

                    // TODO: display better
                    // TODO: localize!!!
                    var errText = errors.join(', ');
                    logService.error('field "' + fieldId + '" has errors: ' + errText);
                });
            }

            var errors = data.errors;
            if (errors) {
                // TODO: display better
                // TODO: localize!!!
                var errText = errors.join(', ');
                logService.error('general errors: ' + errText);
            }
        }

        return {
            responseError: function responseError(rejection) {
                // TODO: think about possible status codes to handle
                if (rejection.status === 400) {
                    var data = rejection.data;
                    if (data instanceof Object) {
                        showErrors(data);
                    }
                }
                logService.log('err interceptor');
                return $q.reject(rejection);
            }
        };
    }
});
//# sourceMappingURL=errors-interceptor.js.map
