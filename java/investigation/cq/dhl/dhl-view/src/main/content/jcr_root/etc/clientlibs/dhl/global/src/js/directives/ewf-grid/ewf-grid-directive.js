import ewf from 'ewf';
import './../ewf-container/ewf-container-directive';
import './../../directives/ewf-modal/ewf-modal-directive';

import EwfGridController from './ewf-grid-controller';

ewf.directive('ewfGrid', ewfGrid);

export default function ewfGrid() {
    return {
        restrict: 'AE',
        controller: EwfGridController,
        controllerAs: 'ewfGridCtrl',
        templateUrl: 'ewf-grid-layout.html',
        require: ['ewfGrid', '?^ewfContainer'],
        link: {
            pre: preLink,
            post: postLink
        }
    };

    function preLink(scope, element, attrs, ctrls) {
        const [ewfGridController, ewfContainerController] = ctrls;
        if (ewfContainerController) {
            ewfContainerController.registerControllerInstance('grid', ewfGridController);
        } else {
            const error = new Error('Grid could not exists separately from parent directive');
            throw error;
        }
    }

    function postLink(scope, element, attrs, ctrls) {
        const ewfGridController = ctrls[0];
        ewfGridController.gridInit();
    }
}
