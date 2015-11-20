import ewf from 'ewf';

ewf.directive('excludeFromLocalStorage', excludeFromLocalStorage);

function excludeFromLocalStorage() {
    return {
        restrict: 'A',
        require: '^saveToLocalStorage',
        link: {
            post: postLink
        }
    };

    function postLink(scope, element, attrs, localStorageController) {
        const fieldName = attrs.name;
        const formName = attrs.ngForm;
        if (formName || element.prop('tagName') === 'FORM') {
            localStorageController.addFormToExclusionList(formName || fieldName);
        } else {
            localStorageController.addFieldToExclusionList(fieldName);
        }
    }
}
