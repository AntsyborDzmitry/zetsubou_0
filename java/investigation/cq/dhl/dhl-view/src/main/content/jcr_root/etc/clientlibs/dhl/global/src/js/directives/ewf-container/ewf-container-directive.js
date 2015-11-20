import ewf from 'ewf';
import EwfContainerController from './ewf-container-controller';

ewf.directive('ewfContainer', ewfContainer);

export default function ewfContainer() {
    return {
        restrict: 'A',
        controller: EwfContainerController
    };
}

