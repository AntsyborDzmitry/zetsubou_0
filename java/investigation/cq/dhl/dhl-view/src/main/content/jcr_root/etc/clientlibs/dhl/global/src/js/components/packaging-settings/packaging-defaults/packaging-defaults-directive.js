import ewf from 'ewf';
import PackagingDefaultsController from './packaging-defaults-controller';

ewf.directive('packagingDefaults', PackagingDefaults);

export default function PackagingDefaults() {
    return {
        restrict: 'E',
        controller: PackagingDefaultsController,
        controllerAs: 'packagingDefaultsCtrl',
        templateUrl: 'packaging-defaults-directive.html',
        link: {
            pre: preLink
        }
    };
}

function preLink(scope, element, attributes, packagingDefaultsCtrl) {
    packagingDefaultsCtrl.init();
}
