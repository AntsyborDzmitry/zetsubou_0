import ewf from 'ewf';

ewf.directive('ewfCheckEmail', EwfCheckEmail);

EwfCheckEmail.$inject = ['$http', 'logService'];

function EwfCheckEmail($http, logService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: (scope, element, attrs, ctrl) => postLink(scope, element, attrs, ctrl, $http, logService)
    };
}

function postLink(scope, element, attrs, ctrl, $http, logService) {
    // TODO: it's not good that e-mail check each time focus out
    ctrl.$parsers.unshift((email) => {
        $http.post('/api/user/validate/email ', {email})
            .success((emailValidationResponce) => {
                // TODO: check that it real success
                // Response format: {"valid":true,"exist":true}
                const validity = !emailValidationResponce.exist;
                ctrl.$setValidity('emailAlreadyExists', validity);
                const validityFormat = emailValidationResponce.valid;
                ctrl.$setValidity('email', validityFormat);

                return email;
            })
            // TODO: handle HTTP errors like 500
            .error((error) => {
                logService.error('There are some issues contacting server. ' + error);
                ctrl.$setValidity('emailAlreadyExists', true);
                return email;
            });

        return email;
    });
}
