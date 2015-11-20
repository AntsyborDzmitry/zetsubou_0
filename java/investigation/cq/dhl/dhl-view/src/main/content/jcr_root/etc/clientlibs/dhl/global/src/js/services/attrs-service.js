import ewf from 'ewf';

ewf.service('attrsService', attrsService);

attrsService.$inject = ['$parse'];

/**
 * Attrs service. Contains helper logic related to attribute manipulation
 *
 */
export default function attrsService($parse) {
    this.track = track;
    this.trigger = trigger;

    /**
     * track - Sets up one or two-way binding depending on whether the expression is assignable
     */
    function track($scope, $attrs, attributeName, attributeValueContainer, onChangeFn, savePropertyAs) {
        let valueGetterExpr = $parse($attrs[attributeName]);
        let valueSetterExpr = valueGetterExpr.assign;

        const containerAttributeName = savePropertyAs || attributeName;
        let valuePrev = attributeValueContainer[containerAttributeName] = valueGetterExpr($scope);

        if (onChangeFn) {
            onChangeFn(valuePrev);
        }

        const unwatchExternalChanges = $scope.$watch(() => {
            return valueGetterExpr($scope);
        }, function(valueCurr) {
            if (valuePrev !== valueCurr) {
                attributeValueContainer[containerAttributeName] = valuePrev = valueCurr;
                if (onChangeFn) {
                    onChangeFn(valueCurr);
                }
            }
        });

        // If expression is assignable than initialize reverse binding
        if (valueSetterExpr) {
            const unwatchInternalChanges = $scope.$watch(() => {
                return attributeValueContainer[containerAttributeName];
            }, (valueCurr) => {
                if (valuePrev !== valueCurr) {
                    valueSetterExpr($scope, valuePrev = valueCurr);

                    if (onChangeFn) {
                        onChangeFn(valueCurr);
                    }
                }
            });

            return () => {
                unwatchExternalChanges();
                unwatchInternalChanges();
            };
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
                    for (let key in onTrigger) {
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
