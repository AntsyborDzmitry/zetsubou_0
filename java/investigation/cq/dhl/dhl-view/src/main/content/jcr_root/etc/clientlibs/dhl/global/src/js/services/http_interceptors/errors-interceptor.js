import ewf from 'ewf';

ewf.factory('errorsInterceptor', errorsInterceptor);

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
        const fieldErrors = data.fieldErrors;
        if (fieldErrors) {
            Object.keys(fieldErrors).forEach((fieldId) => {
                const errors = fieldErrors[fieldId];

                // TODO: display better
                // TODO: localize!!!
                const errText = errors.join(', ');
                logService.error('field "' + fieldId + '" has errors: ' + errText);
            });
        }

        const errors = data.errors;
        if (errors) {
            // TODO: display better
            // TODO: localize!!!
            const errText = errors.join(', ');
            logService.error('general errors: ' + errText);
        }
    }

    return {
        responseError: function(rejection) {
            // TODO: think about possible status codes to handle
            if (rejection.status === 400) {
                const data = rejection.data;
                if (data instanceof Object) {
                    showErrors(data);
                }
            }
            logService.log('err interceptor');
            return $q.reject(rejection);
        }
    };
}
