import ewf from 'ewf';

ewf.directive('nlsBind', nlsBind);

export default function nlsBind() {
    return {
        restrict: 'A',
        require: 'nls',
        link: function(scope, element, attrs, nlsCtrl) {
            attrs.$observe('nls', (value) => {
                nlsCtrl.translate(value);
            });
        }
    };
}
