define(['exports', 'module', 'ewf', './../ewf-field/ewf-field-directive', './../ewf-field-errors/ewf-field-errors-directive', './../ewf-input/ewf-input-directive', './../ewf-validate/ewf-validate-required-directive', './../ewf-validate/ewf-validate-pattern-directive', './../ewf-form-errors/ewf-form-errors-directive', './ewf-form-controller'], function (exports, module, _ewf, _ewfFieldEwfFieldDirective, _ewfFieldErrorsEwfFieldErrorsDirective, _ewfInputEwfInputDirective, _ewfValidateEwfValidateRequiredDirective, _ewfValidateEwfValidatePatternDirective, _ewfFormErrorsEwfFormErrorsDirective, _ewfFormController) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = EwfForm;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _FormController = _interopRequireDefault(_ewfFormController);

    _ewf2['default'].directive('ewfForm', EwfForm);

    function EwfForm() {
        return {
            restrict: 'A',
            priority: 1,
            controller: _FormController['default'],
            controllerAs: 'ewfFormCtrl',
            require: ['ewfForm', '?form'],
            link: { pre: pre }
        };

        function pre($scope, element, $attrs, _ref) {
            var _ref2 = _slicedToArray(_ref, 2);

            var controller = _ref2[0];
            var ngFormCtrl = _ref2[1];

            controller.init($attrs.ewfForm);

            if (ngFormCtrl) {
                var ewfValidation = controller.ewfValidation;
                var setErrorsFromResponse = controller.setErrorsFromResponse;

                Object.assign(ngFormCtrl, {
                    validate: ewfValidation,
                    setErrorsFromResponse: setErrorsFromResponse
                });
            }
        }
    }
});
//# sourceMappingURL=ewf-form-directive.js.map
