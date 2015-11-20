define(['exports', 'module', 'ewf', './../../directives/ewf-validate/ewf-validate-required-directive', './../../directives/ewf-input/ewf-input-directive', './../../directives/ewf-input-password/ewf-input-password-directive', './ewf-input-controller'], function (exports, module, _ewf, _directivesEwfValidateEwfValidateRequiredDirective, _directivesEwfInputEwfInputDirective, _directivesEwfInputPasswordEwfInputPasswordDirective, _ewfInputController) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = ewfInput;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _InputController = _interopRequireDefault(_ewfInputController);

    _ewf2['default'].directive('ewfInput', ewfInput);

    function ewfInput() {
        return {
            restrict: 'A',
            priority: 3,
            controller: _InputController['default'],
            controllerAs: 'ewfInputCtrl',
            require: ['ngModel', 'ewfInput', '^ewfForm'],
            link: {
                pre: preLink,
                post: postLink
            }
        };

        function preLink(scope, element, attrs, controllers) {
            var _controllers = _slicedToArray(controllers, 3);

            var modelCtrl = _controllers[0];
            var inputCtrl = _controllers[1];
            var formCtrl = _controllers[2];

            inputCtrl.fieldName = attrs.ewfInput;
            inputCtrl.ewfFormCtrl = formCtrl;
            inputCtrl.ngModelCtrl = modelCtrl;
            inputCtrl.setupValidation();
        }

        function postLink(scope, element, attrs, controllers) {
            var _controllers2 = _slicedToArray(controllers, 2);

            var ngModelController = _controllers2[0];
            var inputController = _controllers2[1];

            var fieldId = attrs.ewfInput;

            inputController.init(fieldId, element, attrs, ngModelController);

            element.on('blur', function () {
                element.addClass('ng-dirty ng-blur');
            });

            scope.$on('ValidateForm', function () {
                element.addClass('ng-dirty ng-blur');
            });
        }
    }
});
//# sourceMappingURL=ewf-input-directive.js.map
