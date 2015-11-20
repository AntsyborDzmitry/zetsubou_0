define(['exports', 'module', './../../services/attrs-service', './column-customization/column-customization-service'], function (exports, module, _servicesAttrsService, _columnCustomizationColumnCustomizationService) {
    'use strict';

    module.exports = AddressBookController;

    AddressBookController.$inject = ['$q', '$scope', '$attrs', 'attrsService', 'columnCustomizationService', 'nlsService', 'ewfSpinnerService'];

    function AddressBookController($q, $scope, $attrs, attrsService, columnCustomizationService, nlsService, ewfSpinnerService) {
        var vm = this;

        var defaultColumnsToDisplay = ['nickName', 'contactName', 'address', 'city', 'country'];

        vm.bulkDeleteElements = bulkDeleteElements;
        vm.gridActionStatus = {};
        vm.notificationData = '';

        vm.onSelection = onSelection;
        vm.handleSearch = handleSearch;
        vm.handleColumnsChange = handleColumnsChange;
        vm.isPopup = !!$attrs.isPopup;

        populateColumns();

        function populateColumns() {
            var promise = columnCustomizationService.getColumnsInfo().then(function (responseData) {
                vm.availableColumns = responseData.available;
                delete responseData.available;
                var translationPromises = vm.availableColumns.map(function (column) {
                    return nlsService.getTranslation(column.title);
                });
                $q.all(translationPromises).then(function (translations) {
                    translations.forEach(function (translatedTitle, index) {
                        return vm.availableColumns[index].translatedTitle = translatedTitle;
                    });
                    vm.columnsToDisplay = vm.isPopup ? mapDefaultColumnsToDisplay(vm.availableColumns) : mapColumns(responseData);
                });
            });
            return ewfSpinnerService.applySpinner(promise);
        }

        function handleSearch(newData) {
            vm.gridCtrl.handleSearch(newData);
        }

        function bulkDeleteElements(messageCode) {
            vm.gridCtrl.bulkDeleteElements(messageCode);
        }

        function onSelection(selection, index) {
            attrsService.trigger($scope, $attrs, 'onSelection', { $selection: selection, $index: index });
        }

        function handleColumnsChange(selectedColumns) {
            vm.columnsToDisplay = Object.keys(selectedColumns).map(function (column) {
                return selectedColumns[column];
            });
            columnCustomizationService.updateColumnsInfo(selectedColumns);
        }

        function mapColumns(responseData) {
            return Object.keys(responseData).map(function (column) {
                return responseData[column];
            });
        }

        function mapDefaultColumnsToDisplay(availableColumns) {
            var mapDefColumns = function mapDefColumns(columnName) {
                return availableColumns.find(function (columnData) {
                    return columnData.alias === columnName;
                });
            };
            return defaultColumnsToDisplay.map(mapDefColumns);
        }
    }
});
//# sourceMappingURL=address-book-controller.js.map
