define(['exports', 'ewf', './../../../../directives/ewf-form/ewf-form-directive'], function (exports, _ewf, _directivesEwfFormEwfFormDirective) {
    'use strict';

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('reApplyRules', reApplyRules);

    function reApplyRules() {
        return {
            restrict: 'A',
            require: ['^ewfForm', 'ngModel'],
            link: function link(scope, element, attributes, ctrls) {
                var _ctrls = _slicedToArray(ctrls, 2);

                var ewfFormController = _ctrls[0];
                var ngModelCtrl = _ctrls[1];

                function reApplyRulesCallBack(countryCode) {
                    if (countryCode) {
                        var codeValue = countryCode.value;
                        if (codeValue !== undefined && codeValue !== '') {
                            ewfFormController.reApplyVisibilityRules(codeValue);
                            return countryCode;
                        }
                    }
                }

                ngModelCtrl.$parsers.push(reApplyRulesCallBack);

                ngModelCtrl.$formatters.push(reApplyRulesCallBack);
            }
        };
    }
});
//# sourceMappingURL=re-apply-rules-directive.js.map
