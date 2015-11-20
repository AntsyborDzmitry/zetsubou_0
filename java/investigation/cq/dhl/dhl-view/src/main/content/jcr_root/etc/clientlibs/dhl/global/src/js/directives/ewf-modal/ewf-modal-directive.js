import ewf from 'ewf';
import EwfModalController from './ewf-modal-controller';

ewf.directive('ewfModal', ewfModal);

export default function ewfModal() {
    return {
        restrict: 'EA',
        controller: EwfModalController,
        controllerAs: 'ewfModalCtrl',
        templateUrl: 'ewf-modal-layout.html',
        transclude: true,
        scope: {
            title: '@',
            nlsTitle: '@',
            dialogWidth: '@',
            noCloseButton: '=',
            noHeader: '='
        }
    };
}
