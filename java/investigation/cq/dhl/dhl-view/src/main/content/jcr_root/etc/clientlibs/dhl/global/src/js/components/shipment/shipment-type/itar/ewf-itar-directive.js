import ewf from 'ewf';
import ItarController from './ewf-itar-controller';
import './../../../../directives/ewf-container/ewf-container-directive';

ewf.directive('ewfItar', ewfItar);

export default function ewfItar() {
    let ewfContainerCtrl, itarCtrl;

    function setItarEeiCtrlLink() {
        const itarEeiCtrl = ewfContainerCtrl.getRegisteredControllerInstance('itarEeiCtrl');
        itarCtrl.itarEeiCtrl = itarEeiCtrl;
    }

    return {
        restrict: 'EA',
        controller: ItarController,
        controllerAs: 'itarCtrl',
        templateUrl: 'itar.html',
        require: ['ewfItar', '^ewfContainer'],
        link: {
            pre: function(scope, element, attributes, controllers) {
                [itarCtrl, ewfContainerCtrl] = controllers;
                ewfContainerCtrl.registerControllerInstance('itarCtrl', itarCtrl);
                ewfContainerCtrl.registerCallback('itarEeiCtrl', setItarEeiCtrlLink);

                itarCtrl.init();
            }
        }
    };
}
