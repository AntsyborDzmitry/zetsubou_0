define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = ewfShowSearchOnFocus;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('ewfShowSearchOnFocus', ewfShowSearchOnFocus);

    function ewfShowSearchOnFocus() {
        return {
            restrict: 'AE',
            require: ['^ewfSearch', 'ngModel'],
            link: {
                post: postLink
            }
        };

        function postLink(scope, element, attrs, controllers) {
            var _controllers = _slicedToArray(controllers, 2);

            var ewfSearchCtrl = _controllers[0];
            var ngModelCtrl = _controllers[1];

            var testKey = ewfSearchCtrl.getTestKeyForOnFocusSearch();

            element.on('focus', function () {
                if (!ngModelCtrl.$viewValue || ngModelCtrl.$viewValue === testKey) {
                    scope.$apply(function () {
                        return ngModelCtrl.$setViewValue(testKey);
                    });
                }
            });
            ngModelCtrl.$parsers.unshift(function (inputValue) {
                return ngModelCtrl.$viewValue = inputValue ? inputValue : testKey;
            });
            ngModelCtrl.$parsers.push(function (inputValue) {
                return inputValue === testKey ? '' : inputValue;
            });
        }
    }
});
//# sourceMappingURL=ewf-show-search-on-focus-directive.js.map
