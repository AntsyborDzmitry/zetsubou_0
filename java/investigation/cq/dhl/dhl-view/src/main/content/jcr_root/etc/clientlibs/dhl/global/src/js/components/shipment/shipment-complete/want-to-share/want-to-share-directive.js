import ewf from 'ewf';
import './../../../../directives/ewf-modal/ewf-modal-directive';

import WantToShareController from './want-to-share-controller';

ewf.directive('wantToShare', wantToShare);

function wantToShare() {
    return {
        restrict: 'EA',
        controller: WantToShareController,
        controllerAs: 'wtsCtrl',
        templateUrl: 'want-to-share-layout.html'
    };
}
