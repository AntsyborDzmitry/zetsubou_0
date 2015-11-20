define(['exports', 'module', 'ewf', './som-currency-controller'], function (exports, module, _ewf, _somCurrencyController) {
    'use strict';

    module.exports = ewfSomCurrency;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    var _SomCurrencyController = _interopRequireDefault(_somCurrencyController);

    _ewf2['default'].directive('ewfSomCurrency', ewfSomCurrency);

    function ewfSomCurrency() {
        return {
            restrict: 'AE',
            controller: _SomCurrencyController['default'],
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
});
//# sourceMappingURL=som-currency-directive.js.map
