define(['exports', 'ewf', './save-to-local-storage-controller', './exclude-from-local-storage-directive'], function (exports, _ewf, _saveToLocalStorageController, _excludeFromLocalStorageDirective) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _SaveToLocalStorageController = _interopRequireDefault(_saveToLocalStorageController);

    _ewf2['default'].directive('saveToLocalStorage', SaveToLocalStorage);

    SaveToLocalStorage.$inject = ['$window'];

    function SaveToLocalStorage($window) {
        return {
            restrict: 'A',
            scope: true,
            controller: _SaveToLocalStorageController['default'],
            controllerAs: 'saveToLocalStorage',
            link: {
                post: postLink
            }
        };

        function postLink(scope, element, attrs, localStorageController) {
            var formObjectCheckString = '$removeControl';
            var rootFormName = attrs.ngForm || attrs.name;
            var form = scope[rootFormName];

            var canSaveBeforeReload = true;
            localStorageController.init(rootFormName);

            applyFormListener(form);

            ($window.addEventListener || $window.attachEvent)('beforeunload', function () {
                if (canSaveBeforeReload) {
                    localStorageController.saveDataToLocalStorage(form);
                }
            });

            element.on('submit', function () {
                localStorageController.clearStorageData();
                canSaveBeforeReload = false;
            });

            function applyFormListener(formToListen) {
                Object.keys(formToListen).some(function (key) {
                    if (key.charAt(0) !== '$' || key === formObjectCheckString) {
                        var formName = formToListen.$name;
                        localStorageController.addFormToExclusionList(formName);
                        scope.$watchCollection(formName, formListener);
                        return true;
                    }
                });
            }

            function formListener(newForm) {
                if (newForm && !localStorageController.isFormInExclusionList(newForm.$name)) {
                    applyFormListener(newForm);
                }
                localStorageController.populateFormFromLocalStorage(newForm);
            }
        }
    }
});
//# sourceMappingURL=save-to-local-storage-directive.js.map
