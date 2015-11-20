import ewf from 'ewf';
import EwfLocationController from './ewf-location-controller';

ewf.directive('ewfLocation', EwfLocation);

export default function EwfLocation() {
    return {
        restrict: 'EA',
        controller: EwfLocationController,
        controllerAs: 'locationCtrl'
    };
}
