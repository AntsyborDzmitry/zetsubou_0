import ewf from 'ewf';
import './ewf-field-controller';

ewf.directive('ewfField', ewfField);

export default function ewfField() {
    return {
        restrict: 'A',
        priority: 2,
        scope: true,
        controller: 'EwfFieldController',
        require: ['^ewfForm', 'ewfField'],
        link: {
            pre: preLink
        }
    };
}

function preLink(scope, element, attrs, controllers) {
    const [formCtrl, fieldCtrl] = controllers;
    fieldCtrl.name = attrs.ewfField;
    fieldCtrl.ewfFormCtrl = formCtrl;
}
