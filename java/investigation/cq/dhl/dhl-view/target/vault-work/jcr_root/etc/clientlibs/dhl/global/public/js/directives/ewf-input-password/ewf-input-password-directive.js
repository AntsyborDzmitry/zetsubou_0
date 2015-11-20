define(['exports', 'module', 'ewf', './ewf-show-validation-info-directive', './ewf-input-password-controller'], function (exports, module, _ewf, _ewfShowValidationInfoDirective, _ewfInputPasswordController) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = ewfInputPasswordD;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _InputPasswordController = _interopRequireDefault(_ewfInputPasswordController);

    _ewf2['default'].directive('ewfInputPassword', ewfInputPasswordD);

    function ewfInputPasswordD() {
        return {
            restrict: 'A',
            priority: 3,
            controller: _InputPasswordController['default'],
            controllerAs: 'ewfInputPasswordCtrl',
            require: ['ngModel', 'ewfInputPassword', '^ewfForm'],
            link: {
                pre: preLink,
                post: postLink
            }
        };
    }

    function preLink(scope, element, attrs, controllers) {
        var _controllers = _slicedToArray(controllers, 3);

        var modelCtrl = _controllers[0];
        var inputCtrl = _controllers[1];
        var formCtrl = _controllers[2];

        inputCtrl.fieldName = attrs.ewfInputPassword;
        inputCtrl.ewfFormCtrl = formCtrl;
        inputCtrl.ngModelCtrl = modelCtrl;
    }

    function postLink(scope, element, attrs, controllers) {
        var _controllers2 = _slicedToArray(controllers, 3);

        var ngModelController = _controllers2[0];
        var ewfInputPassword = _controllers2[1];
        var ewfFieldController = _controllers2[2];

        ewfFieldController.ngModelCtrl = ngModelController;
        var fieldId = attrs.ewfInputPassword;
        ewfInputPassword.init(fieldId, ngModelController);

        element.on('blur', function () {
            element.addClass('ng-dirty ng-blur');
            scope.$apply(function () {
                ewfInputPassword.validationIsVisible = false;
            });
        });

        scope.$on('ValidateForm', function () {
            element.addClass('ng-dirty');
            ewfInputPassword.validationIsVisible = true;
            ewfInputPassword.validateFieldEx();
        });

        element.on('keyup', function () {
            scope.$apply(function () {
                ewfInputPassword.validationIsVisible = true;
                ewfInputPassword.validateFieldEx();
            });
        });
    }
});
//# sourceMappingURL=ewf-input-password-directive.js.map
