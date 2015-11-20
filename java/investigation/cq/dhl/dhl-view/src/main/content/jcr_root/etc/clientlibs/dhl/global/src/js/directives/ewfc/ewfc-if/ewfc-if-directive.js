import ewf from 'ewf';
import EwfcIfController from './ewfc-if-controller';

ewf.directive('ewfcIf', ewfcIf);

ewfcIf.$inject = ['ngIfDirective'];
export default function ewfcIf(ngIfDirective) {
    const ngIf = ngIfDirective[0];

    return {
        transclude: ngIf.transclude,
        priority: ngIf.priority,
        terminal: ngIf.terminal,
        restrict: ngIf.restrict,
        controller: EwfcIfController,
        link: function($scope, $element, $attr, controller) {
            const ciRequest = $attr.ewfcIf;

            controller.setRenderFunction(render($attr, arguments));
            controller.setValue(ciRequest);
        }
    };

    function render($attr, args) {
        return (response) => {
            $attr.ngIf = () => response;
            ngIf.link.apply(ngIf, args);
        };
    }

}
