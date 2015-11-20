import ewf from 'ewf';
import SaveToLocalStorageController from './save-to-local-storage-controller';
import './exclude-from-local-storage-directive';

ewf.directive('saveToLocalStorage', SaveToLocalStorage);

SaveToLocalStorage.$inject = ['$window'];

function SaveToLocalStorage($window) {
    return {
        restrict: 'A',
        scope: true,
        controller: SaveToLocalStorageController,
        controllerAs: 'saveToLocalStorage',
        link: {
            post: postLink
        }
    };

    function postLink(scope, element, attrs, localStorageController) {
        const formObjectCheckString = '$removeControl';
        const rootFormName = attrs.ngForm || attrs.name;
        const form = scope[rootFormName];

        let canSaveBeforeReload = true;
        localStorageController.init(rootFormName);

        applyFormListener(form);

        ($window.addEventListener || $window.attachEvent)('beforeunload', function() {
            if (canSaveBeforeReload) {
                localStorageController.saveDataToLocalStorage(form);
            }
        });

        element.on('submit', () => {
            localStorageController.clearStorageData();
            canSaveBeforeReload = false;
        });

        function applyFormListener(formToListen) {
            Object.keys(formToListen).some((key) => {
                if (key.charAt(0) !== '$' || key === formObjectCheckString) {
                    const formName = formToListen.$name;
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
