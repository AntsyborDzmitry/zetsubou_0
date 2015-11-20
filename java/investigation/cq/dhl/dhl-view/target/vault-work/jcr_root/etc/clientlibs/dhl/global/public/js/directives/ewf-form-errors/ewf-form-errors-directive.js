define(['exports', 'ewf', './ewf-form-errors-controller'], function (exports, _ewf, _ewfFormErrorsController) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('ewfFormErrors', ewfFormErrors);

    function ewfFormErrors() {
        return {
            restrict: 'A',
            priority: 1,
            scope: true,
            require: ['^ewfForm', 'ewfFormErrors'],
            controller: 'EwfFormErrorsController',
            controllerAs: 'ewfFormErrorsCtrl',
            template: '<div ng-repeat=\"errorMessage in ewfFormErrorsCtrl.formCtrl.formErrors\"><span class=label-error nls={{errorMessage}}></span></div>',
            link: function link(scope, element, attrs, controllers) {
                var _controllers = _slicedToArray(controllers, 2);

                var formCtrl = _controllers[0];
                var errorsCtrl = _controllers[1];

                errorsCtrl.formCtrl = formCtrl;
            }
        };
    }
});
//# sourceMappingURL=ewf-form-errors-directive.js.map
