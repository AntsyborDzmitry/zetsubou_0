import ewf from 'ewf';
import EwfDataTableHeaderCellController from './ewf-data-table-header-cell-controller';

ewf.directive('ewfDataTableHeaderCell', ewfDataTableHeaderCell);

export default function ewfDataTableHeaderCell() {
    return {
        restrict: 'A',
        controller: EwfDataTableHeaderCellController,
        controllerAs: 'ewfDataTableHeaderCellCtrl',
        templateUrl: './ewf-data-table-header-cell-layout.html',
        require: '^ewfDataTable',
        scope: {
            property: '@dtProperty',
            caption: '@dtCaption',
            nlsCaption: '@dtNlsCaption',
            sortable: '=dtSortable'
        },
        link: {
            pre: preLink
        }
    };

    function preLink(scope, element, attrs, ewfDataTableCtrl) {
        Object.assign(scope, {
            ewfDataTableCtrl
        });
    }
}
