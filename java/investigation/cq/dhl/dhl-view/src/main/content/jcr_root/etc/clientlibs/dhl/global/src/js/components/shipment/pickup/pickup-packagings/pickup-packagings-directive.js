import ewf from 'ewf';
import PickupPackagingsCtrl from './pickup-packagings-controller';

ewf.directive('pickupPackagings', PickupPackagings);

export default function PickupPackagings() {
    return {
        restrict: 'AE',
        require: 'pickupPackagings',
        controller: PickupPackagingsCtrl,
        controllerAs: 'pickupPackagingsCtrl',
        templateUrl: 'pickup-packagings.html',
        link: {post},
        scope: {
            packagings: '=ngModel',
            country: '='
        }
    };

    function post(scope, element, attrs, ctrl) {
        ctrl.packagings = scope.packagings;

        if (!scope.packagings.length) {
            ctrl.addPackaging();
        }

        scope.$watch('country', ctrl.onShipperCountryUpdate);
    }
}
