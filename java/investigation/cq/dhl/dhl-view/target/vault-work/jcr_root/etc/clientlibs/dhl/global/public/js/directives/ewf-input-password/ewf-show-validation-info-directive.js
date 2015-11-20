define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = ewfShowValidationInfo;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('ewfShowValidationInfo', ewfShowValidationInfo);

    function ewfShowValidationInfo() {
        return {
            restrict: 'A',
            link: {
                post: postLink
            }
        };

        function postLink(scope, element) {
            var ewfInputPasswordCtrl = scope.ewfInputPasswordCtrl;
            var vldInfo = scope.errorMessage;
            var validationMessages = ewfInputPasswordCtrl.validationErrorMessage[ewfInputPasswordCtrl.fieldName];

            vldInfo.isRuleValid = ewfInputPasswordCtrl.validateRule(vldInfo.viewValue, vldInfo.functionName, vldInfo.validateParams);

            if (vldInfo.isRuleValid) {
                element.addClass('ewf-complete-ver-info');
            } else {
                element.removeClass('ewf-complete-ver-info');
            }

            var rules = Object.keys(validationMessages);
            var validationFinished = false;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var rule = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = validationMessages[rule][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var someItem = _step2.value;

                            ewfInputPasswordCtrl.validationIsVisible = !someItem.isRuleValid;
                            if (ewfInputPasswordCtrl.validationIsVisible) {
                                validationFinished = true;
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                                _iterator2['return']();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    if (validationFinished) {
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }
});
//# sourceMappingURL=ewf-show-validation-info-directive.js.map
