import ewf from 'ewf';
import './../../services/attrs-service';

ewf.controller('ewfProgressBarController', EwfProgressBarController);

EwfProgressBarController.$inject = ['$scope', '$attrs', 'attrsService'];

export default function EwfProgressBarController($scope, $attrs, attrsService) {
    const vm = this;

    attrsService.track($scope, $attrs, 'ewfProgress', vm, null, 'progress');
}
