define(['exports', 'module', 'ewf'], function (exports, module, _ewf) {
    'use strict';

    module.exports = calculateTotal;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _ewf2 = _interopRequireDefault(_ewf);

    _ewf2['default'].filter('calculateTotal', calculateTotal);

    function calculateTotal() {

        return function (data, key, quantity) {
            if (!data) {
                return 0;
            }

            var total = data.reduce(function (currentTotal, item) {
                var currentValue = parseFloat(item[key]);
                if (quantity) {
                    currentValue *= parseFloat(item[quantity]);
                }
                return currentTotal + (currentValue || 0);
            }, 0);

            return +total.toFixed(3);
        };
    }
});
//# sourceMappingURL=calculate-total-filter.js.map
