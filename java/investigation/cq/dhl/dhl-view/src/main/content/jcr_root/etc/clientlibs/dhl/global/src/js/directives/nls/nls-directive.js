import ewf from 'ewf';
import NLSController from './nls-controller';
import './nls-bind-directive';


ewf.directive('nls', function() {
    return {
        restrict: 'A',
        controller: NLSController,
        link: {
            pre: preLink
        }
    };
});

function preLink(scope, element, attributes, controller) {
    function render(value) {
        const text = value.text;
        if (text) {
            element.text(text);
            delete value.text;
        }

        const keys = Object.keys(value);
        keys.forEach((key) => {
            element.attr(key, value[key]);
        });
    }

    controller.setRenderFunction(render);

    controller.translate(attributes.nls);
}
