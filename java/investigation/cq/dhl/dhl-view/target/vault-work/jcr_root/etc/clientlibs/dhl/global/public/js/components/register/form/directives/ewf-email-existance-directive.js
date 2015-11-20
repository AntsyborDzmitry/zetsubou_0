define(['exports', 'ewf'], function (exports, _ewf) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('ewfCheckEmail', EwfCheckEmail);

    EwfCheckEmail.$inject = ['$http', 'logService'];

    function EwfCheckEmail($http, logService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function link(scope, element, attrs, ctrl) {
                return postLink(scope, element, attrs, ctrl, $http, logService);
            }
        };
    }

    function postLink(scope, element, attrs, ctrl, $http, logService) {
        // TODO: it's not good that e-mail check each time focus out
        ctrl.$parsers.unshift(function (email) {
            $http.post('/api/user/validate/email ', { email: email }).success(function (emailValidationResponce) {
                // TODO: check that it real success
                // Response format: {"valid":true,"exist":true}
                var validity = !emailValidationResponce.exist;
                ctrl.$setValidity('emailAlreadyExists', validity);
                var validityFormat = emailValidationResponce.valid;
                ctrl.$setValidity('email', validityFormat);

                return email;
            })
            // TODO: handle HTTP errors like 500
            .error(function (error) {
                logService.error('There are some issues contacting server. ' + error);
                ctrl.$setValidity('emailAlreadyExists', true);
                return email;
            });

            return email;
        });
    }
});
//# sourceMappingURL=ewf-email-existance-directive.js.map
