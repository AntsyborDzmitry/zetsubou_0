import ewf from 'ewf';

ewf.directive('ewfNonEmptyValidator', ewfNonEmptyValidator);

export default function ewfNonEmptyValidator() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: {
            pre: preLink
        }
    };
}

function preLink(scope, element, attrs, ngModelCtrl) {
    scope.$watch(attrs.ngModel, (value) => {
        ngModelCtrl.$setValidity('nonEmpty', validate(value));
    }, true);
}

function validate(value) {
    return value && Object.values(value).some((prop) => !!prop);
}
