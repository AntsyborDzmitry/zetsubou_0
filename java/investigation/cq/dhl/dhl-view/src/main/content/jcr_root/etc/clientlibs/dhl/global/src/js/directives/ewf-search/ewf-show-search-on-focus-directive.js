import ewf from 'ewf';

ewf.directive('ewfShowSearchOnFocus', ewfShowSearchOnFocus);

export default function ewfShowSearchOnFocus() {
    return {
        restrict: 'AE',
        require: ['^ewfSearch', 'ngModel'],
        link: {
            post: postLink
        }
    };

    function postLink(scope, element, attrs, controllers) {
        const [ewfSearchCtrl, ngModelCtrl] = controllers;
        const testKey = ewfSearchCtrl.getTestKeyForOnFocusSearch();

        element.on('focus', () => {
            if (!ngModelCtrl.$viewValue || ngModelCtrl.$viewValue === testKey) {
                scope.$apply(() => ngModelCtrl.$setViewValue(testKey));
            }
        });
        ngModelCtrl.$parsers.unshift((inputValue) => (ngModelCtrl.$viewValue = (inputValue ? inputValue : testKey)));
        ngModelCtrl.$parsers.push((inputValue) => inputValue === testKey ? '' : inputValue);
    }
}
