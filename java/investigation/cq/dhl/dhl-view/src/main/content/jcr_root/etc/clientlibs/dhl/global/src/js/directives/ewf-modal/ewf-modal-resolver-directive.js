import ewf from 'ewf';

ewf.directive('ewfModalResolver', EwfModalResolver);

export default function EwfModalResolver() {
    return {
        restrict: 'EA',
        require: '^ewfModal',
        scope: {
            result: '=ewfModalResolver'
        },
        link
    };

    function link(scope, element, attrs, ewfModalCtrl) {
        element.click(() => {
            ewfModalCtrl.close(scope.result);
        });
    }
}
