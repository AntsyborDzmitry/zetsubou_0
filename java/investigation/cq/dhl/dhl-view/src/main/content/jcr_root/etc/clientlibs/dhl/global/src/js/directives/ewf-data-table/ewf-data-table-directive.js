import ewf from 'ewf';

import EwfDataTableController from './ewf-data-table-controller';

ewf.directive('ewfDataTable', ewfDataTable);

export default function ewfDataTable() {
    return {
        restrict: 'A',
        controller: EwfDataTableController,
        controllerAs: 'ewfDataTableCtrl',
        scope: {
            data: '=dtData',
            sorting: '=dtSorting'
        }
    };
}
