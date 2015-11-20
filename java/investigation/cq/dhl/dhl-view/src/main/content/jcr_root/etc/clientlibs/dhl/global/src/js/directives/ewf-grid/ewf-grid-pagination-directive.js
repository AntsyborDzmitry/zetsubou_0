import ewf from 'ewf';

import EwfGridPaginationController from './ewf-grid-pagination-controller';
import './ewf-grid-directive';

ewf.directive('ewfGridPagination', EwfGridPagination);

export default function EwfGridPagination() {
    return {
        restrict: 'AE',
        controller: EwfGridPaginationController,
        controllerAs: 'ewfGridPaginationCtrl',
        templateUrl: 'ewf-grid-pagination-layout.html',
        require: ['ewfGrid', 'ewfGridPagination', '?^ewfContainer'],
        scope: true
    };
}
