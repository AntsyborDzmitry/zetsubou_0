define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ewfNonEmptyValidator;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('ewfNonEmptyValidator', ewfNonEmptyValidator);

    function ewfNonEmptyValidator() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: {
                pre: preLink
            }
        };
    }

    function preLink(scope, element, attrs, ngModelCtrl) {
        scope.$watch(attrs.ngModel, function (value) {
            ngModelCtrl.$setValidity('nonEmpty', validate(value));
        }, true);
    }

    function validate(value) {
        return value && Object.values(value).some(function (prop) {
            return !!prop;
        });
    }
});
//# sourceMappingURL=ewf-non-empty-validator-directive.js.map
