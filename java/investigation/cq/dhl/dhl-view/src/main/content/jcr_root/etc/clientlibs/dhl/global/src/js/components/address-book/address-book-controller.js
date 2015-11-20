import './../../services/attrs-service';
import './column-customization/column-customization-service';

AddressBookController.$inject = [
    '$q',
    '$scope',
    '$attrs',
    'attrsService',
    'columnCustomizationService',
    'nlsService',
    'ewfSpinnerService'
];

export default function AddressBookController(
    $q,
    $scope,
    $attrs,
    attrsService,
    columnCustomizationService,
    nlsService,
    ewfSpinnerService) {
    const vm = this;

    const defaultColumnsToDisplay = ['nickName', 'contactName', 'address', 'city', 'country'];

    vm.bulkDeleteElements = bulkDeleteElements;
    vm.gridActionStatus = {};
    vm.notificationData = '';

    vm.onSelection = onSelection;
    vm.handleSearch = handleSearch;
    vm.handleColumnsChange = handleColumnsChange;
    vm.isPopup = !!$attrs.isPopup;

    populateColumns();

    function populateColumns() {
        const promise = columnCustomizationService.getColumnsInfo()
            .then((responseData) => {
                vm.availableColumns = responseData.available;
                delete responseData.available;
                const translationPromises = vm.availableColumns.map((column) =>
                    nlsService.getTranslation(column.title)
                );
                $q.all(translationPromises)
                    .then((translations) => {
                        translations.forEach((translatedTitle, index) =>
                            vm.availableColumns[index].translatedTitle = translatedTitle
                        );
                        vm.columnsToDisplay = vm.isPopup
                            ? mapDefaultColumnsToDisplay(vm.availableColumns)
                            : mapColumns(responseData);
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
        attrsService.trigger($scope, $attrs, 'onSelection', {$selection: selection, $index: index});
    }

    function handleColumnsChange(selectedColumns) {
        vm.columnsToDisplay = Object.keys(selectedColumns).map((column) => selectedColumns[column]);
        columnCustomizationService.updateColumnsInfo(selectedColumns);
    }

    function mapColumns(responseData) {
        return Object.keys(responseData).map((column) => responseData[column]);
    }

    function mapDefaultColumnsToDisplay(availableColumns) {
        const mapDefColumns = (columnName) => availableColumns.find((columnData) => columnData.alias === columnName);
        return defaultColumnsToDisplay.map(mapDefColumns);
    }
}
