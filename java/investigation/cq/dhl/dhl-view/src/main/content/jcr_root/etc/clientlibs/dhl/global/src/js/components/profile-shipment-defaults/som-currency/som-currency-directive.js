import ewf from 'ewf';
import SomCurrencyController from './som-currency-controller';

ewf.directive('ewfSomCurrency', ewfSomCurrency);

export default function ewfSomCurrency() {
    return {
        restrict: 'AE',
        controller: SomCurrencyController,
        controllerAs: 'somCurrencyCtrl',
        link: {
            pre: preLink
        }
    };

    function preLink(scope, elem, attrs, controller) {
        controller.preloadDefaultSomAndCurrency();
        controller.preloadSectionFromUrl();
    }
}
