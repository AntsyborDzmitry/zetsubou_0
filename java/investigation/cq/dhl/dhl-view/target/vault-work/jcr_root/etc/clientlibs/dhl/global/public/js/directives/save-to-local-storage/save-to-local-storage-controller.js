define(['exports', 'module'], function (exports, module) {
    'use strict';

    module.exports = SaveToLocalStorageController;
    SaveToLocalStorageController.$inject = ['$window', 'logService'];

    function SaveToLocalStorageController($window, logService) {
        var formObjectCheckString = '$removeControl';
        var vm = this;
        var excludedForms = {};
        var excludedFormFields = {
            $error: 1,
            $name: 1,
            $dirty: 1,
            $pristine: 1,
            $valid: 1,
            $invalid: 1,
            $addControl: 1,
            $removeControl: 1,
            $setValidity: 1,
            $setDirty: 1,
            $setPristine: 1,
            $modelValue: 1
        };

        var localStorageKey = undefined;
        var localStorageFormData = undefined;

        vm.populateFormFromLocalStorage = populateFormFromLocalStorage;
        vm.saveDataToLocalStorage = saveDataToLocalStorage;
        vm.clearStorageData = clearStorageData;
        vm.addFormToExclusionList = addFormToExclusionList;
        vm.isFormInExclusionList = isFormInExclusionList;
        vm.addFieldToExclusionList = addFieldToExclusionList;

        vm.init = init;

        function init(formName) {
            if (!isValidForm(formName)) {
                return;
            }
            localStorageKey = formName;
            localStorageFormData = loadDataFromLocalStorage();
        }

        function addFormToExclusionList(formName) {
            if (!isValidForm(formName)) {
                return;
            }
            excludedForms[formName] = 1;
        }

        function isFormInExclusionList(formName) {
            return excludedForms.hasOwnProperty(formName);
        }

        function isValidForm(formName) {
            if (!formName) {
                logService.error('There are no "name" attribute on form.');
                return false;
            }
            return true;
        }

        function getStorableKeys(objectToStore) {
            return Object.keys(objectToStore).filter(function (key) {
                return !excludedFormFields.hasOwnProperty(key);
            });
        }

        /**
         * Custom replacer for JSON.stringify method
         * @param {String} key
         * @param {Object} value
         */
        function replacer(key, value) {
            var returnValue = key.indexOf('$') === 0 && key !== '$viewValue' || isValueEmpty(value) ? undefined : value;
            //do not process other forms but not skip root
            if (key !== '' && returnValue) {
                returnValue = value && value.hasOwnProperty(formObjectCheckString) ? undefined : value;
            }
            return returnValue;
        }

        function loadDataFromLocalStorage() {
            var dataAsString = $window.localStorage.getItem(localStorageKey);
            return $window.JSON.parse(dataAsString);
        }

        //TODO: add sub forms
        function saveDataToLocalStorage(formObject) {
            var jsonString = undefined;
            try {
                jsonString = $window.JSON.stringify(formObject, replacer);
            } catch (error) {
                logService.error(['Error saving form "', localStorageKey, '" to local storage: ', error].join(''));
            }
            // can't use angular localStorageService because it doesn't work with custom `replacer`
            $window.localStorage.setItem(localStorageKey, jsonString);
        }

        /**
         * populate form with data restored from local storage
         * @param {Object} formData data restored from local storage
         */
        function populateFormFromLocalStorage(formData) {
            if (!localStorageFormData || !formData) {
                return;
            }

            var storableKeys = getStorableKeys(formData);
            storableKeys.forEach(function (key) {
                var formField = formData[key];
                var storageField = localStorageFormData[key];
                if (formField && storageField) {
                    //do not taught control if it filled from other source
                    if (formField.$pristine) {
                        //TODO: repair combo-boxes
                        formField.$setViewValue(storageField.$viewValue);
                        formField.$render();
                    }
                }
            });
        }

        function addFieldToExclusionList(formFieldNamedName) {
            if (formFieldNamedName) {
                excludedFormFields[formFieldNamedName] = 1;
            }
        }

        function isValueEmpty(value) {
            if (!value) {
                return true;
            }
            if (value.hasOwnProperty('length')) {
                return value.length <= 0;
            }
            if (value.hasOwnProperty('$viewValue')) {
                return !value.$viewValue;
            }
            return false;
        }

        function clearStorageData() {
            $window.localStorage.setItem(localStorageKey, null);
        }
    }
});
//# sourceMappingURL=save-to-local-storage-controller.js.map
