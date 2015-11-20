import ewf from 'ewf';
import EwfSearchController from './ewf-search-controller';

ewf.directive('ewfSearch', ewfSearch);

function ewfSearch() {
    return {
        restrict: 'AE',
        controller: EwfSearchController,
        controllerAs: 'ewfSearchCtrl'
    };
}
