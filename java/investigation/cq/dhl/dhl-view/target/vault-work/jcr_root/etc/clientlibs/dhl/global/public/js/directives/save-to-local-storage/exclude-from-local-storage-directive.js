define(['exports', 'ewf'], function (exports, _ewf) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].directive('excludeFromLocalStorage', excludeFromLocalStorage);

    function excludeFromLocalStorage() {
        return {
            restrict: 'A',
            require: '^saveToLocalStorage',
            link: {
                post: postLink
            }
        };

        function postLink(scope, element, attrs, localStorageController) {
            var fieldName = attrs.name;
            var formName = attrs.ngForm;
            if (formName || element.prop('tagName') === 'FORM') {
                localStorageController.addFormToExclusionList(formName || fieldName);
            } else {
                localStorageController.addFieldToExclusionList(fieldName);
            }
        }
    }
});
//# sourceMappingURL=exclude-from-local-storage-directive.js.map
