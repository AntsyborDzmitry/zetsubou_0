define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = attrsService;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].service('attrsService', attrsService);

    attrsService.$inject = ['$parse'];

    /**
     * Attrs service. Contains helper logic related to attribute manipulation
     *
     */

    function attrsService($parse) {
        this.track = track;
        this.trigger = trigger;

        /**
         * track - Sets up one or two-way binding depending on whether the expression is assignable
         */
        function track($scope, $attrs, attributeName, attributeValueContainer, onChangeFn, savePropertyAs) {
            var valueGetterExpr = $parse($attrs[attributeName]);
            var valueSetterExpr = valueGetterExpr.assign;

            var containerAttributeName = savePropertyAs || attributeName;
            var valuePrev = attributeValueContainer[containerAttributeName] = valueGetterExpr($scope);

            if (onChangeFn) {
                onChangeFn(valuePrev);
            }

            var unwatchExternalChanges = $scope.$watch(function () {
                return valueGetterExpr($scope);
            }, function (valueCurr) {
                if (valuePrev !== valueCurr) {
                    attributeValueContainer[containerAttributeName] = valuePrev = valueCurr;
                    if (onChangeFn) {
                        onChangeFn(valueCurr);
                    }
                }
            });

            // If expression is assignable than initialize reverse binding
            if (valueSetterExpr) {
                var _ret = (function () {
                    var unwatchInternalChanges = $scope.$watch(function () {
                        return attributeValueContainer[containerAttributeName];
                    }, function (valueCurr) {
                        if (valuePrev !== valueCurr) {
                            valueSetterExpr($scope, valuePrev = valueCurr);

                            if (onChangeFn) {
                                onChangeFn(valueCurr);
                            }
                        }
                    });

                    return {
                        v: function () {
                            unwatchExternalChanges();
                            unwatchInternalChanges();
                        }
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            }

            return unwatchExternalChanges;
        }

        function trigger($scope, $attrs, attributeName, onTrigger) {
            if ($attrs[attributeName]) {
                if (onTrigger) {
                    if (angular.isFunction(onTrigger)) {
                        onTrigger($scope, $attrs, attributeName);
                    }
                    if (angular.isObject(onTrigger)) {
                        for (var key in onTrigger) {
                            if (onTrigger.hasOwnProperty(key)) {
                                $scope[key] = onTrigger[key];
                            }
                        }
                    } else {
                        throw new Error('unexpected onTrigger value type');
                    }
                }

                return $scope.$eval($attrs[attributeName]);
            }
        }
    }
});
//# sourceMappingURL=attrs-service.js.map
