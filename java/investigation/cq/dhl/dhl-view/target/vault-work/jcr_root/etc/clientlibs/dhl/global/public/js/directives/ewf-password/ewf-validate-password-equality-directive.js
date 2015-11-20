define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    module.exports = EwfValidatePasswordEquality;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('ewfValidatePasswordEquality', EwfValidatePasswordEquality);

    function EwfValidatePasswordEquality() {
        return {
            restrict: 'A',
            require: ['ewfInput', 'ngModel'],
            link: {
                post: postLink
            }
        };

        function postLink(scope, element, attrs, controllers) {
            var _controllers = _slicedToArray(controllers, 2);

            var inputCtrl = _controllers[0];
            var ngModelCtrl = _controllers[1];

            var equalityInfo = scope.$eval(attrs.ewfValidatePasswordEquality);
            var passwordField = equalityInfo.passwordField;
            var operation = equalityInfo.operation || 'matches';
            var errorMessage = equalityInfo.errorMessage;

            var testEquality = operation === 'matches' ? testMatches : testDiffers;

            scope.$watch(function () {
                var evalResult = scope.$eval(passwordField);
                return [evalResult, ngModelCtrl.$viewValue];
            }, function (values) {
                var _values = _slicedToArray(values, 2);

                var passwordInputText = _values[0];
                var equalityPasswordInputText = _values[1];

                var equality = true;
                if (passwordInputText && equalityPasswordInputText) {
                    equality = testEquality(passwordInputText, equalityPasswordInputText) || !!inputCtrl.addErrorMessage(errorMessage);
                }
                ngModelCtrl.$setValidity(operation, equality);
            }, true);
        }

        function testMatches(firstValue, secondValue) {
            return firstValue === secondValue;
        }

        function testDiffers(firstValue, secondValue) {
            return firstValue !== secondValue;
        }
    }
});
//# sourceMappingURL=ewf-validate-password-equality-directive.js.map
