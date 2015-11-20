import ewf from 'ewf';
import EwfcValueController from './ewfc-value-controller';

ewf.directive('ewfcValue', ewfcValue);

export default function ewfcValue() {
    return {
        restrict: 'A',
        controller: EwfcValueController,
        link: {
            pre: preLink
        }
    };
}

function preLink(scope, element, attributes, controller) {
    function render(ciValue) {
        const text = ciValue.data.value;
        if (text) {
            element.text(text);
        }
    }

    controller.setRenderFunction(render);

    controller.setValue(attributes.ewfcValue);
}
