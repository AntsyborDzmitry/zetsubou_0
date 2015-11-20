import ewf from 'ewf';
import ItarEeiController from './ewf-itar-eei-controller';
import './../../../../../directives/ewf-container/ewf-container-directive';
import './../../../../../filters/calculate-total-filter';
import './../../../../../filters/convert-uom-filter';
import './../../../../../directives/ewf-validate/ewf-validate-max-directive';

ewf.directive('ewfItarEei', ewfItarEei);

export default function ewfItarEei() {
    return {
        restrict: 'EA',
        controller: ItarEeiController,
        controllerAs: 'itarEeiCtrl',
        templateUrl: 'eei.html',
        require: ['ewfItarEei', '^ewfContainer'],
        link: {
            pre: function(scope, element, attributes, controllers) {
                const [itarEeiCtrl, ewfContainerCtrl] = controllers;
                ewfContainerCtrl.registerControllerInstance('itarEeiCtrl', itarEeiCtrl);

                const itemAttrCtrl = ewfContainerCtrl.getRegisteredControllerInstance('itemAttrCtrl');
                if (itemAttrCtrl) {
                    itemAttrCtrl.itemAttrFormCtrl.onNextClick();
                    itemAttrCtrl.onNextClick();
                }
                itarEeiCtrl.init();
            }
        }
    };
}
