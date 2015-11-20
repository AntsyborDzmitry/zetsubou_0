define(['exports', 'ewf', './ewf-field-errors-controller'], function (exports, _ewf, _ewfFieldErrorsController) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('ewfFieldErrors', ewfFieldErrors);

    function ewfFieldErrors() {
        return {
            restrict: 'A',
            priority: 1,
            replace: true,
            scope: true,
            require: ['^ewfForm', '^ewfField', 'ewfFieldErrors'],
            controller: 'EwfFieldErrorsController',
            controllerAs: 'ewfFieldErrorsCtrl',
            template: '<div class=msg-error ng-if=\"ewfFieldErrorsCtrl.getErrorMessages().length > 0\"><div ng-repeat=\"errorMessage in ewfFieldErrorsCtrl.getErrorMessages() track by $index\"><span nls={{errorMessage}} nls-bind></span></div></div>',
            link: { pre: pre }
        };

        function pre(scope, element, attrs, controllers) {
            var _controllers = _slicedToArray(controllers, 3);

            var ewfFormCtrl = _controllers[0];
            var fieldController = _controllers[1];
            var errorsCtrl = _controllers[2];
            var fieldName = fieldController.name;

            Object.assign(errorsCtrl, { ewfFormCtrl: ewfFormCtrl, fieldController: fieldController, fieldName: fieldName });

            if (scope.$parent.ewfInputCtrl) {
                // @todo: refactor this temporary hack and merge it with errorMessages
                errorsCtrl.validationMessages = scope.$parent.ewfInputCtrl.validationErrorMessage;
            }
        }
    }
});
//# sourceMappingURL=ewf-field-errors-directive.js.map
